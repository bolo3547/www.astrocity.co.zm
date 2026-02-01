'use client';

import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  company?: string | null;
  role?: string | null;
  content: string;
  rating: number;
  photo?: string | null;
  projectType?: string | null;
  location?: string | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-navy-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-solar-400 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-navy-300 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what our satisfied customers have to say about our solar and water solutions.
          </p>
        </div>

        <div className={`grid gap-8 ${
          testimonials.length === 1 ? 'max-w-xl mx-auto' :
          testimonials.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
          'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-solar-400/50 mb-4" />

              {/* Content */}
              <p className="text-navy-200 text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-navy-600'
                    }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-solar-400/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-solar-600/20 flex items-center justify-center border-2 border-solar-400/30">
                    <span className="text-xl font-bold text-solar-400">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-navy-400">
                      {testimonial.role}{testimonial.role && testimonial.company ? ', ' : ''}{testimonial.company}
                    </p>
                  )}
                  {testimonial.location && (
                    <p className="text-xs text-navy-500 mt-0.5">{testimonial.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
