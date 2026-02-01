import { Metadata } from 'next';
import { ProjectForm } from '../project-form';

export const metadata: Metadata = {
  title: 'New Project - Admin',
};

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">New Project</h1>
        <p className="text-navy-500 mt-1">Add a new project to your gallery</p>
      </div>

      <ProjectForm />
    </div>
  );
}
