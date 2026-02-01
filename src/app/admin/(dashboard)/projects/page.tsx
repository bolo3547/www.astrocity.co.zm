import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { DeleteProjectButton } from './delete-project-button';

export const metadata: Metadata = {
  title: 'Projects - Admin',
};

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    return projects;
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Projects</h1>
          <p className="text-navy-500 mt-1">Manage your project gallery</p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Link>
      </div>

      <div className="admin-card">
        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Project
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Location
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Featured
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-navy-900">{project.title}</p>
                        <p className="text-sm text-navy-500 line-clamp-1">
                          {project.client || '-'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-navy-600">
                      {project.location || '-'}
                    </td>
                    <td className="py-4">
                      {project.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          project.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 text-navy-600 hover:text-navy-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteProjectButton id={project.id} title={project.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-navy-500 mb-4">No projects yet</p>
            <Link href="/admin/projects/new" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
