import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { getServiceIcon } from '@/components/icons';
import prisma from '@/lib/prisma';
import { parseJsonArray } from '@/lib/json-helpers';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Services - Solar Water Pumps, Borehole Drilling & More',
  description: 'Comprehensive solar and water solutions including solar water pumps, borehole drilling, water tanks, and solar power systems.',
};

async function getServices() {
  noStore(); // Disable caching to always fetch fresh data
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return services.map(service => ({
      ...service,
      features: parseJsonArray<string>(service.features),
    }));
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Our Services
            </span>
            <h1 className="heading-1 text-navy-900 mb-6">
              Complete Solar & Water Solutions
            </h1>
            <p className="text-body">
              From solar-powered water pumping to borehole drilling and complete solar installations, we provide end-to-end solutions for your water and energy needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => {
              const IconComponent = getServiceIcon(service.icon);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center scroll-mt-24 ${
                    !isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={!isEven ? 'lg:order-2' : ''}>
                    <div className="w-16 h-16 rounded-xl bg-solar-100 flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-solar-600" />
                    </div>
                    <h2 className="heading-3 text-navy-900 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-body mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    {service.features.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-500 mb-4">
                          Key Features
                        </h3>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {service.features.slice(0, 6).map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icons.check className="w-3 h-3 text-accent-600" />
                              </div>
                              <span className="text-sm text-navy-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Learn More Link */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-solar-600 font-semibold hover:text-solar-700 transition-colors group"
                    >
                      Learn More About {service.title}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Visual */}
                  <div className={!isEven ? 'lg:order-1' : ''}>
                    <Link href={`/services/${service.slug}`} className="block group">
                      <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center overflow-hidden relative">
                        <IconComponent className="w-24 h-24 text-navy-300 group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/10 transition-colors" />
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-3 text-white mb-6">
              Need Help Choosing the Right Solution?
            </h2>
            <p className="text-lg text-navy-200 mb-8">
              Contact us for a free consultation. Our experts will assess your needs and recommend the best solution for your specific requirements.
            </p>
            <a
              href="/contact"
              className="btn-primary bg-white text-navy-900 hover:bg-navy-50"
            >
              Get a Free Consultation
              <Icons.arrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
