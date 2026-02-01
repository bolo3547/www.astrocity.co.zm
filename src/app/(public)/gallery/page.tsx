import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { parseJsonArray } from '@/lib/json-helpers';
import { GalleryGrid } from './gallery-grid';

export const metadata: Metadata = {
  title: 'Project Gallery - AstroCity',
  description: 'Browse our portfolio of completed solar water pump installations, borehole drilling projects, and solar power systems.',
};

async function getGalleryImages() {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        images: true,
        location: true,
        services: true,
      },
    });

    // Flatten all images with project info
    const images: Array<{
      id: string;
      url: string;
      projectTitle: string;
      projectSlug: string;
      location: string | null;
      services: string[];
    }> = [];

    projects.forEach((project) => {
      const projectImages = parseJsonArray<string>(project.images);
      projectImages.forEach((imageUrl, index) => {
        images.push({
          id: `${project.id}-${index}`,
          url: imageUrl,
          projectTitle: project.title,
          projectSlug: project.slug,
          location: project.location,
          services: parseJsonArray<string>(project.services),
        });
      });
    });

    return images;
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Our Work
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Project Gallery
            </h1>
            <p className="text-lg text-navy-600">
              Browse through our portfolio of completed projects. From solar water pumps to 
              borehole drilling and solar power installations.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {images.length > 0 ? (
            <GalleryGrid images={images} />
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">📷</span>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Gallery Coming Soon</h2>
              <p className="text-navy-500 text-lg">
                We're updating our project gallery. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
