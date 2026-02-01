import Link from 'next/link';
import { Button } from '@/components/ui';
import { Icons } from '@/components/icons';

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  whatsapp?: string;
}

export function HeroSection({
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  whatsapp,
}: HeroSectionProps) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-50/50 via-white to-solar-50/30" />
      
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-solar-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy-100/30 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern (very subtle) */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23102a43' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0V0zm39 0h1v40h-1V0zM0 0h40v1H0V0zm0 39h40v1H0v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative">
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-16 lg:py-24">
          <div className="max-w-5xl text-center">
            {/* Credibility Badge */}
            <div className="mb-10 inline-flex items-center gap-3 rounded-full bg-navy-900/5 backdrop-blur-sm px-5 py-2.5 animate-fade-in">
              <div className="flex items-center -space-x-1">
                <div className="w-6 h-6 rounded-full bg-solar-500 flex items-center justify-center">
                  <Icons.check className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <span className="text-sm font-medium text-navy-700">
                Trusted by 500+ Customers Across Zimbabwe
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-navy-900 mb-8 leading-[1.1] tracking-tight animate-slide-up">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-navy-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up animate-delay-100">
              {subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up animate-delay-200">
              <Link href="/contact">
                <Button size="lg" className="min-w-[220px] h-14 text-base shadow-lg shadow-navy-900/10">
                  {ctaPrimary}
                  <Icons.arrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" size="lg" className="min-w-[220px] h-14 text-base shadow-lg shadow-accent-500/20">
                    <Icons.messageCircle className="mr-2 h-5 w-5" />
                    {ctaSecondary}
                  </Button>
                </a>
              )}
            </div>

            {/* Trust Indicators - Refined */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12 pt-8 border-t border-navy-100 animate-fade-in animate-delay-300">
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-navy-900 mb-1 group-hover:text-solar-600 transition-colors">
                  500<span className="text-solar-500">+</span>
                </div>
                <div className="text-sm text-navy-500 font-medium">Projects Completed</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-navy-900 mb-1 group-hover:text-solar-600 transition-colors">
                  10<span className="text-solar-500">+</span>
                </div>
                <div className="text-sm text-navy-500 font-medium">Years Experience</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-navy-900 mb-1 group-hover:text-solar-600 transition-colors">
                  98<span className="text-solar-500">%</span>
                </div>
                <div className="text-sm text-navy-500 font-medium">Customer Satisfaction</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-navy-900 mb-1 group-hover:text-solar-600 transition-colors">
                  24<span className="text-solar-500">/7</span>
                </div>
                <div className="text-sm text-navy-500 font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-8 h-12 rounded-full border-2 border-navy-200 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-navy-300" />
        </div>
      </div>
    </section>
  );
}
