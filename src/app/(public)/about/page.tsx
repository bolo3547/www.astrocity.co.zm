import { Metadata } from 'next';
import { Icons } from '@/components/icons';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'About Us - Our Story & Commitment to Quality',
  description: 'Learn about our company, our team, and our commitment to delivering reliable solar and water solutions.',
};

async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst();
    return settings;
  } catch {
    return null;
  }
}

const values = [
  {
    icon: Icons.shield,
    title: 'Quality First',
    description: 'We never compromise on quality. Every product we use meets international standards.',
  },
  {
    icon: Icons.users,
    title: 'Customer Focus',
    description: 'Your satisfaction is our priority. We listen, understand, and deliver solutions that work.',
  },
  {
    icon: Icons.wrench,
    title: 'Technical Excellence',
    description: 'Our team stays updated with the latest technologies and best practices in the industry.',
  },
  {
    icon: Icons.award,
    title: 'Integrity',
    description: 'Honest advice, transparent pricing, and reliable service you can count on.',
  },
];

const milestones = [
  { year: '2015', event: 'Company founded with a mission to provide sustainable water solutions' },
  { year: '2017', event: 'Expanded services to include comprehensive solar power installations' },
  { year: '2019', event: 'Reached 100+ successful project installations milestone' },
  { year: '2021', event: 'Introduced advanced solar pumping systems for deep wells' },
  { year: '2023', event: 'Achieved 500+ completed projects across residential and commercial sectors' },
  { year: '2025', event: 'Continuing to innovate and expand our sustainable solutions' },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              About Us
            </span>
            <h1 className="heading-1 text-navy-900 mb-6">
              Powering Progress, Sustaining Life
            </h1>
            <p className="text-body">
              {settings?.aboutText ||
                'We are a leading provider of sustainable water and energy solutions, dedicated to delivering reliable systems that improve lives and protect the environment.'}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
                Our Mission
              </span>
              <h2 className="heading-2 text-navy-900 mb-6">
                Sustainable Solutions for Water & Energy
              </h2>
              <p className="text-body mb-6">
                Our mission is to provide accessible, reliable, and sustainable solar and water solutions that empower communities, support agriculture, and enable businesses to thrive.
              </p>
              <p className="text-body">
                We believe that access to clean water and renewable energy is fundamental to progress. That's why we combine technical expertise with quality products to deliver solutions that work reliably for years.
              </p>
            </div>
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-solar-100 to-navy-100 flex items-center justify-center">
              <Icons.sun className="w-32 h-32 text-solar-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-navy-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Our Values
            </span>
            <h2 className="heading-2 text-navy-900 mb-6">
              What Drives Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-solar-100 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-solar-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-navy-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Our Journey
            </span>
            <h2 className="heading-2 text-navy-900 mb-6">
              Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-navy-200 transform md:-translate-x-1/2" />

              {/* Timeline items */}
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-solar-500 transform -translate-x-1/2 z-10" />

                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <span className="text-sm font-bold text-solar-600">
                        {milestone.year}
                      </span>
                      <p className="text-navy-600 mt-1">
                        {milestone.event}
                      </p>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-3 text-white mb-6">
              Let's Work Together
            </h2>
            <p className="text-lg text-navy-200 mb-8">
              Ready to discuss your project? Our team is here to help you find the perfect solution.
            </p>
            <a href="/contact" className="btn-primary bg-white text-navy-900 hover:bg-navy-50">
              Get in Touch
              <Icons.arrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
