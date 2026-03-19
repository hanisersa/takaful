import { NextResponse } from 'next/server';
import { findUser, comparePassword, safeUser } from '@/models/User';
import { signToken } from '@/lib/auth';

// Force Node.js runtime (required for mongoose/bcryptjs on Vercel)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUser({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const userData = safeUser(user);
    const token = signToken(userData.id);

    userData.memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return NextResponse.json(
      { message: 'Login successful', user: userData, token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error?.message, error?.stack);
    const message = error?.message?.includes('ECONNREFUSED') || error?.message?.includes('MongoServerSelectionError')
      ? 'Database connection failed. Please try again in a moment.'
      : error?.message?.includes('querySrv')
      ? 'DNS resolution failed for database. Check your connection string.'
      : 'Something went wrong. Please try again.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
