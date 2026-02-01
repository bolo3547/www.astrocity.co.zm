'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface HeaderProps {
  companyName?: string;
  whatsapp?: string;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Track Quote', href: '/track-quote' },
];

export function Header({ companyName = 'AstroCity', whatsapp }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = whatsapp 
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" 
        : "bg-white/80 backdrop-blur-sm"
    )}>
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 group-hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/10">
              <Icons.sun className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-navy-900 leading-tight">{companyName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-navy-700 hover:text-navy-900 transition-colors group"
              >
                {item.name}
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-solar-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-accent-700 bg-accent-50 hover:bg-accent-100 transition-colors"
              >
                <Icons.messageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            <Link href="/contact">
              <Button className="shadow-lg shadow-navy-900/10">
                Get a Quote
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-xl p-2.5 text-navy-700 hover:bg-navy-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <Icons.x className="h-6 w-6" />
            ) : (
              <Icons.menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-1 pt-4 border-t border-gray-100">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-xl px-4 py-3 text-base font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 px-2">
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
                >
                  <Icons.messageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              )}
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-12">
                  Get a Quote
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
