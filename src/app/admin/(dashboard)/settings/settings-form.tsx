'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from '@prisma/client';
import { Eye, EyeOff, Mail, FileText, Globe } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

// Helper function to parse JSON array from string
function parsePhones(phones: string | null | undefined): string[] {
  if (!phones) return [];
  try {
    const parsed = JSON.parse(phones);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface SettingsFormProps {
  initialData: Settings | null;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    // Company Info
    companyName: initialData?.companyName || '',
    tagline: initialData?.tagline || '',
    address: initialData?.address || '',
    phones: parsePhones(initialData?.phones).join('\n'),
    whatsapp: initialData?.whatsapp || '',
    email: initialData?.email || '',
    workingHours: initialData?.workingHours || '',
    // Website & Branding
    website: initialData?.website || '',
    logoUrl: initialData?.logoUrl || '',
    // Hero Section
    heroHeadline: initialData?.heroHeadline || '',
    heroSubheadline: initialData?.heroSubheadline || '',
    heroCta: initialData?.heroCta || '',
    heroCtaSecondary: initialData?.heroCtaSecondary || '',
    // About
    aboutText: initialData?.aboutText || '',
    // SEO
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    // SMTP Email Configuration
    smtpHost: initialData?.smtpHost || '',
    smtpPort: initialData?.smtpPort?.toString() || '587',
    smtpUser: initialData?.smtpUser || '',
    smtpPass: initialData?.smtpPass || '',
    smtpFrom: initialData?.smtpFrom || '',
    // Quotation Settings
    quotationPrefix: initialData?.quotationPrefix || 'QT',
    quotationValidity: initialData?.quotationValidity?.toString() || '30',
    defaultTaxRate: initialData?.defaultTaxRate?.toString() || '16',
    currency: initialData?.currency || 'ZMW',
    defaultTerms: initialData?.defaultTerms || 'Payment: 50% deposit upon acceptance, 50% upon completion.\nDelivery: As specified in quotation.\nValidity: This quotation is valid for the period stated above.\nWarranty: Standard manufacturer warranty applies to all equipment.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = {
        ...formData,
        phones: formData.phones.split('\n').map((p: string) => p.trim()).filter(Boolean),
        smtpPort: formData.smtpPort ? parseInt(formData.smtpPort) : 587,
        quotationValidity: formData.quotationValidity ? parseInt(formData.quotationValidity) : 30,
        defaultTaxRate: formData.defaultTaxRate ? parseFloat(formData.defaultTaxRate) : 16,
      };

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save settings');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      router.refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save settings' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      {/* Company Information */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Company Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Phone Numbers (one per line)</label>
            <textarea
              name="phones"
              value={formData.phones}
              onChange={handleChange}
              rows={3}
              className="admin-input resize-none"
              placeholder="+1 234 567 8900&#10;+1 234 567 8901"
            />
          </div>
          <div>
            <label className="admin-label">WhatsApp Number</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="admin-input"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="admin-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Working Hours</label>
            <input
              type="text"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              className="admin-input"
              placeholder="Mon - Fri: 8:00 AM - 5:00 PM"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">Hero Section</h2>
        <div className="space-y-6">
          <div>
            <label className="admin-label">Headline</label>
            <input
              type="text"
              name="heroHeadline"
              value={formData.heroHeadline}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Sub-headline</label>
            <textarea
              name="heroSubheadline"
              value={formData.heroSubheadline}
              onChange={handleChange}
              rows={3}
              className="admin-input resize-none"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Primary CTA Text</label>
              <input
                type="text"
                name="heroCta"
                value={formData.heroCta}
                onChange={handleChange}
                className="admin-input"
                placeholder="Request a Quote"
              />
            </div>
            <div>
              <label className="admin-label">Secondary CTA Text</label>
              <input
                type="text"
                name="heroCtaSecondary"
                value={formData.heroCtaSecondary}
                onChange={handleChange}
                className="admin-input"
                placeholder="WhatsApp Us"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">About Section</h2>
        <div>
          <label className="admin-label">About Text</label>
          <textarea
            name="aboutText"
            value={formData.aboutText}
            onChange={handleChange}
            rows={5}
            className="admin-input resize-none"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold text-navy-900 mb-6">SEO Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="admin-label">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              className="admin-input resize-none"
            />
          </div>
        </div>
      </div>

      {/* Website & Branding */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-solar-600" />
          <h2 className="text-lg font-semibold text-navy-900">Website & Branding</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Website URL (optional)</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="admin-input"
              placeholder="www.astrocity.co.zm"
            />
            <p className="text-xs text-gray-500 mt-1">Used as watermark on quotation PDFs (optional)</p>
          </div>
          <div>
            <label className="admin-label">Company Logo</label>
            <ImageUpload
              value={formData.logoUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, logoUrl: url }))}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="w-5 h-5 text-solar-600" />
          <h2 className="text-lg font-semibold text-navy-900">Email Configuration (SMTP)</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">Configure SMTP settings to send quotations via email to clients.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">SMTP Host</label>
            <input
              type="text"
              name="smtpHost"
              value={formData.smtpHost}
              onChange={handleChange}
              className="admin-input"
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <label className="admin-label">SMTP Port</label>
            <input
              type="number"
              name="smtpPort"
              value={formData.smtpPort}
              onChange={handleChange}
              className="admin-input"
              placeholder="587"
            />
          </div>
          <div>
            <label className="admin-label">SMTP Username</label>
            <input
              type="text"
              name="smtpUser"
              value={formData.smtpUser}
              onChange={handleChange}
              className="admin-input"
              placeholder="your-email@gmail.com"
            />
          </div>
          <div>
            <label className="admin-label">SMTP Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="smtpPass"
                value={formData.smtpPass}
                onChange={handleChange}
                className="admin-input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">For Gmail, use an App Password</p>
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">From Email Address</label>
            <input
              type="email"
              name="smtpFrom"
              value={formData.smtpFrom}
              onChange={handleChange}
              className="admin-input"
              placeholder="quotes@yourcompany.com"
            />
          </div>
        </div>
      </div>

      {/* Quotation Settings */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-solar-600" />
          <h2 className="text-lg font-semibold text-navy-900">Quotation Settings</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Quotation Number Prefix</label>
            <input
              type="text"
              name="quotationPrefix"
              value={formData.quotationPrefix}
              onChange={handleChange}
              className="admin-input"
              placeholder="QT"
            />
            <p className="text-xs text-gray-500 mt-1">E.g., QT-2026-0001</p>
          </div>
          <div>
            <label className="admin-label">Default Validity (Days)</label>
            <input
              type="number"
              name="quotationValidity"
              value={formData.quotationValidity}
              onChange={handleChange}
              className="admin-input"
              placeholder="30"
            />
          </div>
          <div>
            <label className="admin-label">Default Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              name="defaultTaxRate"
              value={formData.defaultTaxRate}
              onChange={handleChange}
              className="admin-input"
              placeholder="16"
            />
          </div>
          <div>
            <label className="admin-label">Default Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="admin-input"
            >
              <option value="ZMW">ZMW - Zambian Kwacha</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="ZAR">ZAR - South African Rand</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Default Terms & Conditions</label>
            <textarea
              name="defaultTerms"
              value={formData.defaultTerms}
              onChange={handleChange}
              rows={6}
              className="admin-input resize-none font-mono text-sm"
              placeholder="Enter default terms and conditions for quotations..."
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="admin-btn-primary px-8"
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
