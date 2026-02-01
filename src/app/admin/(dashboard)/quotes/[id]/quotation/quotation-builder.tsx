'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quote, Settings, Service } from '@prisma/client';
import { Plus, Trash2, FileText, Send, Download, Calculator, Eye } from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface QuotationBuilderProps {
  quote: Quote;
  settings: Settings | null;
  services: Service[];
}

const defaultTerms = `1. This quotation is valid for 30 days from the date of issue.
2. Payment terms: 50% deposit upon acceptance, 50% upon completion.
3. Prices are inclusive of VAT unless otherwise stated.
4. Delivery and installation timelines will be confirmed upon order placement.
5. Warranty terms apply as per manufacturer specifications.
6. Any additional work not covered in this quotation will be quoted separately.`;

export function QuotationBuilder({ quote, settings, services }: QuotationBuilderProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pdfGenerated, setPdfGenerated] = useState(quote.pdfGenerated);
  const [quotationNumber, setQuotationNumber] = useState(quote.quotationNumber || '');

  // Line items state
  const [lineItems, setLineItems] = useState<LineItem[]>(() => {
    // Parse lineItems from JSON string (SQLite) or use as array (PostgreSQL)
    let parsedItems: LineItem[] | null = null;
    if (quote.lineItems) {
      if (typeof quote.lineItems === 'string') {
        try {
          parsedItems = JSON.parse(quote.lineItems) as LineItem[];
        } catch {
          parsedItems = null;
        }
      } else if (Array.isArray(quote.lineItems)) {
        parsedItems = quote.lineItems as unknown as LineItem[];
      }
    }
    
    if (parsedItems && Array.isArray(parsedItems) && parsedItems.length > 0) {
      return parsedItems.map((item, index) => ({
        ...item,
        id: `item-${index}`,
      }));
    }
    return [
      {
        id: 'item-1',
        description: quote.service || '',
        quantity: 1,
        unit: 'unit',
        unitPrice: 0,
        total: 0,
      },
    ];
  });

  // Form state
  const [taxRate, setTaxRate] = useState(quote.taxRate ?? settings?.defaultTaxRate ?? 16);
  const [discount, setDiscount] = useState(quote.discount ?? 0);
  const [currency, setCurrency] = useState(quote.currency || settings?.currency || 'ZMW');
  const [quotationNotes, setQuotationNotes] = useState(quote.quotationNotes || '');
  const [termsConditions, setTermsConditions] = useState(
    quote.termsConditions || settings?.defaultTerms || defaultTerms
  );

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * (taxRate / 100);
  const totalAmount = afterDiscount + tax;

  // Format currency
  const formatCurrency = (amount: number) =>
    `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Add line item
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unit: 'unit',
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  // Remove line item
  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  // Update line item
  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  // Generate quotation
  const handleGenerate = async () => {
    if (lineItems.some((item) => !item.description || item.unitPrice <= 0)) {
      setMessage({ type: 'error', text: 'Please fill in all line items with valid prices' });
      return;
    }

    setIsGenerating(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/quotes/${quote.id}/quotation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems: lineItems.map(({ id, ...item }) => item),
          taxRate,
          discount,
          currency,
          quotationNotes,
          termsConditions,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate quotation');
      }

      setPdfGenerated(true);
      setQuotationNumber(result.quotationNumber);
      setMessage({ type: 'success', text: 'Quotation generated successfully!' });

      // Download PDF
      const pdfBlob = new Blob(
        [Uint8Array.from(atob(result.pdf), (c) => c.charCodeAt(0))],
        { type: 'application/pdf' }
      );
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.quotationNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      router.refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to generate quotation' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Download existing PDF
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/quotes/${quote.id}/download`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${quotationNumber || 'quotation'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to download' });
    }
  };

  // Preview PDF in new tab
  const handlePreview = async () => {
    try {
      const response = await fetch(`/api/quotes/${quote.id}/download`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load preview');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to preview' });
    }
  };

  // Send quotation
  const handleSend = async () => {
    if (!pdfGenerated) {
      setMessage({ type: 'error', text: 'Please generate the quotation first' });
      return;
    }

    setIsSending(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/quotes/${quote.id}/send`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send quotation');
      }

      setMessage({ type: 'success', text: result.message });
      router.refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to send quotation' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Client Info Card */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Client Information</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-navy-400 uppercase tracking-wider">Name</label>
            <p className="text-sm font-medium text-navy-900">{quote.name}</p>
          </div>
          <div>
            <label className="text-xs text-navy-400 uppercase tracking-wider">Email</label>
            <p className="text-sm text-navy-700">{quote.email}</p>
          </div>
          <div>
            <label className="text-xs text-navy-400 uppercase tracking-wider">Phone</label>
            <p className="text-sm text-navy-700">{quote.phone || '-'}</p>
          </div>
          <div>
            <label className="text-xs text-navy-400 uppercase tracking-wider">Location</label>
            <p className="text-sm text-navy-700">{quote.location || '-'}</p>
          </div>
        </div>
        {quote.message && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="text-xs text-navy-400 uppercase tracking-wider">Project Requirements</label>
            <p className="text-sm text-navy-700 mt-1">{quote.message}</p>
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy-900">Line Items</h2>
          <button
            type="button"
            onClick={addLineItem}
            className="inline-flex items-center gap-2 text-sm text-solar-600 hover:text-solar-700"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3 w-[40%]">
                  Description
                </th>
                <th className="text-center text-xs font-medium text-navy-500 uppercase tracking-wider pb-3 w-[10%]">
                  Qty
                </th>
                <th className="text-center text-xs font-medium text-navy-500 uppercase tracking-wider pb-3 w-[12%]">
                  Unit
                </th>
                <th className="text-right text-xs font-medium text-navy-500 uppercase tracking-wider pb-3 w-[15%]">
                  Unit Price
                </th>
                <th className="text-right text-xs font-medium text-navy-500 uppercase tracking-wider pb-3 w-[15%]">
                  Total
                </th>
                <th className="w-[8%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      className="admin-input text-sm"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                      className="admin-input text-sm text-center"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={item.unit}
                      onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                      className="admin-input text-sm"
                    >
                      <option value="unit">Unit</option>
                      <option value="set">Set</option>
                      <option value="kit">Kit</option>
                      <option value="m">Meter</option>
                      <option value="m²">m²</option>
                      <option value="hour">Hour</option>
                      <option value="day">Day</option>
                      <option value="lot">Lot</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                      className="admin-input text-sm text-right"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm font-medium text-navy-900">
                      {formatCurrency(item.total)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="p-1 text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals and Settings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="admin-card">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="admin-input"
                >
                  <option value="ZMW">ZMW (Zambian Kwacha)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="ZAR">ZAR (South African Rand)</option>
                </select>
              </div>
              <div>
                <label className="admin-label">VAT Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="admin-input"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Discount ({currency})</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="admin-card bg-navy-50">
          <h2 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Totals
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-navy-600">Subtotal</span>
              <span className="font-medium text-navy-900">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-navy-600">Discount</span>
                <span className="font-medium text-red-600">-{formatCurrency(discount)}</span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-navy-600">VAT ({taxRate}%)</span>
                <span className="font-medium text-navy-900">{formatCurrency(tax)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-navy-200 flex justify-between">
              <span className="text-lg font-semibold text-navy-900">Total Amount</span>
              <span className="text-xl font-bold text-solar-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Additional Notes</h2>
        <textarea
          value={quotationNotes}
          onChange={(e) => setQuotationNotes(e.target.value)}
          rows={3}
          className="admin-input resize-none"
          placeholder="Add any additional notes for this quotation..."
        />
      </div>

      {/* Terms & Conditions */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Terms & Conditions</h2>
        <textarea
          value={termsConditions}
          onChange={(e) => setTermsConditions(e.target.value)}
          rows={6}
          className="admin-input resize-none font-mono text-xs"
        />
      </div>

      {/* Actions */}
      <div className="admin-card bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {quotationNumber && (
              <p className="text-sm text-navy-600">
                Quotation Number: <strong className="text-navy-900">{quotationNumber}</strong>
              </p>
            )}
            {quote.pdfSentAt && (
              <p className="text-xs text-accent-600 mt-1">
                Sent to client on {new Date(quote.pdfSentAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {pdfGenerated && (
              <>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-100 text-navy-700 font-medium text-sm hover:bg-navy-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View PDF
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="admin-btn-secondary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-500 text-white font-medium text-sm hover:bg-accent-600 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Sending...' : 'Send to Client'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="admin-btn-primary flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {isGenerating ? 'Generating...' : pdfGenerated ? 'Regenerate PDF' : 'Generate PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
