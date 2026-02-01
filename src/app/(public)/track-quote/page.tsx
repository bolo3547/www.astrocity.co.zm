import { Metadata } from 'next';
import { TrackQuoteForm } from './track-quote-form';

export const metadata: Metadata = {
  title: 'Track Your Quote - AstroCity',
  description: 'Check the status of your quote request and get updates from our team.',
};

export default function TrackQuotePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-solar-600 mb-4 block">
              Quote Tracking
            </span>
            <h1 className="heading-1 text-navy-900 mb-6">
              Track Your Quote Status
            </h1>
            <p className="text-body">
              Enter your reference number and email address to check the status of your quote request and view our response.
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-xl mx-auto">
            <div className="bg-navy-50 rounded-2xl p-8 lg:p-10">
              <TrackQuoteForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
