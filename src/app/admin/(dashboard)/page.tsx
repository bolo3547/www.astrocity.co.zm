import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { FileText, Briefcase, FolderOpen, TrendingUp, Users, MessageSquare, Newspaper, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

async function getStats() {
  try {
    const [
      quotes,
      services,
      projects,
      teamMembers,
      testimonials,
      blogPosts,
      faqs,
      recentQuotes,
    ] = await Promise.all([
      prisma.quote.count(),
      prisma.service.count(),
      prisma.project.count(),
      prisma.teamMember.count(),
      prisma.testimonial.count(),
      prisma.blogPost.count(),
      prisma.fAQ.count(),
      prisma.quote.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const newQuotes = await prisma.quote.count({
      where: { status: 'new' },
    });

    return { 
      quotes, 
      services, 
      projects, 
      teamMembers,
      testimonials,
      blogPosts,
      faqs,
      newQuotes, 
      recentQuotes 
    };
  } catch {
    return { 
      quotes: 0, 
      services: 0, 
      projects: 0, 
      teamMembers: 0,
      testimonials: 0,
      blogPosts: 0,
      faqs: 0,
      newQuotes: 0, 
      recentQuotes: [] 
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: 'Total Quotes',
      value: stats.quotes,
      icon: FileText,
      href: '/admin/quotes',
      color: 'bg-blue-500',
    },
    {
      title: 'New Quotes',
      value: stats.newQuotes,
      icon: TrendingUp,
      href: '/admin/quotes?status=new',
      color: 'bg-green-500',
    },
    {
      title: 'Services',
      value: stats.services,
      icon: Briefcase,
      href: '/admin/services',
      color: 'bg-purple-500',
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: FolderOpen,
      href: '/admin/projects',
      color: 'bg-orange-500',
    },
    {
      title: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      href: '/admin/team',
      color: 'bg-indigo-500',
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: MessageSquare,
      href: '/admin/testimonials',
      color: 'bg-pink-500',
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: Newspaper,
      href: '/admin/blog',
      color: 'bg-teal-500',
    },
    {
      title: 'FAQs',
      value: stats.faqs,
      icon: HelpCircle,
      href: '/admin/faqs',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-navy-500 mt-1">Welcome to your admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="admin-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-500">{card.title}</p>
                <p className="text-3xl font-bold text-navy-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Quotes */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-navy-900">Recent Quote Requests</h2>
          <Link
            href="/admin/quotes"
            className="text-sm text-solar-600 hover:text-solar-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {stats.recentQuotes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Service
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-navy-500 uppercase tracking-wider pb-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-navy-900">{quote.name}</p>
                        <p className="text-sm text-navy-500">{quote.email}</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-navy-600">
                      {quote.service || '-'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          quote.status === 'new'
                            ? 'bg-green-100 text-green-700'
                            : quote.status === 'contacted'
                            ? 'bg-blue-100 text-blue-700'
                            : quote.status === 'completed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-navy-500">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-navy-500 py-8">No quote requests yet</p>
        )}
      </div>
    </div>
  );
}
