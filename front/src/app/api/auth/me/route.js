import { NextResponse } from 'next/server';
import { findUserById, safeUser } from '@/models/User';
import { verifyToken } from '@/lib/auth';

// Force Node.js runtime (required for mongoose/bcryptjs on Vercel)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = await findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = safeUser(user);
    userData.memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
