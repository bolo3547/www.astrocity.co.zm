'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TeamMember } from '@prisma/client';
import { ImageUpload } from '@/components/ui/image-upload';

interface TeamMemberFormProps {
  initialData?: TeamMember | null;
}

export function TeamMemberForm({ initialData }: TeamMemberFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    bio: initialData?.bio || '',
    photo: initialData?.photo || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    linkedin: initialData?.linkedin || '',
    order: initialData?.order?.toString() || '0',
    isFeatured: initialData?.isFeatured || false,
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = {
        ...formData,
        order: parseInt(formData.order) || 0,
      };

      const url = initialData ? `/api/team/${initialData.id}` : '/api/team';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save team member');
      }

      setMessage({ type: 'success', text: `Team member ${initialData ? 'updated' : 'created'} successfully!` });
      
      setTimeout(() => {
        router.push('/admin/team');
        router.refresh();
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save team member' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="admin-label">Role / Title *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="Chief Engineer"
            />
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Professional Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="admin-input resize-none"
              placeholder="Brief professional biography..."
            />
            <p className="text-xs text-gray-500 mt-1">A short description of their experience and expertise</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Profile Photo</h2>
        <div className="max-w-xs">
          <ImageUpload
            value={formData.photo}
            onChange={(url) => setFormData((prev) => ({ ...prev, photo: url }))}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-2">Recommended: Square image, at least 300x300px</p>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Contact Information (Optional)</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="admin-input"
              placeholder="john@astrocity.co.zm"
            />
          </div>
          <div>
            <label className="admin-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="admin-input"
              placeholder="+260 XXX XXX XXX"
            />
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">LinkedIn Profile URL</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="admin-input"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Display Settings</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="admin-input"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-solar-600 focus:ring-solar-500"
              />
              <span className="text-gray-700">Featured on Home Page</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-solar-600 focus:ring-solar-500"
              />
              <span className="text-gray-700">Active (visible on website)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-solar-600 hover:bg-solar-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Team Member' : 'Add Team Member'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
