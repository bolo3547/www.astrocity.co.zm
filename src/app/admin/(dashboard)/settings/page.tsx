import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { SettingsForm } from './settings-form';

export const metadata: Metadata = {
  title: 'Settings - Admin',
};

async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst();
    return settings;
  } catch {
    return null;
  }
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
        <p className="text-navy-500 mt-1">Manage your company information and website content</p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  );
}
