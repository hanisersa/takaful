import { NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/apiAuth';
import { findTransactionById, updateTransaction } from '@/models/Transaction';
import { createNotification } from '@/models/Notification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH /api/transactions/:id/respond — provider accepts or refuses a request
export async function PATCH(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'accept' or 'refuse'

    if (!['accept', 'refuse'].includes(action)) {
      return NextResponse.json({ error: 'Action must be "accept" or "refuse"' }, { status: 400 });
    }

    const transaction = await findTransactionById(id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Only the provider can respond
    if (transaction.provider._id.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Only the service provider can respond' }, { status: 403 });
    }

    // Must be in pending status
    if (transaction.status !== 'pending') {
      return NextResponse.json({ error: `Cannot respond to a transaction in "${transaction.status}" status` }, { status: 400 });
    }

    if (action === 'accept') {
      // Check that requester still has enough points
      const { findUserById } = await import('@/models/User');
      const requester = await findUserById(transaction.requester._id);
      if (!requester || requester.points < transaction.points) {
        return NextResponse.json({ error: 'Requester no longer has enough points' }, { status: 400 });
      }

      await updateTransaction(id, { status: 'accepted' });

      await createNotification({
        recipient: transaction.requester._id,
        type: 'request_accepted',
        transaction: transaction._id,
        message: `${user.firstName} ${user.lastName} accepted your request for "${transaction.service.title}". The work will begin soon!`,
      });

      return NextResponse.json({ message: 'Request accepted', status: 'accepted' }, { status: 200 });
    } else {
      await updateTransaction(id, { status: 'refused' });

      await createNotification({
        recipient: transaction.requester._id,
        type: 'request_refused',
        transaction: transaction._id,
        message: `${user.firstName} ${user.lastName} declined your request for "${transaction.service.title}".`,
      });

      return NextResponse.json({ message: 'Request refused', status: 'refused' }, { status: 200 });
    }
  } catch (error) {
    console.error('PATCH /api/transactions/:id/respond error:', error);
    return NextResponse.json({ error: 'Failed to respond to request' }, { status: 500 });
  }
}
