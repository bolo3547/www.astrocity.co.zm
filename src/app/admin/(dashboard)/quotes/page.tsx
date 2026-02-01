import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Eye, FileText, Download } from 'lucide-react';
import { QuoteStatusBadge } from './quote-status-badge';
import { DeleteQuoteButton } from './delete-quote-button';

export const metadata: Metadata = {
  title: 'Quotes - Admin',
};

async function getQuotes() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return quotes;
  } catch {
    return [];
  }
}

function formatCurrency(amount: number | null, currency: string = 'ZMW') {
  if (!amount) return '-';
  return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function QuotesPage() {
  const quotes = await getQuotes();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Quote Requests</h1>
        <p className="text-navy-500 mt-1">Manage incoming quote requests and create quotations</p>
      </div>

      <div className="admin-card">
        {quotes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Ref / Quotation
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Service
                  </th>
                  <th className="text-right text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <span className="font-mono text-xs text-navy-500 block">
                          {quote.referenceNo}
                        </span>
                        {quote.quotationNumber && (
                          <span className="font-mono text-xs font-medium text-solar-600 block mt-1">
                            {quote.quotationNumber}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-navy-900">{quote.name}</p>
                        <p className="text-sm text-navy-500">{quote.email}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-navy-600">
                      {quote.service || '-'}
                    </td>
                    <td className="py-4 text-sm text-right">
                      {quote.totalAmount ? (
                        <span className="font-medium text-navy-900">
                          {formatCurrency(quote.totalAmount, quote.currency)}
                        </span>
                      ) : (
                        <span className="text-navy-400">-</span>
                      )}
                    </td>
                    <td className="py-4">
                      <QuoteStatusBadge status={quote.status} />
                    </td>
                    <td className="py-4 text-sm text-navy-500">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/quotes/${quote.id}/quotation`}
                          className="p-2 rounded-lg hover:bg-solar-50 text-solar-600 hover:text-solar-700 transition-colors"
                          title="Create/Edit Quotation"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                        {quote.quotationNumber && (
                          <a
                            href={`/api/quotes/${quote.id}/download`}
                            className="p-2 rounded-lg hover:bg-accent-50 text-accent-600 hover:text-accent-700 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 text-navy-600 hover:text-navy-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <DeleteQuoteButton id={quote.id} name={quote.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-navy-500">No quote requests yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
