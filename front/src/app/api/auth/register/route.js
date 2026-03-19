import { NextResponse } from 'next/server';
import { findUser, createUser, hashPassword, safeUser } from '@/models/User';
import { signToken } from '@/lib/auth';

// Force Node.js runtime (required for mongoose/bcryptjs on Vercel)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, location } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUser({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await createUser({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      location: location || '',
    });

    // Generate token
    const userData = safeUser(user);
    const token = signToken(userData.id);

    userData.memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return NextResponse.json(
      { message: 'Account created successfully', user: userData, token },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
