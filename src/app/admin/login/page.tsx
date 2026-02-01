import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginForm } from './login-form';
import { Sun } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Login',
};

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-navy-900 mb-4">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Admin Login</h1>
          <p className="text-navy-500 mt-2">Sign in to access the admin panel</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
