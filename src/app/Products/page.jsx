export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="navbar bg-primary shadow-lg">
        <div className="container mx-auto">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl font-bold text-white hover:text-white">CareerOstad</a>
          </div>
          <div className="flex-none">
            <a href="/" className="btn btn-ghost text-white hover:text-white">
              Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="hero bg-base-200 rounded-lg mb-8">
          <div className="hero-content text-center py-12">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold text-primary">Terms & Conditions</h1>
              <p className="py-6 text-base-content/70">
                Please read these terms carefully before using CareerOstad services
              </p>
              <div className="badge badge-primary badge-lg">Last Updated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Section 1: Acceptance of Terms */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">1</span>
                Acceptance of Terms
              </h2>
              <div className="divider"></div>
              <p className="text-base-content leading-relaxed">
                By accessing and using CareerOstad ("the Platform"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <div className="alert bg-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>Your continued use of the platform constitutes acceptance of any updates to these terms.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Service Description */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">2</span>
                Service Description
              </h2>
              <div className="divider"></div>
              <p className="text-base-content leading-relaxed mb-4">
                CareerOstad is an AI-powered job matching and career guidance portal that provides:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-primary">For Job Seekers</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>AI-driven job matching</li>
                      <li>Personalized career guidance</li>
                      <li>Mock interview simulations</li>
                      <li>Profile and resume management</li>
                      <li>Application tracking</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-primary">For Employers</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Candidate matching algorithms</li>
                      <li>Job posting management</li>
                      <li>Applicant screening tools</li>
                      <li>Analytics and reporting</li>
                      <li>Premium recruitment features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: User Accounts and Responsibilities */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">3</span>
                User Accounts and Responsibilities
              </h2>
              <div className="divider"></div>
              <div className="space-y-4">
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="radio" name="account-accordion" defaultChecked />
                  <div className="collapse-title text-lg font-medium">Account Registration</div>
                  <div className="collapse-content">
                    <p>
                      Users must provide accurate, current, and complete information during registration. You are
                      responsible for maintaining the confidentiality of your account credentials.
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="radio" name="account-accordion" />
                  <div className="collapse-title text-lg font-medium">Prohibited Activities</div>
                  <div className="collapse-content">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Creating fake profiles or providing false information</li>
                      <li>Harassment or discrimination against other users</li>
                      <li>Posting inappropriate or offensive content</li>
                      <li>Attempting to circumvent platform security measures</li>
                      <li>Using automated tools to scrape data</li>
                    </ul>
                  </div>
                </div>
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="radio" name="account-accordion" />
                  <div className="collapse-title text-lg font-medium">Content Guidelines</div>
                  <div className="collapse-content">
                    <p>
                      All content uploaded must be professional, accurate, and comply with applicable laws. CareerOstad
                      reserves the right to remove content that violates these guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: AI Services and Limitations */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">4</span>
                AI Services and Limitations
              </h2>
              <div className="divider"></div>
              <div className="alert alert-warning mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>
                  AI-generated advice and matches are suggestions only and should not be considered as professional
                  career counseling.
                </span>
              </div>
              <div className="space-y-3">
                <p className="text-base-content leading-relaxed">
                  Our AI algorithms analyze your profile, skills, and preferences to provide job matches and career
                  guidance. However:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AI recommendations are based on available data and may not account for all factors</li>
                  <li>Users should exercise their own judgment when making career decisions</li>
                  <li>We continuously improve our algorithms but cannot guarantee perfect matches</li>
                  <li>Mock interview AI responses are for practice purposes only</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Payment Terms */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">5</span>
                Payment Terms
              </h2>
              <div className="divider"></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Premium Features</h3>
                  <p className="text-base-content leading-relaxed mb-3">
                    CareerOstad offers both free and premium services. Premium features include advanced AI matching,
                    priority support, and enhanced analytics.
                  </p>
                  <div className="badge badge-outline">Powered by Stripe</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Billing Policy</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Subscriptions are billed monthly or annually</li>
                    <li>All payments are processed securely through Stripe</li>
                    <li>Refunds are subject to our refund policy</li>
                    <li>Prices may change with 30 days notice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Privacy and Data Protection */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">6</span>
                Privacy and Data Protection
              </h2>
              <div className="divider"></div>
              <div className="alert  mb-4  bg-success/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
                <span>Your privacy is important to us. Please review our Privacy Policy for detailed information.</span>
              </div>
              <p className="text-base-content leading-relaxed">
                We collect and process personal data to provide our services, including profile information, job
                preferences, and usage analytics. Data is used to improve AI matching algorithms and provide
                personalized experiences. We implement industry-standard security measures to protect your information
                and comply with applicable data protection regulations.
              </p>
            </div>
          </div>

          {/* Section 7: Intellectual Property */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">7</span>
                Intellectual Property
              </h2>
              <div className="divider"></div>
              <p className="text-base-content leading-relaxed">
                The CareerOstad platform, including its AI algorithms, design, content, and features, is protected by
                intellectual property laws. Users retain ownership of their uploaded content but grant CareerOstad a
                license to use it for providing services. Unauthorized reproduction or distribution of platform content
                is prohibited.
              </p>
            </div>
          </div>

          {/* Section 8: Limitation of Liability */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">8</span>
                Limitation of Liability
              </h2>
              <div className="divider"></div>
              <div className="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Important Legal Notice</h3>
                  <div className="text-xs">
                    CareerOstad provides services "as is" without warranties. We are not liable for employment outcomes,
                    career decisions, or indirect damages resulting from platform use.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 9: Termination */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center">
                <span className="badge badge-primary badge-lg mr-3">9</span>
                Account Termination
              </h2>
              <div className="divider"></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card bg-error/10 border border-error/20">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-error">By CareerOstad</h3>
                    <p className="text-sm">
                      We may terminate accounts for violations of these terms, fraudulent activity, or at our discretion
                      with notice.
                    </p>
                  </div>
                </div>
                <div className="card bg-success/10 border border-success/20">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-success">By User</h3>
                    <p className="text-sm">
                      Users may terminate their accounts at any time through account settings or by contacting support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 10: Contact Information */}
          <div className="card bg-primary text-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl flex items-center text-white">
               
                Contact Information
              </h2>
              <div className="divider divider-white"></div>
              <p className="leading-relaxed mb-4">
                For questions about these Terms and Conditions or our services, please contact us:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">📧</div>
                  <div className="font-semibold">Email</div>
                  <div className="text-sm opacity-90">legal@careerostd.com</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📞</div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-sm opacity-90">+1 (555) 123-4567</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="font-semibold">Address</div>
                  <div className="text-sm opacity-90">123 Career St, Tech City</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded-lg mt-12">
          <nav className="grid grid-flow-col gap-4">
            <a className="link link-hover">Privacy Policy</a>
            <a className="link link-hover">Cookie Policy</a>
            <a className="link link-hover">Support</a>
            <a className="link link-hover">About Us</a>
          </nav>
          <aside>
            <p className="font-bold">
              CareerOstad
              <br />
              AI-Powered Career Solutions Since 2024
            </p>
            <p>Copyright © 2024 - All rights reserved</p>
          </aside>
        </footer>
      </div>
    </div>
  )
}
