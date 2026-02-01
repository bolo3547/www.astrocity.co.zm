import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import prisma from '@/lib/prisma';
import { parseJsonArray } from '@/lib/json-helpers';

export const metadata: Metadata = {
  title: 'Our Projects - Successful Installations & Case Studies',
  description: 'View our portfolio of successful solar water pump, borehole drilling, and solar power installations.',
};

async function getProjects() {
  noStore(); // Disable caching to always fetch fresh data
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    return projects.map(project => ({
      ...project,
      services: parseJsonArray<string>(project.services),
      images: parseJsonArray<string>(project.images),
    }));
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Our Projects
            </span>
            <h1 className="heading-1 text-navy-900 mb-6">
              Proven Results Across Industries
            </h1>
            <p className="text-body">
              Explore our portfolio of successful installations for residential, agricultural, and commercial clients.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <article
                  key={project.id}
                  id={project.slug}
                  className="group card hover:shadow-lg transition-all duration-300 scroll-mt-24"
                >
                  {/* Image Placeholder */}
                  <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center mb-5 overflow-hidden">
                    <Icons.sun className="w-16 h-16 text-navy-300 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Featured Badge */}
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-solar-600 bg-solar-50 px-2 py-1 rounded-full mb-3">
                      <Icons.award className="w-3 h-3" />
                      Featured
                    </span>
                  )}

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-navy-900 mb-2 group-hover:text-solar-600 transition-colors">
                    {project.title}
                  </h2>

                  {/* Location */}
                  {project.location && (
                    <div className="flex items-center gap-1.5 text-sm text-navy-500 mb-3">
                      <Icons.mapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                  )}

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-navy-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {/* Services Tags */}
                  {project.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.services.map((service, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-full bg-navy-50 text-navy-600"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-navy-400">
                    {project.client && <span>Client: {project.client}</span>}
                    {project.completedAt && (
                      <span>{formatDate(project.completedAt)}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Icons.sun className="w-16 h-16 text-navy-200 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-navy-900 mb-2">
                Projects Coming Soon
              </h2>
              <p className="text-navy-500">
                Check back soon to see our latest installations.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-3 text-navy-900 mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-navy-600 mb-8">
              Let's discuss how we can help you achieve reliable water supply and sustainable energy for your property.
            </p>
            <a href="/contact" className="btn-primary">
              Request a Free Quote
              <Icons.arrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
