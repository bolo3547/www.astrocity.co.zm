import { Header, Footer } from '@/components/layout';
import { WhatsAppButton } from '@/components/ui';
import prisma from '@/lib/prisma';
import { parseJsonArray } from '@/lib/json-helpers';

async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst();
    return settings;
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const phones = parseJsonArray<string>(settings?.phones);

  return (
    <>
      <Header
        companyName={settings?.companyName || 'AstroCity'}
        whatsapp={settings?.whatsapp || undefined}
      />
      <main>{children}</main>
      <Footer
        companyName={settings?.companyName || 'AstroCity'}
        address={settings?.address || undefined}
        phones={phones}
        email={settings?.email || undefined}
        whatsapp={settings?.whatsapp || undefined}
        workingHours={settings?.workingHours || undefined}
      />
      {/* Floating WhatsApp Button */}
      {settings?.whatsapp && (
        <WhatsAppButton 
          phoneNumber={settings.whatsapp} 
          message={`Hello ${settings.companyName}! I'm interested in your solar and water solutions.`}
        />
      )}
    </>
  );
}
