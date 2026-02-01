'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  isActive: boolean;
  order: number;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    try {
      const res = await fetch('/api/faqs?all=true');
      const data = await res.json();
      setFaqs(data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    setDeleting(id);
    try {
      await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-solar-600" />
      </div>
    );
  }

  // Group by category
  const grouped = faqs.reduce((acc, faq) => {
    const cat = faq.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">FAQs</h1>
          <p className="text-navy-500 mt-1">Manage frequently asked questions</p>
        </div>
        <Link href="/admin/faqs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-navy-500 mb-4">No FAQs yet</p>
          <Link href="/admin/faqs/new">
            <Button>Add your first FAQ</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-navy-700 mb-4">{category}</h2>
              <div className="space-y-2">
                {items.map((faq) => (
                  <div key={faq.id} className="admin-card">
                    <div className="flex items-start justify-between">
                      <button
                        onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                        className="flex-1 text-left flex items-start gap-3"
                      >
                        {expanded === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-navy-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-navy-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-navy-900">{faq.question}</p>
                          {expanded === faq.id && (
                            <p className="text-navy-600 mt-2">{faq.answer}</p>
                          )}
                        </div>
                      </button>
                      <div className="flex items-center gap-2 ml-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            faq.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Link href={`/admin/faqs/${faq.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(faq.id)}
                          disabled={deleting === faq.id}
                          className="text-red-600 hover:bg-red-50"
                        >
                          {deleting === faq.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
