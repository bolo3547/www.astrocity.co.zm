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
  const { settings, services, projects } = await getPageData();

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
      
      <CtaSection whatsapp={settings?.whatsapp || '+260971234567'} />
    </>
  );
}
