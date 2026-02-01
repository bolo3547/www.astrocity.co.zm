import { Icons } from '@/components/icons';

const features = [
  {
    icon: Icons.shield,
    title: 'Quality Guaranteed',
    description: 'We use only premium equipment from trusted manufacturers, backed by comprehensive warranties.',
  },
  {
    icon: Icons.users,
    title: 'Expert Team',
    description: 'Our certified technicians have years of experience in solar and water systems installation.',
  },
  {
    icon: Icons.wrench,
    title: 'Full Service',
    description: 'From site assessment to installation and maintenance, we handle every aspect of your project.',
  },
  {
    icon: Icons.award,
    title: 'Proven Track Record',
    description: 'Hundreds of successful installations for homes, farms, and businesses across the region.',
  },
];

const applications = [
  {
    icon: Icons.home,
    title: 'Residential',
    description: 'Home water supply & solar power',
  },
  {
    icon: Icons.tractor,
    title: 'Agricultural',
    description: 'Farm irrigation & livestock',
  },
  {
    icon: Icons.building,
    title: 'Commercial',
    description: 'Business & industrial solutions',
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-solar-600 mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-6 leading-tight">
              Engineering Excellence,<br />Reliable Results
            </h2>
            <p className="text-lg text-navy-600 leading-relaxed mb-12">
              We combine technical expertise with a commitment to quality, delivering solar and water solutions that perform reliably for years. Our approach focuses on understanding your specific needs and providing tailored solutions.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-solar-100 flex items-center justify-center flex-shrink-0 group-hover:bg-solar-500 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-solar-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-navy-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Applications Card */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-br from-solar-100 to-navy-100 rounded-3xl opacity-50 blur-xl" />
            
            <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center">
                  <Icons.zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900">
                  Solutions For Every Application
                </h3>
              </div>

              <div className="space-y-4">
                {applications.map((app, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-5 p-5 rounded-2xl bg-gray-50 hover:bg-solar-50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                      <app.icon className="w-8 h-8 text-navy-700 group-hover:text-solar-600 transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 text-lg mb-0.5">
                        {app.title}
                      </h4>
                      <p className="text-sm text-navy-600">
                        {app.description}
                      </p>
                    </div>
                    <Icons.chevronRight className="w-5 h-5 text-navy-300 ml-auto group-hover:text-solar-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-navy-900">5+</div>
                    <div className="text-xs text-navy-500 font-medium">Year Warranty</div>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <div className="text-3xl font-bold text-navy-900">100%</div>
                    <div className="text-xs text-navy-500 font-medium">Licensed Team</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-navy-900">Free</div>
                    <div className="text-xs text-navy-500 font-medium">Site Survey</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
