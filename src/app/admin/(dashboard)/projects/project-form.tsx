'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Project } from '@prisma/client';
import { slugify } from '@/lib/utils';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { MultiImageUpload } from '@/components/ui/image-upload';

// Helper function to parse JSON array from string
function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface ProjectFormProps {
  initialData?: Project | null;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    client: initialData?.client || '',
    images: parseJsonArray(initialData?.images),
    services: parseJsonArray(initialData?.services),
    completedAt: initialData?.completedAt
      ? new Date(initialData.completedAt).toISOString().split('T')[0]
      : '',
    isFeatured: initialData?.isFeatured ?? false,
    isActive: initialData?.isActive ?? true,
  });

  const [newImage, setNewImage] = useState('');
  const [newService, setNewService] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    if (name === 'title' && !initialData) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(value),
      }));
    }
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService.trim()],
      }));
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = initialData
        ? `/api/projects/${initialData.id}`
        : '/api/projects';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center text-sm text-navy-600 hover:text-navy-900"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Projects
      </Link>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Project Details</h2>
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
            <label className="admin-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="admin-input resize-none"
            />
          </div>
          <div>
            <label className="admin-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Client</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Completion Date</label>
            <input
              type="date"
              name="completedAt"
              value={formData.completedAt}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-solar-600 focus:ring-solar-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-navy-700">
                Featured
              </label>
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
                Active
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Services Used</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="E.g., Solar Water Pumps"
              className="admin-input flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addService();
                }
              }}
            />
            <button type="button" onClick={addService} className="admin-btn-secondary">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.services.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-navy-100 rounded-full text-sm text-navy-700"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="hover:text-navy-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Project Images</h2>
        <MultiImageUpload
          values={formData.images}
          onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
          disabled={isSubmitting}
          max={10}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/admin/projects" className="admin-btn-secondary">
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className="admin-btn-primary">
          {isSubmitting ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
