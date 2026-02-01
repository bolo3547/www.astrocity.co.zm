import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ServiceForm } from '../service-form';

export const metadata: Metadata = {
  title: 'Edit Service - Admin',
};

async function getService(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    return service;
  } catch {
    return null;
  }
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Edit Service</h1>
        <p className="text-navy-500 mt-1">Update service details</p>
      </div>

      <ServiceForm initialData={service} />
    </div>
  );
}
