import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referenceNo, email } = body;

    if (!referenceNo || !email) {
      return NextResponse.json(
        { error: 'Reference number and email are required' },
        { status: 400 }
      );
    }

    // Find quote by reference number and email
    const quote = await prisma.quote.findFirst({
      where: {
        referenceNo: referenceNo.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
      },
      select: {
        referenceNo: true,
        name: true,
        service: true,
        location: true,
        status: true,
        adminResponse: true,
        respondedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'No quote found with that reference number and email combination' },
        { status: 404 }
      );
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error tracking quote:', error);
    return NextResponse.json(
      { error: 'Failed to track quote' },
      { status: 500 }
    );
  }
}
