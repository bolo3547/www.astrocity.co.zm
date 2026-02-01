import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DeleteServiceButton } from './delete-service-button';

export const metadata: Metadata = {
  title: 'Services - Admin',
};

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    return services;
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Services</h1>
          <p className="text-navy-500 mt-1">Manage your service offerings</p>
        </div>
        <Link href="/admin/services/new" className="admin-btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Link>
      </div>

      <div className="admin-card">
        {services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Service
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Slug
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Order
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
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-navy-900">{service.title}</p>
                        <p className="text-sm text-navy-500 line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-navy-600">{service.slug}</td>
                    <td className="py-4 text-sm text-navy-600">{service.order}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          service.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 text-navy-600 hover:text-navy-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteServiceButton id={service.id} title={service.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-navy-500 mb-4">No services yet</p>
            <Link href="/admin/services/new" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
