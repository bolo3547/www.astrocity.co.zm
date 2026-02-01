'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quote } from '@prisma/client';

interface QuoteStatusFormProps {
  quote: Quote;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'sent', label: 'Sent' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function QuoteStatusForm({ quote }: QuoteStatusFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(quote.status);
  const [notes, setNotes] = useState(quote.notes || '');
  const [adminResponse, setAdminResponse] = useState(quote.adminResponse || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, adminResponse }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quote');
      }

      setMessage({ type: 'success', text: 'Quote updated successfully!' });
      router.refresh();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update quote' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Reference Number Display */}
      <div className="admin-card bg-solar-50">
        <h2 className="text-sm font-medium text-navy-600 mb-1">Reference Number</h2>
        <p className="text-lg font-mono font-bold text-solar-700">{quote.referenceNo}</p>
        <p className="text-xs text-navy-400 mt-1">
          Customer can use this to track their quote
        </p>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Update Status</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="admin-label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="admin-input"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label">
              Response to Customer
              <span className="text-xs font-normal text-navy-400 ml-2">
                (visible to customer)
              </span>
            </label>
            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              rows={4}
              className="admin-input resize-none"
              placeholder="Write a response that the customer will see when they track their quote..."
            />
          </div>

          <div>
            <label className="admin-label">
              Internal Notes
              <span className="text-xs font-normal text-navy-400 ml-2">
                (private)
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="admin-input resize-none"
              placeholder="Add internal notes about this quote..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-btn-primary w-full"
          >
            {isSubmitting ? 'Updating...' : 'Update Quote'}
          </button>
        </form>
      </div>
    </div>
  );
}
