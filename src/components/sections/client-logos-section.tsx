interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  website?: string | null;
}

interface ClientLogosSectionProps {
  logos: ClientLogo[];
}

export function ClientLogosSection({ logos }: ClientLogosSectionProps) {
  if (logos.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-navy-500 uppercase tracking-wider mb-8">
          Trusted by Leading Organizations
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {logos.map((logo) => (
            logo.website ? (
              <a
                key={logo.id}
                href={logo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                title={logo.name}
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </a>
            ) : (
              <div
                key={logo.id}
                className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                title={logo.name}
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
