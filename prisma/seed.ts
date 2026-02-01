import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@astrocity.co.zm' },
    update: {},
    create: {
      email: 'admin@astrocity.co.zm',
      password: hashedPassword,
      name: 'Administrator',
      role: 'admin',
    },
  });

  // Create default settings
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        companyName: 'AstroCity Solar & Water Solutions',
        tagline: 'Powering Progress, Sustaining Life',
        address: 'Nangoma, Mumbwa District, Central Province, Zambia',
        phones: JSON.stringify(['+260 97 123 4567', '+260 96 123 4567']),
        whatsapp: '+260971234567',
        email: 'info@astrocity.co.zm',
        website: 'www.astrocity.co.zm',
        workingHours: 'Mon - Fri: 7:00 AM - 6:00 PM | Sat: 8:00 AM - 2:00 PM',
        heroHeadline: 'Reliable Solar Pumping & Borehole Drilling for Homes, Farms & Businesses',
        heroSubheadline: 'Professional installation of solar water pumps, borehole drilling, tanks, and complete solar power systems—built for reliability and long-term performance.',
        heroCta: 'Request a Quote',
        heroCtaSecondary: 'WhatsApp Us',
        aboutText: "Based in Nangoma, Mumbwa District, we are Zambia's trusted provider of sustainable water and energy solutions. With years of experience in solar water pumping systems, borehole drilling, and solar power installations, we deliver reliable solutions that stand the test of time. Our commitment to quality engineering and customer satisfaction has made us the trusted choice for homes, farms, and businesses across Central Province and beyond.",
        metaTitle: 'AstroCity - Solar Water Pumps, Borehole Drilling & Solar Power Systems | Zambia',
        metaDescription: 'Professional installation of solar water pumps, borehole drilling, water tanks, and complete solar power systems in Zambia. Reliable solutions for homes, farms & businesses.',
        defaultTerms: 'Payment: 50% deposit upon acceptance, 50% upon completion.\nDelivery: As specified in quotation.\nValidity: This quotation is valid for the period stated above.\nWarranty: Standard manufacturer warranty applies to all equipment.',
      },
    });
  }

  // Create services
  const services = [
    {
      title: 'Solar Water Pumps',
      slug: 'solar-water-pumps',
      description: 'High-efficiency solar-powered water pumping systems designed for agricultural, residential, and commercial applications. Our pumps operate reliably without grid electricity, reducing operational costs and environmental impact.',
      icon: 'pump',
      features: JSON.stringify([
        'Zero electricity costs - powered entirely by the sun',
        'Maintenance-free operation with minimal moving parts',
        'Suitable for deep wells up to 200m',
        'Automatic operation with smart controllers',
        '5-year warranty on all systems',
        'Flow rates from 1,000 to 50,000 liters/day',
        'Both submersible and surface pump options',
        '25-year lifespan on solar panels',
      ]),
      order: 1,
    },
    {
      title: 'Borehole Drilling',
      slug: 'borehole-drilling',
      description: 'Professional borehole drilling services using modern equipment and experienced teams. We conduct thorough geological surveys to ensure optimal water yield and long-term reliability for homes, farms, and businesses.',
      icon: 'drill',
      features: JSON.stringify([
        'Free hydrogeological site assessment',
        'Modern rotary and DTH drilling equipment',
        'Drilling depths up to 200+ meters',
        'Water quality testing included',
        'Full documentation & permit assistance',
        'High-quality uPVC and steel casings',
        '95%+ success rate with proper surveys',
        'Pump testing to determine yield',
      ]),
      order: 2,
    },
    {
      title: 'Water Tanks & Stands',
      slug: 'water-tanks-stands',
      description: 'Quality water storage solutions including tanks of various capacities and durable steel tank stands. We supply and install complete water storage systems tailored to your needs.',
      icon: 'tank',
      features: JSON.stringify([
        'Capacities from 500L to 20,000L',
        'Food-grade HDPE plastic tanks',
        'Galvanized steel stands',
        'Professional installation',
        'UV-resistant materials',
        'Custom solutions available',
      ]),
      order: 3,
    },
    {
      title: 'Solar Power Systems',
      slug: 'solar-power-systems',
      description: 'Complete solar power solutions including panels, inverters, and battery storage systems. We design and install systems for homes, businesses, and off-grid applications to reduce your electricity costs.',
      icon: 'solar',
      features: JSON.stringify([
        'Grid-tied & off-grid system options',
        'Premium tier-1 solar panels',
        'Hybrid inverters with smart monitoring',
        'Lithium battery storage systems',
        'Professional installation & commissioning',
        '25-year panel warranty',
        'Reduce electricity bills by 50-100%',
        '3-7 year typical payback period',
      ]),
      order: 4,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  // Create sample projects
  const projects = [
    {
      title: 'Agricultural Solar Pumping System',
      slug: 'agricultural-solar-pumping',
      description: 'Installation of a complete solar water pumping system for a 50-acre farm, providing reliable irrigation for crops and livestock watering.',
      location: 'Mumbwa District',
      client: 'Local Commercial Farm',
      services: JSON.stringify(['Solar Water Pumps', 'Water Tanks']),
      images: JSON.stringify([]),
      isFeatured: true,
      completedAt: new Date('2025-11-15'),
    },
    {
      title: 'Commercial Borehole Project',
      slug: 'commercial-borehole-project',
      description: 'Deep borehole drilling for a commercial complex, achieving excellent water yield at 180 meters depth.',
      location: 'Lusaka',
      client: 'Business Complex',
      services: JSON.stringify(['Borehole Drilling', 'Water Tanks']),
      images: JSON.stringify([]),
      isFeatured: true,
      completedAt: new Date('2025-10-20'),
    },
    {
      title: 'Residential Solar Power Installation',
      slug: 'residential-solar-power',
      description: 'Complete 10kW solar power system with battery backup for a modern residential home, providing energy independence.',
      location: 'Kabwe',
      client: 'Private Residence',
      services: JSON.stringify(['Solar Power Systems']),
      images: JSON.stringify([]),
      isFeatured: true,
      completedAt: new Date('2025-12-05'),
    },
    {
      title: 'School Water Supply Project',
      slug: 'school-water-supply',
      description: 'Borehole drilling and solar pump installation for a rural school, ensuring clean water access for over 500 students.',
      location: 'Nangoma, Mumbwa',
      client: 'Community School',
      services: JSON.stringify(['Borehole Drilling', 'Solar Water Pumps', 'Water Tanks']),
      images: JSON.stringify([]),
      isFeatured: true,
      completedAt: new Date('2025-09-30'),
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('Admin credentials:');
  console.log('Email: admin@astrocity.co.zm');
  console.log('Password: Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
