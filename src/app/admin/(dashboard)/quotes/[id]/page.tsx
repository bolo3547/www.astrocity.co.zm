import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowLeft, Mail, Phone, MapPin, Building, Calendar, FileText, Download, Send, CheckCircle, Eye } from 'lucide-react';
import { QuoteStatusForm } from './quote-status-form';

export const metadata: Metadata = {
  title: 'Quote Details - Admin',
};

async function getQuote(id: string) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
    });
    return quote;
  } catch {
    return null;
  }
}

function formatCurrency(amount: number, currency: string = 'ZMW') {
  return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await getQuote(id);

  if (!quote) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/quotes"
        className="inline-flex items-center text-sm text-navy-600 hover:text-navy-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Quotes
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quotation Status Card */}
          <div className="admin-card bg-gradient-to-r from-solar-50 to-accent-50 border-solar-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-solar-600" />
                  Quotation
                </h2>
                {quote.quotationNumber ? (
                  <div className="mt-2">
                    <p className="text-sm text-navy-600">
                      Number: <span className="font-mono font-bold text-navy-900">{quote.quotationNumber}</span>
                    </p>
                    {quote.totalAmount && (
                      <p className="text-lg font-bold text-solar-600 mt-1">
                        {formatCurrency(quote.totalAmount, quote.currency)}
                      </p>
                    )}
                    {quote.pdfSentAt && (
                      <p className="text-xs text-accent-600 flex items-center gap-1 mt-2">
                        <CheckCircle className="w-3 h-3" />
                        Sent on {new Date(quote.pdfSentAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-navy-500 mt-1">No quotation generated yet</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/admin/quotes/${id}/quotation`}
                  className="admin-btn-primary flex items-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  {quote.quotationNumber ? 'Edit Quotation' : 'Create Quotation'}
                </Link>
                {quote.quotationNumber && (
                  <>
                    <a
                      href={`/api/quotes/${id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-navy-100 text-navy-700 font-medium text-sm hover:bg-navy-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View PDF
                    </a>
                    <a
                      href={`/api/quotes/${id}/download`}
                      className="admin-btn-secondary flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="admin-card">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-navy-900">{quote.name}</h3>
                {quote.company && (
                  <p className="text-navy-500">{quote.company}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${quote.email}`}
                  className="inline-flex items-center gap-2 text-sm text-solar-600 hover:text-solar-700"
                >
                  <Mail className="w-4 h-4" />
                  {quote.email}
                </a>
                {quote.phone && (
                  <a
                    href={`tel:${quote.phone}`}
                    className="inline-flex items-center gap-2 text-sm text-solar-600 hover:text-solar-700"
                  >
                    <Phone className="w-4 h-4" />
                    {quote.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="admin-card">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              Request Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {quote.service && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-navy-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-navy-400 uppercase tracking-wider">
                      Service
                    </p>
                    <p className="text-sm text-navy-900">{quote.service}</p>
                  </div>
                </div>
              )}
              {quote.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-navy-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-navy-400 uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-sm text-navy-900">{quote.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-navy-400 mt-0.5" />
                <div>
                  <p className="text-xs text-navy-400 uppercase tracking-wider">
                    Submitted
                  </p>
                  <p className="text-sm text-navy-900">
                    {new Date(quote.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-navy-400 uppercase tracking-wider mb-2">
                Message
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-navy-700 whitespace-pre-wrap">
                  {quote.message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <QuoteStatusForm quote={quote} />
        </div>
      </div>
    </div>
  );
}
