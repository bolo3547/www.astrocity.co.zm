import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import prisma from '@/lib/prisma';
import { FAQAccordion } from './faq-accordion';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - AstroCity',
  description: 'Find answers to common questions about our solar water pumps, borehole drilling services, and solar power systems.',
};

async function getFAQs() {
  noStore(); // Disable caching to always fetch fresh data
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return faqs;
  } catch {
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs();

  // Group FAQs by category
  const groupedFAQs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Help Center
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-navy-600">
              Find answers to common questions about our solar and water solutions. 
              Can't find what you're looking for? Contact us directly.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqs.length > 0 ? (
              Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
                <div key={category} className="mb-12">
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 pb-2 border-b border-navy-200">
                    {category}
                  </h2>
                  <FAQAccordion faqs={categoryFaqs} />
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-navy-500 text-lg">
                  FAQs are being updated. Please check back soon or contact us directly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-navy-300 mb-8">
              Our team is here to help. Get in touch and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-solar-500 text-white font-semibold rounded-lg hover:bg-solar-600 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="tel:+260971234567"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
