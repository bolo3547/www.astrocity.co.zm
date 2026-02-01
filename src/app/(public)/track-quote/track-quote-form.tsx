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
  quotationNumber: string | null;
  totalAmount: number | null;
  currency: string | null;
  pdfSentAt: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: keyof typeof Icons; step: number }> = {
  new: { label: 'New Request', color: 'bg-blue-100 text-blue-800', icon: 'clock', step: 1 },
  contacted: { label: 'We Contacted You', color: 'bg-purple-100 text-purple-800', icon: 'phone', step: 2 },
  quoted: { label: 'Quotation Prepared', color: 'bg-orange-100 text-orange-800', icon: 'fileText', step: 3 },
  sent: { label: 'Quotation Sent', color: 'bg-indigo-100 text-indigo-800', icon: 'mail', step: 4 },
  'in-progress': { label: 'Work In Progress', color: 'bg-yellow-100 text-yellow-800', icon: 'arrowRight', step: 5 },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: 'check', step: 6 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: 'x', step: 0 },
};

const progressSteps = [
  { key: 'new', label: 'Received', icon: 'inbox' as keyof typeof Icons },
  { key: 'contacted', label: 'Contacted', icon: 'phone' as keyof typeof Icons },
  { key: 'quoted', label: 'Quoted', icon: 'fileText' as keyof typeof Icons },
  { key: 'sent', label: 'Sent', icon: 'mail' as keyof typeof Icons },
  { key: 'in-progress', label: 'In Progress', icon: 'arrowRight' as keyof typeof Icons },
  { key: 'completed', label: 'Completed', icon: 'check' as keyof typeof Icons },
];

function ProgressTracker({ currentStatus }: { currentStatus: string }) {
  const currentStep = statusConfig[currentStatus]?.step || 1;
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
          <Icons.x className="w-6 h-6 text-red-600" />
        </div>
        <p className="font-semibold text-red-800">Quote Cancelled</p>
        <p className="text-sm text-red-600 mt-1">This quote request has been cancelled.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-navy-200 rounded-xl p-6">
      <h3 className="font-semibold text-navy-900 mb-6 text-center">Quote Progress</h3>
      
      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-solar-500 to-accent-500 transition-all duration-500"
            style={{ width: `${Math.min(((currentStep - 1) / (progressSteps.length - 1)) * 100, 100)}%` }}
          />
        </div>
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {progressSteps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const StepIcon = Icons[step.icon];
            
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-solar-500 to-accent-500 border-transparent text-white' 
                      : isCurrent 
                        ? 'bg-white border-solar-500 text-solar-600 ring-4 ring-solar-100' 
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Icons.check className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                <span 
                  className={`
                    text-xs mt-2 font-medium text-center max-w-[60px]
                    ${isCompleted || isCurrent ? 'text-navy-900' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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

    const formatCurrency = (amount: number, currency: string) =>
      `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

        {/* Progress Tracker */}
        <ProgressTracker currentStatus={quoteResult.status} />

        {/* Quotation Details (if sent) */}
        {quoteResult.quotationNumber && (
          <div className="bg-gradient-to-r from-solar-50 to-accent-50 border border-solar-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icons.fileText className="w-5 h-5 text-solar-600" />
              <h3 className="font-semibold text-navy-900">Your Quotation</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Quotation No.</p>
                <p className="text-sm font-mono font-bold text-navy-900">{quoteResult.quotationNumber}</p>
              </div>
              {quoteResult.totalAmount && (
                <div>
                  <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-sm font-bold text-solar-600">
                    {formatCurrency(quoteResult.totalAmount, quoteResult.currency || 'ZMW')}
                  </p>
                </div>
              )}
            </div>
            {quoteResult.pdfSentAt && (
              <p className="text-xs text-accent-600 mt-4 flex items-center gap-1">
                <Icons.check className="w-3 h-3" />
                Quotation sent to your email on {new Date(quoteResult.pdfSentAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        )}

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Submitted On</p>
              <p className="text-sm text-navy-900">
                {new Date(quoteResult.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Last Updated</p>
              <p className="text-sm text-navy-900">
                {new Date(quoteResult.updatedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Response */}
        {quoteResult.adminResponse && (
          <div className="pt-6 border-t border-navy-200">
            <div className="flex items-center gap-2 mb-3">
              <Icons.messageCircle className="w-5 h-5 text-solar-600" />
              <h3 className="font-semibold text-navy-900">Message from AstroCity</h3>
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

        {!quoteResult.adminResponse && quoteResult.status === 'new' && (
          <div className="pt-6 border-t border-navy-200">
            <div className="bg-solar-50 border border-solar-100 rounded-lg p-4 text-center">
              <Icons.clock className="w-6 h-6 text-solar-600 mx-auto mb-2" />
              <p className="text-sm text-solar-800 font-medium">
                We're reviewing your request
              </p>
              <p className="text-xs text-solar-600 mt-1">
                Our team will get back to you within 24-48 hours.
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
