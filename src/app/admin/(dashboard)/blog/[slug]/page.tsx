'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';

interface BlogForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  imageUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export default function BlogEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const isNew = slug === 'new';
  
  const [form, setForm] = useState<BlogForm>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    imageUrl: '',
    isPublished: false,
    isFeatured: false,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [slug, isNew]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          category: data.category || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          imageUrl: data.imageUrl || '',
          isPublished: data.isPublished ?? false,
          isFeatured: data.isFeatured ?? false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
        setForm({ ...form, imageUrl: data.url });
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
      const url = isNew ? '/api/blog' : `/api/blog/${slug}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/blog');
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
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        <h1 className="text-2xl font-bold text-navy-900">
          {isNew ? 'New Blog Post' : 'Edit Blog Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-card max-w-3xl">
        <div className="space-y-6">
          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Featured Image
            </label>
            <div className="space-y-3">
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
              )}
              <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" disabled={uploading}>
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload Image
                </Button>
              </label>
            </div>
          </div>

          {/* Title */}
          <Input
            label="Title *"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm({
                ...form,
                title,
                slug: isNew ? generateSlug(title) : form.slug,
              });
            }}
            required
          />

          {/* Slug */}
          <Input
            label="Slug *"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="url-friendly-slug"
            required
          />

          {/* Excerpt */}
          <Textarea
            label="Excerpt"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            placeholder="Brief description for listing pages..."
          />

          {/* Content */}
          <Textarea
            label="Content *"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={12}
            placeholder="Write your blog post content here... (Markdown supported)"
            required
          />

          {/* Category */}
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. Solar Energy, Water Solutions"
          />

          {/* Tags */}
          <Input
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="solar, energy, tips"
          />

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 text-solar-600 rounded border-gray-300"
              />
              <label htmlFor="isPublished" className="text-sm text-navy-700">
                Publish immediately
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-4 h-4 text-solar-600 rounded border-gray-300"
              />
              <label htmlFor="isFeatured" className="text-sm text-navy-700">
                Featured post
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isNew ? 'Create Post' : 'Save Changes'}
            </Button>
            <Link href="/admin/blog">
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
