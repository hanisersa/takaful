import { NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/apiAuth';
import { markNotificationRead } from '@/models/Notification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH /api/notifications/:id/read — mark a single notification as read
export async function PATCH(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    await markNotificationRead(id);

    return NextResponse.json({ message: 'Notification marked as read' }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/notifications/:id/read error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
