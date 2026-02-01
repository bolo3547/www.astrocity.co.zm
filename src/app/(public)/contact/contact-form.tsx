'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Textarea, Select } from '@/components/ui';

interface ContactFormProps {
  services: { value: string; label: string }[];
}

export function ContactForm({ services }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    referenceNo?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceOptions = [
    { value: '', label: 'Select a service' },
    ...services,
    { value: 'other', label: 'Other / Multiple Services' },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      service: formData.get('service') as string,
      location: formData.get('location') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setSubmissionResult({
        success: true,
        referenceNo: result.referenceNo,
      });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submissionResult?.success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-navy-900 mb-2">
          Thank You!
        </h3>
        <p className="text-navy-500 mb-4">
          Your request has been submitted successfully. We'll get back to you within 24 hours.
        </p>
        
        {submissionResult.referenceNo && (
          <div className="bg-white border border-navy-200 rounded-lg p-4 mb-6 max-w-sm mx-auto">
            <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">
              Your Reference Number
            </p>
            <p className="text-lg font-mono font-bold text-solar-600">
              {submissionResult.referenceNo}
            </p>
            <p className="text-xs text-navy-400 mt-2">
              Save this number to track your quote status
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/track-quote" className="btn-secondary">
            Track Your Quote
          </Link>
          <Button onClick={() => setSubmissionResult(null)} variant="secondary">
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          id="name"
          name="name"
          label="Full Name *"
          placeholder="John Doe"
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address *"
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="+260 97 123 4567"
        />
        <Input
          id="company"
          name="company"
          label="Company / Organization"
          placeholder="Your company name"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Select
          id="service"
          name="service"
          label="Service Required"
          options={serviceOptions}
        />
        <Input
          id="location"
          name="location"
          label="Project Location"
          placeholder="City, District"
        />
      </div>

      <Textarea
        id="message"
        name="message"
        label="Project Details *"
        placeholder="Please describe your project requirements, including any specific needs or questions..."
        rows={5}
        required
      />

      <div className="flex items-center justify-between pt-4">
        <p className="text-xs text-navy-400">
          * Required fields
        </p>
        <Button type="submit" isLoading={isSubmitting}>
          Submit Request
        </Button>
      </div>
    </form>
  );
}
