import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AstroCity - Solar Water Pumps, Borehole Drilling & Solar Power Systems',
  description: 'Professional installation of solar water pumps, borehole drilling, water tanks, and complete solar power systems. Reliable solutions for homes, farms & businesses.',
  keywords: ['solar water pumps', 'borehole drilling', 'water tanks', 'solar power', 'solar panels', 'inverters'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans">{children}</body>
    </html>
  );
}
