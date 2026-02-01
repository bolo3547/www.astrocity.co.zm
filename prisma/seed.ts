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

  // Create sample testimonials
  const testimonials = [
    {
      name: 'John Mwale',
      role: 'Farm Owner',
      company: 'Mwale Farms Ltd',
      content: 'AstroCity installed a solar water pumping system on our farm last year. The difference is incredible - we now have reliable water supply for our 50-acre farm without any electricity costs. Their team was professional and the installation was completed on time.',
      rating: 5,
      order: 1,
    },
    {
      name: 'Grace Tembo',
      role: 'Managing Director',
      company: 'Tembo Lodge',
      content: 'We needed a reliable water solution for our guest lodge. AstroCity drilled a borehole and installed a solar pump system. Our guests now enjoy consistent water supply, and we have saved significantly on operating costs.',
      rating: 5,
      order: 2,
    },
    {
      name: 'Peter Banda',
      role: 'Homeowner',
      company: null,
      content: 'I was tired of unreliable water supply in my area. AstroCity drilled a borehole for my home and it has been the best investment. The water quality is excellent and their after-sales support is outstanding.',
      rating: 5,
      order: 3,
    },
    {
      name: 'Susan Phiri',
      role: 'School Administrator',
      company: 'Nangoma Community School',
      content: 'AstroCity provided our school with a complete water solution. The children now have access to clean water, which has improved hygiene and reduced waterborne diseases. We are forever grateful.',
      rating: 5,
      order: 4,
    },
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: testimonial.name },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial });
    }
  }

  // Create sample FAQs
  const faqs = [
    {
      question: 'How deep can you drill a borehole?',
      answer: 'We can drill boreholes up to 200+ meters deep using our modern drilling equipment. The actual depth needed depends on the local water table, which we determine through a hydrogeological survey before drilling.',
      category: 'Borehole Drilling',
      order: 1,
    },
    {
      question: 'How much water can a solar pump provide?',
      answer: 'Our solar pumps can deliver from 1,000 to 50,000 liters per day depending on the model and solar panel configuration. The right system depends on your water needs, borehole yield, and depth.',
      category: 'Solar Water Pumps',
      order: 2,
    },
    {
      question: 'Do solar pumps work on cloudy days?',
      answer: 'Yes, solar pumps work on cloudy days but at reduced capacity. We size systems to account for seasonal variations and can include battery backup or water storage tanks to ensure consistent supply.',
      category: 'Solar Water Pumps',
      order: 3,
    },
    {
      question: 'What warranty do you offer?',
      answer: 'We offer 5 years warranty on solar pumping systems, 25 years on solar panels, and 2 years on installation workmanship. Boreholes come with a 1-year guarantee on construction quality.',
      category: 'General',
      order: 4,
    },
    {
      question: 'How long does borehole drilling take?',
      answer: 'A typical residential borehole takes 2-3 days to drill, while larger commercial projects may take 5-7 days. This includes drilling, casing installation, and pump testing.',
      category: 'Borehole Drilling',
      order: 5,
    },
    {
      question: 'Do you offer maintenance services?',
      answer: 'Yes, we offer comprehensive maintenance packages for all our installations. This includes regular inspections, cleaning, and preventive maintenance to ensure optimal performance.',
      category: 'General',
      order: 6,
    },
    {
      question: 'What areas do you serve?',
      answer: 'We are based in Nangoma, Mumbwa District and serve all of Central Province, Lusaka Province, and surrounding areas. For larger projects, we can travel throughout Zambia.',
      category: 'General',
      order: 7,
    },
    {
      question: 'How do I get a quote?',
      answer: 'Simply fill out our online quote request form or contact us via WhatsApp. We will arrange a site visit to assess your needs and provide a detailed quotation within 2-3 business days.',
      category: 'General',
      order: 8,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: faq.question },
    });
    if (!existing) {
      await prisma.fAQ.create({ data: faq });
    }
  }

  // Create sample blog posts
  const blogPosts = [
    {
      title: 'The Benefits of Solar Water Pumping for Zambian Farms',
      slug: 'benefits-solar-water-pumping-zambian-farms',
      content: `Solar water pumping is revolutionizing agriculture in Zambia. Here's why more farmers are making the switch:

## Lower Operating Costs
Traditional diesel pumps cost thousands of kwacha per month in fuel. Solar pumps have zero fuel costs, with most systems paying for themselves within 2-3 years.

## Reliable Water Supply
With Zambia's abundant sunshine, solar pumps provide consistent water supply throughout the year. Modern systems include controllers that optimize pump operation automatically.

## Low Maintenance
Unlike diesel generators, solar pumps have minimal moving parts. This means less maintenance, fewer breakdowns, and longer service life.

## Environmental Benefits
Solar pumping produces zero emissions, helping protect our environment while providing the water your farm needs.

Contact us today to learn how solar water pumping can transform your farming operation.`,
      excerpt: 'Discover how solar water pumping can reduce costs and improve reliability for Zambian farms.',
      category: 'Solar Energy',
      tags: JSON.stringify(['solar', 'farming', 'water pumping', 'agriculture']),
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2025-12-01'),
    },
    {
      title: 'How to Maintain Your Borehole for Maximum Lifespan',
      slug: 'maintain-borehole-maximum-lifespan',
      content: `A well-maintained borehole can last 30-50 years. Here are essential maintenance tips:

## Regular Water Testing
Test your water quality annually to detect any changes in mineral content or contamination early.

## Pump Maintenance
Have your pump inspected every 12-18 months. Look for signs of wear, check electrical connections, and test performance.

## Protect the Wellhead
Ensure the borehole cap is sealed properly to prevent surface water contamination. Maintain a clean area around the wellhead.

## Monitor Water Levels
Keep track of water levels, especially during dry season. Significant drops may indicate aquifer issues or increased demand.

## Professional Inspections
Schedule professional inspections every 2-3 years for a comprehensive assessment of your borehole's condition.

Need borehole maintenance? Contact AstroCity for professional service.`,
      excerpt: 'Essential tips to keep your borehole functioning optimally for decades.',
      category: 'Water Solutions',
      tags: JSON.stringify(['borehole', 'maintenance', 'water quality']),
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date('2025-11-15'),
    },
    {
      title: 'Understanding Solar Power System Sizing for Your Home',
      slug: 'solar-power-system-sizing-home',
      content: `Choosing the right solar power system size is crucial for meeting your energy needs without overspending.

## Assess Your Energy Consumption
Start by reviewing your ZESCO bills to understand your monthly kWh usage. Note peak usage times and essential loads.

## Calculate Required Capacity
A typical Zambian home uses 200-500 kWh monthly. For backup power, identify which loads are essential during outages.

## Consider Future Needs
Plan for potential increases in energy use. It's more cost-effective to size slightly larger than to expand later.

## Battery Storage
If you want power during outages or at night, include battery storage in your system design.

## Grid-Tied vs Off-Grid
Grid-tied systems are more affordable but don't provide backup. Hybrid systems offer the best of both worlds.

Let AstroCity design the perfect solar power system for your home.`,
      excerpt: 'Learn how to determine the right solar power system size for your household needs.',
      category: 'Solar Energy',
      tags: JSON.stringify(['solar power', 'home energy', 'system sizing']),
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date('2025-10-20'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  // Create site stats
  const existingStats = await prisma.siteStats.findFirst();
  if (!existingStats) {
    await prisma.siteStats.create({
      data: {
        projectsCompleted: 150,
        yearsExperience: 8,
        happyCustomers: 200,
        teamMembers: 12,
      },
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
