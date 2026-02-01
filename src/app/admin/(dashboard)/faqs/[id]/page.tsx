'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';

interface FAQForm {
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
}

export default function FAQEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';
  
  const [form, setForm] = useState<FAQForm>({
    question: '',
    answer: '',
    category: '',
    isActive: true,
    order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchFAQ();
    }
  }, [id, isNew]);

  async function fetchFAQ() {
    try {
      const res = await fetch(`/api/faqs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          question: data.question || '',
          answer: data.answer || '',
          category: data.category || '',
          isActive: data.isActive ?? true,
          order: data.order || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch FAQ:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isNew ? '/api/faqs' : `/api/faqs/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/faqs');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-solar-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/faqs"
          className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to FAQs
        </Link>
        <h1 className="text-2xl font-bold text-navy-900">
          {isNew ? 'Add FAQ' : 'Edit FAQ'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-card max-w-2xl">
        <div className="space-y-6">
          {/* Question */}
          <Input
            label="Question *"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="What question do customers frequently ask?"
            required
          />

          {/* Answer */}
          <Textarea
            label="Answer *"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={6}
            placeholder="Provide a clear and helpful answer..."
            required
          />

          {/* Category */}
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. Solar Pumps, Boreholes, Payments"
          />

          {/* Order */}
          <Input
            label="Display Order"
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
          />

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 text-solar-600 rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm text-navy-700">
              Active (visible on website)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isNew ? 'Create FAQ' : 'Save Changes'}
            </Button>
            <Link href="/admin/faqs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
