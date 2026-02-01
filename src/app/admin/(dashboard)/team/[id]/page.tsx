import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { TeamMemberForm } from '../team-member-form';

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;
  
  const teamMember = await prisma.teamMember.findUnique({
    where: { id },
  });

  if (!teamMember) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/team"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Edit Team Member</h1>
          <p className="text-gray-600 mt-1">Update {teamMember.name}&apos;s information</p>
        </div>
      </div>

      <TeamMemberForm initialData={teamMember} />
    </div>
  );
}
