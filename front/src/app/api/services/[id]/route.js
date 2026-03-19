import { NextResponse } from 'next/server';
import { findServiceById } from '@/models/Service';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/services/:id — get single service details
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const service = await findServiceById(id);

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const result = {
      id: service._id.toString(),
      title: service.title,
      description: service.description,
      category: service.category,
      points: service.points,
      location: service.location,
      availability: service.availability,
      tags: service.tags,
      provider: service.provider
        ? `${service.provider.firstName} ${service.provider.lastName}`
        : 'Unknown',
      providerId: service.provider?._id?.toString() || null,
      providerAvatar: service.provider?.avatar || '👤',
      providerLocation: service.provider?.location || '',
      rating: service.provider?.rating || 0,
      phone: service.provider?.phone || '',
      email: service.provider?.email || '',
      reviews: 0,
      createdAt: service.createdAt,
    };

    return NextResponse.json({ service: result }, { status: 200 });
  } catch (error) {
    console.error('GET /api/services/:id error:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}
