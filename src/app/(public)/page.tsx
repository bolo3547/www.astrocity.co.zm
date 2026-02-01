import {
  HeroSection,
  ServicesSection,
  WhyChooseUsSection,
  ProjectsSection,
  CtaSection,
} from '@/components/sections';
import prisma from '@/lib/prisma';
import { parseJsonArray } from '@/lib/json-helpers';

// Fallback demo data when database is not connected
const demoServices = [
  {
    id: '1',
    title: 'Solar Water Pumps',
    slug: 'solar-water-pumps',
    description: 'High-efficiency solar-powered water pumping systems for irrigation, livestock watering, and domestic water supply. Reliable performance with minimal maintenance.',
    icon: 'pump',
    features: ['No fuel costs', 'Low maintenance', 'Remote monitoring available'],
  },
  {
    id: '2',
    title: 'Borehole Drilling',
    slug: 'borehole-drilling',
    description: 'Professional borehole drilling services using modern equipment. We ensure clean, reliable water access for your property with proper geological surveys.',
    icon: 'drill',
    features: ['Geological surveys', 'Professional equipment', 'Water quality testing'],
  },
  {
    id: '3',
    title: 'Water Tanks & Stands',
    slug: 'water-tanks',
    description: 'Quality water storage solutions including JoJo tanks, steel tanks, and custom tank stands. Designed for durability and optimal water pressure.',
    icon: 'tank',
    features: ['Various sizes available', 'Durable materials', 'Custom stands'],
  },
  {
    id: '4',
    title: 'Solar Power Systems',
    slug: 'solar-power',
    description: 'Complete solar power installations including panels, inverters, and battery storage. Reduce electricity costs and ensure reliable backup power.',
    icon: 'solar',
    features: ['Grid-tied & off-grid', 'Battery backup', 'Professional installation'],
  },
];

const demoProjects = [
  {
    id: '1',
    title: 'Agricultural Farm Solar Pump Installation',
    slug: 'farm-solar-pump',
    description: 'Complete solar pumping system for a 50-hectare farm with drip irrigation.',
    imageUrl: null,
    location: 'Harare Region',
    completedAt: new Date('2024-08-15'),
  },
  {
    id: '2',
    title: 'Rural Community Borehole Project',
    slug: 'community-borehole',
    description: 'Deep borehole drilling and solar pump for community water supply.',
    imageUrl: null,
    location: 'Mashonaland East',
    completedAt: new Date('2024-07-20'),
  },
  {
    id: '3',
    title: 'Commercial Building Solar Installation',
    slug: 'commercial-solar',
    description: '25kW solar system with battery backup for office complex.',
    imageUrl: null,
    location: 'Bulawayo',
    completedAt: new Date('2024-06-10'),
  },
  {
    id: '4',
    title: 'Lodge Water System Upgrade',
    slug: 'lodge-water-system',
    description: 'Complete water system including borehole, tanks, and solar pumping.',
    imageUrl: null,
    location: 'Victoria Falls',
    completedAt: new Date('2024-05-22'),
  },
];

async function getPageData() {
  try {
    const [settings, servicesRaw, projectsRaw] = await Promise.all([
      prisma.settings.findFirst(),
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        take: 4,
      }),
      prisma.project.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }),
    ]);

    const services = servicesRaw.map(s => ({
      ...s,
      features: parseJsonArray<string>(s.features),
    }));

    const projects = projectsRaw.map(p => ({
      ...p,
      services: parseJsonArray<string>(p.services),
      images: parseJsonArray<string>(p.images),
    }));

    return { 
      settings, 
      services: services.length > 0 ? services : demoServices,
      projects: projects.length > 0 ? projects : demoProjects,
    };
  } catch {
    // Return demo data when database is not available
    return { settings: null, services: demoServices, projects: demoProjects };
  }
}

export default async function HomePage() {
  const { settings, services, projects, teamMembers } = await getPageData();

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline || 'Reliable Solar Pumping & Borehole Drilling for Homes, Farms & Businesses'}
        subheadline={settings?.heroSubheadline || 'Professional installation of solar water pumps, borehole drilling, tanks, and complete solar power systems—built for reliability and long-term performance.'}
        ctaPrimary={settings?.heroCta || 'Request a Quote'}
        ctaSecondary={settings?.heroCtaSecondary || 'WhatsApp Us'}
        whatsapp={settings?.whatsapp || '+260971234567'}
      />
      
      <ServicesSection services={services} />
      
      <WhyChooseUsSection />
      
      <ProjectsSection projects={projects} />

      {/* Featured Team Preview */}
      {teamMembers.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                The Team Behind AstroCity
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Meet our experienced professionals dedicated to delivering reliable solar and water solutions.
              </p>
            </div>
            <div className={`grid gap-8 ${
              teamMembers.length === 1 ? 'max-w-md mx-auto' :
              teamMembers.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' :
              teamMembers.length === 3 ? 'md:grid-cols-3 max-w-4xl mx-auto' :
              'md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-gray-100 mb-4"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full mx-auto bg-navy-100 flex items-center justify-center border-4 border-gray-100 mb-4">
                      <span className="text-3xl font-bold text-navy-600">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-navy-900 mb-1">{member.name}</h3>
                  <p className="text-solar-600 font-medium text-sm">{member.role}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-solar-600 hover:text-solar-700 font-medium"
              >
                Meet the full team
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <CtaSection whatsapp={settings?.whatsapp || '+260971234567'} />
    </>
  );
}
