import Link from 'next/link';
import { Icons } from '@/components/icons';

interface FooterProps {
  companyName?: string;
  address?: string;
  phones?: string[];
  email?: string;
  whatsapp?: string;
  workingHours?: string;
}

const navigation = {
  services: [
    { name: 'Solar Water Pumps', href: '/services#solar-water-pumps' },
    { name: 'Borehole Drilling', href: '/services#borehole-drilling' },
    { name: 'Water Tanks & Stands', href: '/services#water-tanks' },
    { name: 'Solar Power Systems', href: '/services#solar-power-systems' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
  ],
};

export function Footer({
  companyName = 'AstroCity',
  address = 'Nangoma, Mumbwa District, Central Province, Zambia',
  phones = ['+260 97 123 4567', '+260 96 123 4567'],
  email = 'info@astrocity.co.zm',
  whatsapp = '+260971234567',
  workingHours = 'Mon - Sat: 7:00 AM - 6:00 PM',
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <footer className="bg-navy-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand - Takes more space */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white group-hover:bg-solar-100 transition-colors shadow-lg">
                <Icons.sun className="h-7 w-7 text-navy-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">{companyName}</span>
                <span className="text-xs text-navy-400 uppercase tracking-wider">Solar & Water Solutions</span>
              </div>
            </Link>
            <p className="text-navy-300 leading-relaxed mb-8 max-w-sm">
              Professional solar water pumping, borehole drilling, and solar power solutions for homes, farms, and businesses across Zimbabwe.
            </p>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/20"
              >
                <Icons.messageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            )}
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
              Services
            </h3>
            <ul className="space-y-4">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-navy-300 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <Icons.chevronRight className="h-3 w-3 text-solar-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-navy-300 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <Icons.chevronRight className="h-3 w-3 text-solar-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-5">
              {address && (
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                    <Icons.mapPin className="h-5 w-5 text-solar-400" />
                  </div>
                  <span className="text-sm text-navy-300 pt-2">{address}</span>
                </li>
              )}
              {phones.length > 0 && (
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                    <Icons.phone className="h-5 w-5 text-solar-400" />
                  </div>
                  <div className="flex flex-col gap-1 pt-2">
                    {phones.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                        className="text-sm text-navy-300 hover:text-white transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                    <Icons.mail className="h-5 w-5 text-solar-400" />
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-navy-300 hover:text-white transition-colors pt-2"
                  >
                    {email}
                  </a>
                </li>
              )}
              {workingHours && (
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                    <Icons.clock className="h-5 w-5 text-solar-400" />
                  </div>
                  <span className="text-sm text-navy-300 pt-2">{workingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-800">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-navy-400">
              © {currentYear} {companyName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-navy-500">Powered by Clean Energy</span>
              <Icons.sun className="h-5 w-5 text-solar-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
