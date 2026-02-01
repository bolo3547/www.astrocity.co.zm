import { Metadata } from 'next';
import { ServiceForm } from '../service-form';

export const metadata: Metadata = {
  title: 'New Service - Admin',
};

export default function NewServicePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">New Service</h1>
        <p className="text-navy-500 mt-1">Add a new service to your website</p>
      </div>

      <ServiceForm />
    </div>
  );
}
