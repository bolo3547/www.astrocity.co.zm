import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProjectForm } from '../project-form';

export const metadata: Metadata = {
  title: 'Edit Project - Admin',
};

async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    return project;
  } catch {
    return null;
  }
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Edit Project</h1>
        <p className="text-navy-500 mt-1">Update project details</p>
      </div>

      <ProjectForm initialData={project} />
    </div>
  );
}
