import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { Icons } from '@/components/icons';
import { ContactForm } from './contact-form';
import prisma from '@/lib/prisma';
import { parseJsonArray } from '@/lib/json-helpers';

export const metadata: Metadata = {
  title: 'Contact Us - Request a Quote',
  description: 'Get in touch with us for a free consultation and quote on solar water pumps, borehole drilling, and solar power systems.',
};

async function getData() {
  noStore(); // Disable caching to always fetch fresh data
  try {
    const [settings, services] = await Promise.all([
      prisma.settings.findFirst(),
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: { id: true, title: true },
      }),
    ]);
    return { settings, services };
  } catch {
    return { settings: null, services: [] };
  }
}

export default async function ContactPage() {
  const { settings, services } = await getData();
  const phones = parseJsonArray<string>(settings?.phones);

  const whatsappLink = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Contact Us
            </span>
            <h1 className="heading-1 text-navy-900 mb-6">
              Let's Discuss Your Project
            </h1>
            <p className="text-body">
              Request a free quote or get in touch with our team. We're here to help you find the perfect solar or water solution.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-navy-900 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                {settings?.address && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                      <Icons.mapPin className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-navy-900 mb-1">Address</h3>
                      <p className="text-sm text-navy-500">{settings.address}</p>
                    </div>
                  </div>
                )}

                {phones.length > 0 && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                      <Icons.phone className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-navy-900 mb-1">Phone</h3>
                      <div className="space-y-1">
                        {phones.map((phone: string, index: number) => (
                          <a
                            key={index}
                            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                            className="block text-sm text-navy-500 hover:text-solar-600 transition-colors"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settings?.email && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                      <Icons.mail className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-navy-900 mb-1">Email</h3>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-sm text-navy-500 hover:text-solar-600 transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.workingHours && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                      <Icons.clock className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-navy-900 mb-1">Working Hours</h3>
                      <p className="text-sm text-navy-500">{settings.workingHours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp CTA */}
              {whatsappLink && (
                <div className="mt-8 p-5 rounded-xl bg-accent-50 border border-accent-100">
                  <h3 className="text-sm font-semibold text-accent-800 mb-2">
                    Prefer WhatsApp?
                  </h3>
                  <p className="text-sm text-accent-700 mb-4">
                    Chat with us directly for quick responses.
                  </p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full"
                  >
                    <Icons.messageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Us
                  </a>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-navy-50 rounded-2xl p-8 lg:p-10">
                <h2 className="text-xl font-semibold text-navy-900 mb-2">
                  Request a Quote
                </h2>
                <p className="text-sm text-navy-500 mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <ContactForm
                  services={services.map((s) => ({ value: s.title, label: s.title }))}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
