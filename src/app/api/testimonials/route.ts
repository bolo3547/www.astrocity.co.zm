import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET all testimonials (public - no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');

    const testimonials = await prisma.testimonial.findMany({
      where: {
        ...(featured === 'true' && { isFeatured: true }),
        ...(active !== 'false' && { isActive: true }),
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST create testimonial (auth required)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        company: body.company || null,
        role: body.role || null,
        content: body.content,
        rating: body.rating || 5,
        photo: body.photo || null,
        projectType: body.projectType || null,
        location: body.location || null,
        order: body.order || 0,
        isFeatured: body.isFeatured || false,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
