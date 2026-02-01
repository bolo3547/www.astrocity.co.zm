import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all client logos
export async function GET() {
  try {
    const logos = await prisma.clientLogo.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(logos);
  } catch (error) {
    console.error('Failed to fetch client logos:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST create new client logo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const logo = await prisma.clientLogo.create({
      data: {
        name: body.name,
        logoUrl: body.logoUrl,
        website: body.websiteUrl || null,
        isActive: body.isActive ?? true,
        order: body.order || 0,
      },
    });
    
    return NextResponse.json(logo);
  } catch (error) {
    console.error('Failed to create client logo:', error);
    return NextResponse.json({ error: 'Failed to create logo' }, { status: 500 });
  }
}
