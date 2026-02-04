import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — The Spot App',
  description: 'Privacy Policy for The Spot App by Sistah Sistah Foundation',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-50 to-white py-16 lg:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="heading-1 text-navy-900 mb-4">Privacy Policy</h1>
            <p className="text-body text-navy-600">
              Effective Date: February 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <div className="space-y-8 text-navy-700">
              {/* Introduction */}
              <p className="text-base leading-relaxed">
                Sistah Sistah Foundation ("we", "our", "us") operates The Spot App ("the App"). This Privacy Policy explains how we collect, use, and protect information when you use our App.
              </p>

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">1. Information We Collect</h2>
                <ul className="space-y-3 ml-6">
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>
                      <strong>Account Information:</strong> email address and password used for login.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>
                      <strong>App Usage Data:</strong> basic analytics and app performance data to help improve the App.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>
                      <strong>User Content (Optional):</strong> information you choose to enter inside the App (e.g. journal entries or wellness tracking data).
                    </span>
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">2. How We Use Information</h2>
                <p className="mb-4">We use the information collected to:</p>
                <ul className="space-y-3 ml-6">
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>Provide and operate the App</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>Allow users to create and access accounts</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>Improve performance and user experience</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>Fix bugs and monitor crashes</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>Provide support when requested</span>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">3. Data Storage and Security</h2>
                <p className="text-base leading-relaxed">
                  The Spot App uses secure cloud services (Firebase by Google) to store and protect user data. We take reasonable steps to protect information against unauthorized access.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">4. Sharing of Information</h2>
                <p className="mb-4">
                  We do not sell user data. We only share information when:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>Required by law</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-solar-600 font-semibold flex-shrink-0">•</span>
                    <span>Necessary to operate the App through trusted service providers (e.g. Firebase)</span>
                  </li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">5. Children's Privacy</h2>
                <p className="text-base leading-relaxed">
                  The Spot App is not intended for children under the age required by applicable laws without appropriate guidance. If you believe a child has provided personal information, please contact us.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">6. Account Deletion</h2>
                <p className="text-base leading-relaxed">
                  Users may request deletion of their account and associated data by contacting us using the email below.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">7. Contact Us</h2>
                <div className="space-y-2 text-base">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a 
                      href="mailto:feministspotapp@gmail.com"
                      className="text-solar-600 hover:text-solar-700 underline transition-colors"
                    >
                      feministspotapp@gmail.com
                    </a>
                  </p>
                  <p>
                    <strong>Organisation:</strong> Sistah Sistah Foundation
                  </p>
                </div>
              </div>

              {/* Back to Home Link */}
              <div className="pt-8 border-t border-navy-200">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 text-solar-600 hover:text-solar-700 font-medium transition-colors"
                >
                  <span>←</span>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
