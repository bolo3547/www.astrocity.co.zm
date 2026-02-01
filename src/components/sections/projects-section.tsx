import Link from 'next/link';
import { Icons, getServiceIcon } from '@/components/icons';

interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  services?: string[];
  images?: string[];
  imageUrl?: string | null;
  completedAt?: Date | null;
}

interface ProjectsSectionProps {
  projects: Project[];
}

// Project type icons based on keywords in title
function getProjectIcon(title: string) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('pump') || titleLower.includes('water')) return Icons.droplets;
  if (titleLower.includes('borehole') || titleLower.includes('drill')) return Icons.drill;
  if (titleLower.includes('solar') || titleLower.includes('power')) return Icons.sun;
  if (titleLower.includes('tank')) return Icons.cylinder;
  return Icons.sun;
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
            Our Projects
          </span>
          <h2 className="heading-2 text-navy-900 mb-6">
            Featured Installations
          </h2>
          <p className="text-body">
            See examples of our work across residential, agricultural, and commercial applications.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => {
            const ProjectIcon = getProjectIcon(project.title);
            const hasImage = project.imageUrl || (project.images && project.images.length > 0);
            
            return (
              <Link
                key={project.id}
                href={`/projects#${project.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Image/Placeholder Area */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  {hasImage ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${project.imageUrl || project.images?.[0]})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                        <ProjectIcon className="w-10 h-10 text-white/80" />
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Location Badge */}
                  {project.location && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-navy-700">
                      <Icons.mapPin className="w-3 h-3" />
                      {project.location}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-navy-900 mb-2 group-hover:text-solar-600 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  
                  {project.description && (
                    <p className="text-sm text-navy-500 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  )}

                  {/* Footer with arrow */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-navy-400">
                      {project.completedAt 
                        ? new Date(project.completedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : 'View Project'
                      }
                    </span>
                    <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center group-hover:bg-solar-100 transition-colors">
                      <Icons.arrowRight className="w-4 h-4 text-navy-400 group-hover:text-solar-600 transform group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-navy-900 text-sm font-semibold text-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-200"
          >
            View All Projects
            <Icons.arrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
