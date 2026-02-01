import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { settingsSchema } from '@/lib/validations';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Convert phones array to JSON string for SQLite
    if (Array.isArray(body.phones)) {
      body.phones = JSON.stringify(body.phones);
    }
    
    // Validate input
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Get existing settings
    const existing = await prisma.settings.findFirst();

    if (existing) {
      // Update existing settings
      const settings = await prisma.settings.update({
        where: { id: existing.id },
        data: result.data,
      });
      return NextResponse.json(settings);
    } else {
      // Create new settings
      const settings = await prisma.settings.create({
        data: result.data,
      });
      return NextResponse.json(settings);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
