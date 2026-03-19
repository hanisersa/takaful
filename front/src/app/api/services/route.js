import { NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/apiAuth';
import { createService, findServices } from '@/models/Service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/services — list all available services
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    const query = {};
    if (category && category !== 'All') query.category = category;
    if (location && location !== 'All') query.location = location;

    let services = await findServices(query);

    // Text search filter (title, tags)
    if (search) {
      const q = search.toLowerCase();
      services = services.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const result = services.map((s) => ({
      id: s._id.toString(),
      title: s.title,
      description: s.description,
      category: s.category,
      points: s.points,
      location: s.location,
      availability: s.availability,
      tags: s.tags,
      provider: s.provider
        ? `${s.provider.firstName} ${s.provider.lastName}`
        : 'Unknown',
      providerId: s.provider?._id?.toString() || null,
      providerAvatar: s.provider?.avatar || '👤',
      rating: s.provider?.rating || 0,
      reviews: 0,
      createdAt: s.createdAt,
    }));

    return NextResponse.json({ services: result }, { status: 200 });
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST /api/services — create a new service (requires auth)
export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    const body = await request.json();
    const { title, description, category, points, location, availability, tags } = body;

    if (!title || !category || !points || !location) {
      return NextResponse.json(
        { error: 'Title, category, points, and location are required' },
        { status: 400 }
      );
    }

    const service = await createService({
      provider: user._id,
      title,
      description: description || '',
      category,
      points: Number(points),
      location: location || user.location || '',
      availability: availability || 'available',
      tags: tags || [],
    });

    return NextResponse.json(
      { message: 'Service created successfully', service: { id: service._id.toString(), ...service.toObject() } },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/services error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
