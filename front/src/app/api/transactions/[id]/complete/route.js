import { NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/apiAuth';
import { createNotification } from '@/models/Notification';
import { findUserById, updateUser } from '@/models/User';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH /api/transactions/:id/complete — confirm job done (two-way confirmation)
// Uses raw MongoDB operations to guarantee requesterConfirmed/providerConfirmed persist
export async function PATCH(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    await dbConnect();

    // Use raw MongoDB to read the transaction (bypass Mongoose model cache issues)
    const db = mongoose.connection.db;
    const txCollection = db.collection('transactions');

    let txObjectId;
    try {
      txObjectId = new mongoose.Types.ObjectId(id);
    } catch {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    // Fetch transaction with populated refs
    const transaction = await txCollection.findOne({ _id: txObjectId });
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const isRequester = transaction.requester.toString() === user._id.toString();
    const isProvider = transaction.provider.toString() === user._id.toString();
    if (!isRequester && !isProvider) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Must be in accepted status
    if (transaction.status !== 'accepted') {
      return NextResponse.json(
        { error: `Cannot confirm a transaction in "${transaction.status}" status. It must be "accepted" first.` },
        { status: 400 }
      );
    }

    // Check if this party already confirmed
    if (isRequester && transaction.requesterConfirmed === true) {
      return NextResponse.json({ error: 'You have already confirmed completion' }, { status: 400 });
    }
    if (isProvider && transaction.providerConfirmed === true) {
      return NextResponse.json({ error: 'You have already confirmed completion' }, { status: 400 });
    }

    // Build the $set update
    const $set = {};
    if (isRequester) $set.requesterConfirmed = true;
    if (isProvider) $set.providerConfirmed = true;

    // Check if both parties will have confirmed after this update
    const requesterDone = isRequester ? true : transaction.requesterConfirmed === true;
    const providerDone = isProvider ? true : transaction.providerConfirmed === true;
    const bothConfirmed = requesterDone && providerDone;

    // Fetch populated user data for notifications
    const requesterUser = await findUserById(transaction.requester);
    const providerUser = await findUserById(transaction.provider);
    // Fetch service title
    const serviceDoc = await db.collection('services').findOne({ _id: transaction.service });
    const serviceTitle = serviceDoc?.title || 'Service';

    if (bothConfirmed) {
      // --- POINT TRANSFER ---
      if (!requesterUser) {
        return NextResponse.json({ error: 'Requester user not found' }, { status: 404 });
      }
      if (requesterUser.points < transaction.points) {
        return NextResponse.json(
          { error: `Requester only has ${requesterUser.points} points but the service costs ${transaction.points} points.` },
          { status: 400 }
        );
      }

      // Deduct from requester
      await updateUser(requesterUser._id, {
        points: requesterUser.points - transaction.points,
        completedServices: (requesterUser.completedServices || 0) + 1,
      });

      // Add to provider
      await updateUser(providerUser._id, {
        points: (providerUser.points || 0) + transaction.points,
        completedServices: (providerUser.completedServices || 0) + 1,
      });

      $set.status = 'completed';

      // Save using raw MongoDB $set (guaranteed to persist)
      await txCollection.updateOne({ _id: txObjectId }, { $set });

      // Notify both
      await createNotification({
        recipient: transaction.requester,
        type: 'service_completed',
        transaction: transaction._id,
        message: `Service "${serviceTitle}" is completed! ${transaction.points} points have been transferred to ${providerUser.firstName} ${providerUser.lastName}.`,
      });
      await createNotification({
        recipient: transaction.provider,
        type: 'points_received',
        transaction: transaction._id,
        message: `You earned ${transaction.points} points for completing "${serviceTitle}"!`,
      });

      return NextResponse.json({
        message: 'Both parties confirmed! Points transferred.',
        status: 'completed',
        requesterConfirmed: true,
        providerConfirmed: true,
        pointsTransferred: transaction.points,
      }, { status: 200 });
    } else {
      // Only one party confirmed so far — save flag using raw MongoDB
      await txCollection.updateOne({ _id: txObjectId }, { $set });

      // Notify the other party
      const otherPartyId = isRequester ? transaction.provider : transaction.requester;
      const confirmerName = `${user.firstName} ${user.lastName}`;
      await createNotification({
        recipient: otherPartyId,
        type: 'service_completed',
        transaction: transaction._id,
        message: `${confirmerName} confirmed the job for "${serviceTitle}" is done. Please confirm from your side to complete the transaction.`,
      });

      return NextResponse.json({
        message: `You confirmed. Waiting for the ${isRequester ? 'provider' : 'requester'} to confirm.`,
        status: 'accepted',
        requesterConfirmed: requesterDone,
        providerConfirmed: providerDone,
      }, { status: 200 });
    }
  } catch (error) {
    console.error('PATCH /api/transactions/:id/complete error:', error);
    return NextResponse.json({ error: 'Failed to complete transaction' }, { status: 500 });
  }
}
