import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import { QuotationBuilder } from './quotation-builder';

export const metadata: Metadata = {
  title: 'Create Quotation - Admin',
};

async function getData(id: string) {
  const [quote, settings, services] = await Promise.all([
    prisma.quote.findUnique({ where: { id } }),
    prisma.settings.findFirst(),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
  ]);
  return { quote, settings, services };
}

export default async function QuotationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { quote, settings, services } = await getData(id);

  if (!quote) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/admin/quotes/${id}`}
        className="inline-flex items-center text-sm text-navy-600 hover:text-navy-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Quote
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Create Quotation</h1>
        <p className="text-navy-500 mt-1">
          Build a professional quotation for {quote.name}
        </p>
      </div>

      <QuotationBuilder
        quote={quote}
        settings={settings}
        services={services}
      />
    </div>
  );
}
