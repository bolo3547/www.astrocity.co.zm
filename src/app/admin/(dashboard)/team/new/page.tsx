import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TeamMemberForm } from '../team-member-form';

export default function NewTeamMemberPage() {
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
          <h1 className="text-2xl font-bold text-navy-900">Add Team Member</h1>
          <p className="text-gray-600 mt-1">Add a new member to your team</p>
        </div>
      </div>

      <TeamMemberForm />
    </div>
  );
}
