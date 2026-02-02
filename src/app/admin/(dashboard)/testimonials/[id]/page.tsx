'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Upload, Star } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';

interface TestimonialForm {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  photo: string;
  isActive: boolean;
  order: number;
}

export default function TestimonialEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';
  
  const [form, setForm] = useState<TestimonialForm>({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    photo: '',
    isActive: true,
    order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew) {
      fetchTestimonial();
    }
  }, [id, isNew]);

  async function fetchTestimonial() {
    try {
      const res = await fetch(`/api/testimonials/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || '',
          role: data.role || '',
          company: data.company || '',
          content: data.content || '',
          rating: data.rating || 5,
          photo: data.photo || '',
          isActive: data.isActive ?? true,
          order: data.order || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch testimonial:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, photo: data.url });
      } else if (data.error) {
        setUploadError(data.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isNew ? '/api/testimonials' : `/api/testimonials/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/testimonials');
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
          href="/admin/testimonials"
          className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Testimonials
        </Link>
        <h1 className="text-2xl font-bold text-navy-900">
          {isNew ? 'Add Testimonial' : 'Edit Testimonial'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-card max-w-2xl">
        <div className="space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Photo
            </label>
            <div className="flex items-center gap-4">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-navy-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-navy-400">?</span>
                </div>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" disabled={uploading}>
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload Photo
                </Button>
              </label>
            </div>
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
            <p className="mt-1 text-xs text-navy-500">
              Accepted formats: JPG, PNG, WebP, GIF. Max size: 5MB
            </p>
          </div>

          {/* Name */}
          <Input
            label="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          {/* Role */}
          <Input
            label="Role/Position *"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. Farm Owner, Business Manager"
            required
          />

          {/* Company */}
          <Input
            label="Company (optional)"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="e.g. ABC Farms Ltd"
          />

          {/* Content */}
          <Textarea
            label="Testimonial Content *"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={4}
            required
          />

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= form.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

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
              {isNew ? 'Create Testimonial' : 'Save Changes'}
            </Button>
            <Link href="/admin/testimonials">
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
