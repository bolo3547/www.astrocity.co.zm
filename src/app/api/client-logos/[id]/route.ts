import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single client logo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const logo = await prisma.clientLogo.findUnique({
      where: { id },
    });
    
    if (!logo) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 });
    }
    
    return NextResponse.json(logo);
  } catch (error) {
    console.error('Failed to fetch logo:', error);
    return NextResponse.json({ error: 'Failed to fetch logo' }, { status: 500 });
  }
}

// PUT update client logo
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const logo = await prisma.clientLogo.update({
      where: { id },
      data: {
        name: body.name,
        logoUrl: body.logoUrl,
        website: body.websiteUrl || null,
        isActive: body.isActive,
        order: body.order,
      },
    });
    
    return NextResponse.json(logo);
  } catch (error) {
    console.error('Failed to update logo:', error);
    return NextResponse.json({ error: 'Failed to update logo' }, { status: 500 });
  }
}

// DELETE client logo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.clientLogo.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete logo:', error);
    return NextResponse.json({ error: 'Failed to delete logo' }, { status: 500 });
  }
}
