'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface LogoForm {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  isActive: boolean;
  order: number;
}

export default function ClientLogoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';
  
  const [form, setForm] = useState<LogoForm>({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    isActive: true,
    order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchLogo();
    }
  }, [id, isNew]);

  async function fetchLogo() {
    try {
      const res = await fetch(`/api/client-logos/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || '',
          logoUrl: data.logoUrl || '',
          websiteUrl: data.website || '',
          isActive: data.isActive ?? true,
          order: data.order || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch logo:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, logoUrl: data.url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isNew ? '/api/client-logos' : `/api/client-logos/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/client-logos');
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
          href="/admin/client-logos"
          className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Client Logos
        </Link>
        <h1 className="text-2xl font-bold text-navy-900">
          {isNew ? 'Add Client Logo' : 'Edit Client Logo'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-card max-w-xl">
        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Logo Image *
            </label>
            <div className="space-y-3">
              {form.logoUrl && (
                <div className="p-4 bg-gray-50 rounded-lg inline-block">
                  <img
                    src={form.logoUrl}
                    alt="Preview"
                    className="max-h-24 max-w-xs object-contain"
                  />
                </div>
              )}
              <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" disabled={uploading}>
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload Logo
                </Button>
              </label>
              <p className="text-xs text-navy-500">Recommended: PNG with transparent background</p>
            </div>
          </div>

          {/* Name */}
          <Input
            label="Company Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. ABC Corporation"
            required
          />

          {/* Website URL */}
          <Input
            label="Website URL (optional)"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
            placeholder="https://example.com"
            type="url"
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
            <Button type="submit" disabled={saving || !form.logoUrl}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isNew ? 'Add Client Logo' : 'Save Changes'}
            </Button>
            <Link href="/admin/client-logos">
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
