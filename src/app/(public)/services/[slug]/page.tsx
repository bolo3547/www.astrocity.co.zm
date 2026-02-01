import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { parseJsonArray } from '@/lib/json-helpers';
import { getServiceIcon } from '@/components/icons';
import { ArrowRight, CheckCircle2, Phone, MessageCircle, ArrowLeft } from 'lucide-react';

// Service-specific detailed content
const serviceDetails: Record<string, {
  heroImage: string;
  benefits: string[];
  process: { title: string; description: string }[];
  specifications?: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
}> = {
  'solar-water-pumps': {
    heroImage: '/images/solar-pump-hero.jpg',
    benefits: [
      'Zero electricity costs - powered entirely by the sun',
      'Reliable water supply even in remote areas without grid power',
      'Low maintenance with minimal moving parts',
      'Environmentally friendly with zero carbon emissions',
      'Long lifespan of 20-25 years for solar panels',
      'Government incentives and rebates available',
      'Automatic operation - no manual intervention needed',
      'Scalable systems to match your water requirements',
    ],
    process: [
      {
        title: 'Site Assessment',
        description: 'Our engineers visit your location to assess water source depth, daily water requirements, solar exposure, and terrain conditions.',
      },
      {
        title: 'System Design',
        description: 'We design a custom solar pumping system based on your specific needs, including panel sizing, pump selection, and storage requirements.',
      },
      {
        title: 'Equipment Procurement',
        description: 'We source high-quality solar panels, pumps, controllers, and accessories from trusted manufacturers with proven track records.',
      },
      {
        title: 'Professional Installation',
        description: 'Our certified technicians install the complete system, including panel mounting, pump installation, piping, and electrical connections.',
      },
      {
        title: 'Testing & Commissioning',
        description: 'We thoroughly test the system to ensure optimal performance, then train you on basic operation and maintenance.',
      },
      {
        title: 'Ongoing Support',
        description: 'We provide warranty coverage, maintenance services, and 24/7 technical support to keep your system running smoothly.',
      },
    ],
    specifications: [
      { label: 'Flow Rate', value: '1,000 - 50,000 liters/day' },
      { label: 'Pumping Head', value: 'Up to 200 meters' },
      { label: 'Panel Capacity', value: '200W - 5kW systems' },
      { label: 'Pump Types', value: 'Submersible & Surface' },
      { label: 'Warranty', value: '2-5 years (pump), 25 years (panels)' },
      { label: 'Lifespan', value: '15-25 years' },
    ],
    faqs: [
      {
        question: 'How much water can a solar pump provide daily?',
        answer: 'Depending on the system size and solar conditions, our pumps can deliver from 1,000 to over 50,000 liters per day. We\'ll assess your needs and design a system that meets your daily requirements.',
      },
      {
        question: 'Do solar pumps work on cloudy days?',
        answer: 'Yes, solar pumps work on cloudy days but at reduced capacity. We typically size systems to account for weather variations and can include battery backup or larger storage tanks for consistent supply.',
      },
      {
        question: 'What maintenance is required?',
        answer: 'Solar water pumps require minimal maintenance. Regular tasks include cleaning solar panels (monthly), checking connections (quarterly), and pump inspection (annually). We offer maintenance packages for peace of mind.',
      },
      {
        question: 'How deep can solar pumps draw water from?',
        answer: 'Our submersible solar pumps can draw water from depths of up to 200 meters. We\'ll recommend the right pump based on your borehole or well depth.',
      },
    ],
    relatedServices: ['borehole-drilling', 'water-tanks-stands', 'solar-power-systems'],
  },
  'borehole-drilling': {
    heroImage: '/images/borehole-hero.jpg',
    benefits: [
      'Access to clean, reliable underground water sources',
      'Independence from municipal water supply',
      'Long-term cost savings compared to water delivery',
      'Increased property value with private water source',
      'Consistent water quality from deep aquifers',
      'Drought-resistant water supply',
      'Suitable for domestic, agricultural, and commercial use',
      'Professional hydrogeological surveys ensure success',
    ],
    process: [
      {
        title: 'Hydrogeological Survey',
        description: 'We conduct comprehensive surveys using geophysical methods to identify the best drilling location with highest water yield potential.',
      },
      {
        title: 'Permits & Approvals',
        description: 'We handle all necessary permits and regulatory approvals required for borehole drilling in your area.',
      },
      {
        title: 'Drilling Operations',
        description: 'Using modern drilling rigs, we drill to the required depth, typically 30-150 meters depending on geological conditions.',
      },
      {
        title: 'Casing & Screen Installation',
        description: 'We install high-quality PVC or steel casings with appropriate screens to prevent sand infiltration and ensure water quality.',
      },
      {
        title: 'Development & Testing',
        description: 'The borehole is developed to maximize yield, then pump tested to determine sustainable extraction rate.',
      },
      {
        title: 'Pump Installation',
        description: 'We install the appropriate pump system (solar or electric) and connect to your water storage and distribution system.',
      },
    ],
    specifications: [
      { label: 'Drilling Depth', value: '30 - 200+ meters' },
      { label: 'Borehole Diameter', value: '6" - 8" standard' },
      { label: 'Casing Material', value: 'uPVC or Steel' },
      { label: 'Expected Yield', value: '500 - 20,000+ liters/hour' },
      { label: 'Drilling Method', value: 'Rotary & DTH' },
      { label: 'Completion Time', value: '1-5 days typical' },
    ],
    faqs: [
      {
        question: 'How do you know where to drill?',
        answer: 'We use hydrogeological surveys including resistivity testing and geological mapping to identify underground water sources. Our success rate is over 95% when proper surveys are conducted.',
      },
      {
        question: 'What if no water is found?',
        answer: 'While rare with proper surveys, if no viable water is found, we discuss options including drilling deeper or relocating. We\'re transparent about geological challenges upfront.',
      },
      {
        question: 'How long does drilling take?',
        answer: 'Most residential boreholes are completed in 1-3 days. Commercial or deeper boreholes may take 3-5 days. This doesn\'t include pump installation and finishing.',
      },
      {
        question: 'What permits are needed?',
        answer: 'Requirements vary by location. In Zambia, you typically need approval from WARMA (Water Resources Management Authority). We handle all permit applications for you.',
      },
    ],
    relatedServices: ['solar-water-pumps', 'water-tanks-stands', 'solar-power-systems'],
  },
  'water-tanks-stands': {
    heroImage: '/images/tanks-hero.jpg',
    benefits: [
      'Reliable water storage for consistent supply',
      'Gravity-fed distribution eliminates pumping costs',
      'Food-grade materials safe for drinking water',
      'UV-resistant tanks prevent algae growth',
      'Various sizes to match your consumption needs',
      'Durable construction withstands harsh weather',
      'Elevated stands provide excellent water pressure',
      'Easy integration with existing water systems',
    ],
    process: [
      {
        title: 'Needs Assessment',
        description: 'We evaluate your daily water consumption, peak demand periods, and backup requirements to recommend appropriate tank sizes.',
      },
      {
        title: 'Site Preparation',
        description: 'We prepare a level, stable foundation for your tank and stand, ensuring proper drainage and accessibility.',
      },
      {
        title: 'Stand Construction',
        description: 'Our team constructs robust steel or concrete stands designed to safely support full tank weight at your desired height.',
      },
      {
        title: 'Tank Installation',
        description: 'We carefully position and secure tanks on stands, ensuring stability and proper alignment for inlet/outlet connections.',
      },
      {
        title: 'Plumbing Connections',
        description: 'We connect tanks to your water source and distribution system with quality fittings, valves, and overflow protection.',
      },
      {
        title: 'Final Inspection',
        description: 'We test the complete installation, check for leaks, and demonstrate operation of valves and accessories.',
      },
    ],
    specifications: [
      { label: 'Tank Sizes', value: '500 - 20,000 liters' },
      { label: 'Tank Material', value: 'HDPE, Stainless Steel' },
      { label: 'Stand Heights', value: '2 - 6 meters' },
      { label: 'Stand Material', value: 'Galvanized Steel' },
      { label: 'Tank Warranty', value: '5-10 years' },
      { label: 'UV Protection', value: 'Yes (all tanks)' },
    ],
    faqs: [
      {
        question: 'What size tank do I need?',
        answer: 'For households, we recommend 2-3 days of storage. A family of 4 using 200 liters/day would need 500-1000 liters. For farms or businesses, we calculate based on your specific usage patterns.',
      },
      {
        question: 'How high should the stand be?',
        answer: 'Stand height depends on desired water pressure. Generally, 3 meters provides good household pressure. For multi-story buildings or long distribution distances, we may recommend higher stands or pressure boosting.',
      },
      {
        question: 'Are your tanks safe for drinking water?',
        answer: 'Yes, all our tanks are made from food-grade, BPA-free materials certified for potable water storage. They include UV protection to prevent algae growth.',
      },
      {
        question: 'Can you install multiple tanks?',
        answer: 'Absolutely! We can install multiple tanks in parallel for larger storage needs, or in series for staged filling. This is common for farms and commercial installations.',
      },
    ],
    relatedServices: ['borehole-drilling', 'solar-water-pumps', 'solar-power-systems'],
  },
  'solar-power-systems': {
    heroImage: '/images/solar-power-hero.jpg',
    benefits: [
      'Dramatically reduce or eliminate electricity bills',
      'Protection from rising utility costs',
      'Clean, renewable energy source',
      'Low maintenance with no fuel costs',
      'Battery backup for 24/7 power availability',
      'Increased property value',
      'Grid-tie options to sell excess power',
      '25-year panel warranty with 30+ year lifespan',
    ],
    process: [
      {
        title: 'Energy Audit',
        description: 'We analyze your current energy consumption, peak usage times, and electrical loads to understand your power needs.',
      },
      {
        title: 'System Design',
        description: 'Our engineers design an optimal system including panel layout, inverter sizing, battery capacity, and electrical integration.',
      },
      {
        title: 'Proposal & Financing',
        description: 'We provide detailed quotes with financing options, ROI calculations, and payback period estimates for your approval.',
      },
      {
        title: 'Installation',
        description: 'Our certified technicians install panels, inverters, batteries, and all electrical components following international standards.',
      },
      {
        title: 'Grid Connection',
        description: 'For grid-tie systems, we handle utility coordination and net metering setup so you can sell excess power back.',
      },
      {
        title: 'Monitoring Setup',
        description: 'We install monitoring systems so you can track production, consumption, and savings from your phone or computer.',
      },
    ],
    specifications: [
      { label: 'System Sizes', value: '1kW - 100kW+' },
      { label: 'Panel Types', value: 'Mono & Polycrystalline' },
      { label: 'Battery Options', value: 'Lithium-ion, Lead-acid' },
      { label: 'Inverter Types', value: 'Hybrid, Off-grid, Grid-tie' },
      { label: 'Panel Warranty', value: '25 years' },
      { label: 'System Warranty', value: '5-10 years' },
    ],
    faqs: [
      {
        question: 'How much can I save with solar?',
        answer: 'Savings depend on your current electricity costs and system size. Most customers see 50-100% reduction in electricity bills. We provide detailed savings projections during consultation.',
      },
      {
        question: 'Do I need batteries?',
        answer: 'Batteries are essential for off-grid systems and highly recommended for areas with frequent power outages. For reliable grid areas, grid-tie systems without batteries offer the best ROI.',
      },
      {
        question: 'How long until the system pays for itself?',
        answer: 'Payback period is typically 3-7 years depending on system size, electricity rates, and financing. After payback, you enjoy essentially free electricity for 20+ years.',
      },
      {
        question: 'What happens during load shedding?',
        answer: 'Systems with battery backup continue providing power during outages. The backup duration depends on battery capacity and your power consumption. We can size batteries for your specific backup needs.',
      },
    ],
    relatedServices: ['solar-water-pumps', 'borehole-drilling', 'water-tanks-stands'],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const service = await prisma.service.findFirst({
    where: { slug, isActive: true },
  });

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: `${service.title} - AstroCity Solar & Water Solutions`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const service = await prisma.service.findFirst({
    where: { slug, isActive: true },
  });

  if (!service) {
    notFound();
  }

  const features = parseJsonArray<string>(service.features);
  const details = serviceDetails[slug];
  const IconComponent = getServiceIcon(service.icon);

  // Get related services
  const relatedServices = details ? await prisma.service.findMany({
    where: {
      slug: { in: details.relatedServices },
      isActive: true,
    },
  }) : [];

  // Get settings for contact info
  const settings = await prisma.settings.findFirst();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        <div className="container-custom relative">
          <Link
            href="/services"
            className="inline-flex items-center text-sm text-navy-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Services
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-solar-500 text-white mb-6">
                <IconComponent className="w-8 h-8" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {service.title}
              </h1>
              <p className="text-lg text-navy-200 mb-8 leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-primary"
                >
                  Get a Free Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline border-white text-white hover:bg-white hover:text-navy-900"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Us
                  </a>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-solar-500 to-accent-500 flex items-center justify-center">
                    <IconComponent className="w-32 h-32 text-white/30" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="heading-2 text-navy-900 mb-4">What&apos;s Included</h2>
              <p className="text-body">Our comprehensive {service.title.toLowerCase()} service includes everything you need.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl bg-navy-50 hover:bg-navy-100 transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                  <span className="text-navy-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {details?.benefits && (
        <section className="section-padding bg-navy-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
                  Why Choose This Service
                </span>
                <h2 className="heading-2 text-navy-900 mb-6">
                  Benefits of {service.title}
                </h2>
                <div className="space-y-4">
                  {details.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-navy-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={`${service.title} benefits`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                      <IconComponent className="w-32 h-32 text-navy-700" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {details?.process && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
                Our Process
              </span>
              <h2 className="heading-2 text-navy-900 mb-4">How We Work</h2>
              <p className="text-body">
                From initial consultation to final installation, here&apos;s what you can expect.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {details.process.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-navy-900">{step.title}</h3>
                  </div>
                  <p className="text-navy-600 ml-16">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications Section */}
      {details?.specifications && (
        <section className="section-padding bg-navy-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="heading-2 text-white mb-4">Technical Specifications</h2>
              <p className="text-navy-300">
                Key specifications for our {service.title.toLowerCase()} solutions.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {details.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="bg-navy-800 rounded-xl p-6 text-center"
                >
                  <p className="text-navy-400 text-sm mb-2">{spec.label}</p>
                  <p className="text-white font-semibold text-lg">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {details?.faqs && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
                  Common Questions
                </span>
                <h2 className="heading-2 text-navy-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-6">
                {details.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-navy-50 rounded-xl p-6"
                  >
                    <h3 className="font-semibold text-navy-900 mb-3">{faq.question}</h3>
                    <p className="text-navy-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="section-padding bg-navy-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-2 text-navy-900 mb-4">Related Services</h2>
              <p className="text-body">Explore other solutions that complement {service.title.toLowerCase()}.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedServices.map((related) => {
                const RelatedIcon = getServiceIcon(related.icon);
                return (
                  <Link
                    key={related.id}
                    href={`/services/${related.slug}`}
                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-navy-100 group-hover:bg-solar-500 flex items-center justify-center mb-4 transition-colors">
                      <RelatedIcon className="w-7 h-7 text-navy-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-2 group-hover:text-solar-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-navy-600 text-sm line-clamp-2">{related.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-solar-500 to-solar-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-white mb-4">
              Ready to Get Started with {service.title}?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Contact us today for a free consultation and quote. Our experts are ready to help you find the perfect solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-solar-600 font-semibold rounded-lg hover:bg-navy-50 transition-colors"
              >
                Request a Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              {settings?.phones && (
                <a
                  href={`tel:${JSON.parse(settings.phones)[0]?.replace(/\s/g, '')}`}
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
