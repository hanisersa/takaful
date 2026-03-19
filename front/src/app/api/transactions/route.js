import { NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/apiAuth';
import { createTransaction, findTransactionsByUser, findExistingTransaction } from '@/models/Transaction';
import { findServiceById } from '@/models/Service';
import { createNotification } from '@/models/Notification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/transactions — get current user's transactions
export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    const transactions = await findTransactionsByUser(user._id);

    const result = transactions.map((t) => ({
      id: t._id.toString(),
      service: t.service ? { id: t.service._id.toString(), title: t.service.title, category: t.service.category, points: t.service.points } : null,
      requester: t.requester ? { id: t.requester._id.toString(), name: `${t.requester.firstName} ${t.requester.lastName}`, avatar: t.requester.avatar, phone: t.requester.phone || '' } : null,
      provider: t.provider ? { id: t.provider._id.toString(), name: `${t.provider.firstName} ${t.provider.lastName}`, avatar: t.provider.avatar } : null,
      points: t.points,
      message: t.message,
      status: t.status,
      requesterConfirmed: !!t.requesterConfirmed,
      providerConfirmed: !!t.providerConfirmed,
      isRequester: t.requester?._id.toString() === user._id.toString(),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return NextResponse.json({ transactions: result }, { status: 200 });
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST /api/transactions — request a service (creates pending transaction + notification)
export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    const body = await request.json();
    const { serviceId, message } = body;

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    // Get the service
    const service = await findServiceById(serviceId);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Can't request your own service
    if (service.provider._id.toString() === user._id.toString()) {
      return NextResponse.json({ error: "You can't request your own service" }, { status: 400 });
    }

    // Check if user already has an active transaction for this service
    const existing = await findExistingTransaction(service._id, user._id);
    if (existing) {
      return NextResponse.json(
        { error: 'You already have an active request for this service', transactionId: existing._id.toString(), status: existing.status },
        { status: 409 }
      );
    }

    // Check if requester has enough points
    if (user.points < service.points) {
      return NextResponse.json(
        { error: `Not enough points. You have ${user.points} but this service costs ${service.points} points.` },
        { status: 400 }
      );
    }

    // Create the transaction
    const transaction = await createTransaction({
      service: service._id,
      requester: user._id,
      provider: service.provider._id,
      points: service.points,
      message: message || '',
      status: 'pending',
    });

    // Create notification for the provider
    await createNotification({
      recipient: service.provider._id,
      type: 'service_request',
      transaction: transaction._id,
      message: `${user.firstName} ${user.lastName} requested your service "${service.title}" for ${service.points} points.`,
    });

    return NextResponse.json(
      { message: 'Service requested successfully', transactionId: transaction._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to request service' }, { status: 500 });
  }
}
