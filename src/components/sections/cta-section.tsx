import Link from 'next/link';
import { Button } from '@/components/ui';
import { Icons } from '@/components/icons';

interface CtaSectionProps {
  whatsapp?: string;
}

export function CtaSection({ whatsapp }: CtaSectionProps) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-solar-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-solar-600/5 rounded-full blur-3xl" />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-solar-300 mb-8">
            <Icons.zap className="h-4 w-4" />
            <span>Free Site Assessment</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Power Your Future?
          </h2>
          <p className="text-lg sm:text-xl text-navy-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get a free consultation and site assessment. Our experts will design the perfect solar or water solution tailored to your specific needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="min-w-[220px] bg-white text-navy-900 hover:bg-navy-50 shadow-lg shadow-black/20"
              >
                Get Your Free Quote
                <Icons.arrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg" className="min-w-[220px] shadow-lg shadow-black/20">
                  <Icons.messageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </Button>
              </a>
            )}
          </div>

          {/* Trust Points */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icons.shield className="w-6 h-6 text-solar-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Quality Guaranteed</div>
                <div className="text-sm text-navy-300">Premium equipment only</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icons.clock className="w-6 h-6 text-solar-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Fast Response</div>
                <div className="text-sm text-navy-300">Usually within 24 hours</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icons.award className="w-6 h-6 text-solar-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Expert Installation</div>
                <div className="text-sm text-navy-300">Certified technicians</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
