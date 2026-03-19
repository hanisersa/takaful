import { NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/apiAuth';
import { findNotificationsByUser, markAllNotificationsRead, countUnreadNotifications } from '@/models/Notification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/notifications — get current user's notifications
export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    const notifications = await findNotificationsByUser(user._id);
    const unreadCount = await countUnreadNotifications(user._id);

    const result = notifications.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      message: n.message,
      isRead: n.isRead,
      transaction: n.transaction
        ? {
            id: n.transaction._id.toString(),
            status: n.transaction.status,
            points: n.transaction.points,
            service: n.transaction.service ? { title: n.transaction.service.title, category: n.transaction.service.category } : null,
            requester: n.transaction.requester ? { name: `${n.transaction.requester.firstName} ${n.transaction.requester.lastName}`, avatar: n.transaction.requester.avatar } : null,
            provider: n.transaction.provider ? { name: `${n.transaction.provider.firstName} ${n.transaction.provider.lastName}`, avatar: n.transaction.provider.avatar } : null,
          }
        : null,
      createdAt: n.createdAt,
    }));

    return NextResponse.json({ notifications: result, unreadCount }, { status: 200 });
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// PATCH /api/notifications — mark all as read
export async function PATCH(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    await markAllNotificationsRead(user._id);

    return NextResponse.json({ message: 'All notifications marked as read' }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/notifications error:', error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}
