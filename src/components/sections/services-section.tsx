import Link from 'next/link';
import { Icons, getServiceIcon } from '@/components/icons';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  features: string[];
}

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-solar-600 mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-6 leading-tight">
            Complete Solar & Water Solutions
          </h2>
          <p className="text-lg text-navy-600 leading-relaxed">
            From solar water pumps to borehole drilling and complete power systems, we deliver reliable solutions tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = getServiceIcon(service.icon);
            return (
              <Link
                key={service.id}
                href={`/services#${service.slug}`}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-solar-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Hover Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-solar-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-navy-900 flex items-center justify-center mb-6 group-hover:bg-solar-600 transition-colors duration-300 shadow-lg shadow-navy-900/10">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-solar-700 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-navy-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Features Preview */}
                  {service.features.length > 0 && (
                    <ul className="space-y-2.5 mb-6">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-navy-700">
                          <div className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icons.check className="w-3 h-3 text-accent-600" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Link */}
                  <div className="flex items-center text-sm font-semibold text-solar-600 group-hover:text-solar-700">
                    Learn more
                    <Icons.arrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-16">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-all duration-200 shadow-lg shadow-navy-900/20"
          >
            Explore All Services
            <Icons.arrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
