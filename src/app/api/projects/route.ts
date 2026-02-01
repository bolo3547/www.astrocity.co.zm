import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Convert arrays to JSON strings for SQLite
    if (Array.isArray(body.images)) {
      body.images = JSON.stringify(body.images);
    }
    if (Array.isArray(body.services)) {
      body.services = JSON.stringify(body.services);
    }
    
    // Validate input
    const result = projectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = {
      ...result.data,
      completedAt: result.data.completedAt ? new Date(result.data.completedAt) : null,
    };

    const project = await prisma.project.create({
      data,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
