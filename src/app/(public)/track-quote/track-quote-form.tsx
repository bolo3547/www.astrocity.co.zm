'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { Icons } from '@/components/icons';

interface QuoteResult {
  referenceNo: string;
  name: string;
  service: string | null;
  location: string | null;
  status: string;
  adminResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: keyof typeof Icons }> = {
  new: { label: 'New Request', color: 'bg-blue-100 text-blue-800', icon: 'clock' },
  contacted: { label: 'We Contacted You', color: 'bg-purple-100 text-purple-800', icon: 'phone' },
  quoted: { label: 'Quotation Prepared', color: 'bg-orange-100 text-orange-800', icon: 'fileText' },
  sent: { label: 'Quotation Sent', color: 'bg-indigo-100 text-indigo-800', icon: 'mail' },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: 'arrowRight' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: 'check' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: 'x' },
};

export function TrackQuoteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setQuoteResult(null);

    const formData = new FormData(e.currentTarget);
    const referenceNo = formData.get('referenceNo') as string;
    const email = formData.get('email') as string;

    try {
      const response = await fetch('/api/quotes/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceNo, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Quote not found');
      }

      setQuoteResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track quote');
    } finally {
      setIsLoading(false);
    }
  }

  if (quoteResult) {
    const status = statusConfig[quoteResult.status] || statusConfig.new;
    const StatusIcon = Icons[status.icon];

    return (
      <div className="space-y-6">
        {/* Status Header */}
        <div className="text-center pb-6 border-b border-navy-200">
          <p className="text-xs text-navy-400 uppercase tracking-wider mb-2">
            Reference Number
          </p>
          <p className="text-lg font-mono font-bold text-navy-900 mb-4">
            {quoteResult.referenceNo}
          </p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="font-medium">{status.label}</span>
          </div>
        </div>

        {/* Quote Details */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Name</p>
            <p className="text-sm text-navy-900">{quoteResult.name}</p>
          </div>
          
          {quoteResult.service && (
            <div>
              <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Service Requested</p>
              <p className="text-sm text-navy-900">{quoteResult.service}</p>
            </div>
          )}

          {quoteResult.location && (
            <div>
              <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Project Location</p>
              <p className="text-sm text-navy-900">{quoteResult.location}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Submitted On</p>
            <p className="text-sm text-navy-900">
              {new Date(quoteResult.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div>
            <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Last Updated</p>
            <p className="text-sm text-navy-900">
              {new Date(quoteResult.updatedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Admin Response */}
        {quoteResult.adminResponse && (
          <div className="mt-6 pt-6 border-t border-navy-200">
            <div className="flex items-center gap-2 mb-3">
              <Icons.messageCircle className="w-5 h-5 text-solar-600" />
              <h3 className="font-semibold text-navy-900">Our Response</h3>
            </div>
            <div className="bg-white border border-navy-200 rounded-lg p-4">
              <p className="text-sm text-navy-700 whitespace-pre-wrap">
                {quoteResult.adminResponse}
              </p>
              {quoteResult.respondedAt && (
                <p className="text-xs text-navy-400 mt-3">
                  Responded on {new Date(quoteResult.respondedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        )}

        {!quoteResult.adminResponse && quoteResult.status !== 'cancelled' && (
          <div className="mt-6 pt-6 border-t border-navy-200">
            <div className="bg-solar-50 border border-solar-100 rounded-lg p-4 text-center">
              <Icons.clock className="w-6 h-6 text-solar-600 mx-auto mb-2" />
              <p className="text-sm text-solar-800">
                We're reviewing your request. You'll receive our response soon.
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={() => setQuoteResult(null)}
          variant="secondary"
          className="w-full"
        >
          Track Another Quote
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-solar-100 flex items-center justify-center mx-auto mb-4">
          <Icons.search className="w-6 h-6 text-solar-600" />
        </div>
        <h2 className="text-xl font-semibold text-navy-900 mb-2">
          Find Your Quote
        </h2>
        <p className="text-sm text-navy-500">
          Enter the reference number you received when you submitted your quote.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        id="referenceNo"
        name="referenceNo"
        label="Reference Number *"
        placeholder="QR-XXXXXXX-XXXX"
        className="font-mono uppercase"
        required
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email Address *"
        placeholder="The email you used when submitting"
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Track Quote
      </Button>
    </form>
  );
}
