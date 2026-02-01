import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Plus, Users, Edit, Linkedin, Mail } from 'lucide-react';
import { DeleteTeamMemberButton } from './delete-team-member-button';

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Team Members</h1>
          <p className="text-gray-600 mt-1">
            Manage your company&apos;s team members displayed on the website
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 bg-solar-600 hover:bg-solar-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Team Member
        </Link>
      </div>

      {teamMembers.length === 0 ? (
        <div className="admin-card text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-gray-600 mb-4">
            Add your first team member to display on your website.
          </p>
          <Link
            href="/admin/team/new"
            className="inline-flex items-center gap-2 bg-solar-600 hover:bg-solar-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Team Member
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="admin-card">
              <div className="flex items-start gap-4">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-navy-100 flex items-center justify-center border-2 border-gray-200">
                    <span className="text-2xl font-bold text-navy-600">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-navy-900 truncate">{member.name}</h3>
                      <p className="text-solar-600 text-sm font-medium">{member.role}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {member.bio && (
                <p className="text-gray-600 text-sm mt-3 line-clamp-2">{member.bio}</p>
              )}

              <div className="flex items-center gap-3 mt-3 text-gray-500 text-sm">
                {member.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{member.email}</span>
                  </span>
                )}
                {member.linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Order: {member.order}</span>
                {member.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                    Featured
                  </span>
                )}
                <div className="flex-1" />
                <Link
                  href={`/admin/team/${member.id}`}
                  className="p-2 text-gray-600 hover:text-solar-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <DeleteTeamMemberButton id={member.id} name={member.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
