'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Service } from '@prisma/client';
import { slugify } from '@/lib/utils';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

// Helper function to parse JSON array from string
function parseFeatures(features: string | null | undefined): string[] {
  if (!features) return [];
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface ServiceFormProps {
  initialData?: Service | null;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    icon: initialData?.icon || '',
    image: initialData?.image || '',
    features: parseFeatures(initialData?.features),
    order: initialData?.order || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [newFeature, setNewFeature] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Auto-generate slug from title
    if (name === 'title' && !initialData) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(value),
      }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = initialData
        ? `/api/services/${initialData.id}`
        : '/api/services';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save service');
      }

      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center text-sm text-navy-600 hover:text-navy-900"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Services
      </Link>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Service Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="admin-input resize-none"
            />
          </div>
          <div>
            <label className="admin-label">Icon</label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="admin-input"
            >
              <option value="">Select an icon</option>
              <option value="pump">Pump (Water Droplets)</option>
              <option value="drill">Drill (Borehole)</option>
              <option value="tank">Tank (Gauge)</option>
              <option value="solar">Solar (Sun)</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Service Image</label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-solar-600 focus:ring-solar-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-navy-700">
              Active (visible on website)
            </label>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Features</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Enter a feature"
              className="admin-input flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <button
              type="button"
              onClick={addFeature}
              className="admin-btn-secondary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.features.length > 0 && (
            <ul className="space-y-2">
              {formData.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-navy-700">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/admin/services" className="admin-btn-secondary">
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className="admin-btn-primary">
          {isSubmitting ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  );
}
