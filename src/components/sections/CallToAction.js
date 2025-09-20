import React from "react";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-32 h-32 border border-primary-content/20 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 border border-primary-content/20 rounded-full opacity-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary-content sm:text-4xl lg:text-5xl mb-4">
            Join CareerOstad Today
          </h2>
          <p className="text-lg text-primary-content/80 sm:text-xl max-w-2xl mx-auto">
            Find Jobs Faster with AI-Powered Matching & Career Guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Benefits */}
          <div>
            <h3 className="text-xl font-bold text-primary-content mb-8">
              Why professionals choose CareerOstad:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-accent-content"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-primary-content text-sm">
                    AI-powered job matching
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-accent-content"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-primary-content text-sm">
                    Interview preparation tools
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-accent-content"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-primary-content text-sm">
                    Access to top employers
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-accent-content"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-primary-content text-sm">
                    Personalized career guidance
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-accent-content"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-primary-content text-sm">
                    Resume optimization
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-accent-content"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-primary-content text-sm">
                    Career growth tracking
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Statistics */}
          <div>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">100K+</div>
                <div className="text-primary-content text-sm">
                  Successful Placements
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">95%</div>
                <div className="text-primary-content text-sm">
                  Match Success Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">25K+</div>
                <div className="text-primary-content text-sm">
                  Partner Companies
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">3x</div>
                <div className="text-primary-content text-sm">
                  Faster Hiring
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-accent hover:bg-accent/90 text-accent-content font-semibold py-4 px-8 rounded-btn transition-colors duration-200 flex items-center gap-2 text-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Create Free Account →
            </button>
            <button className="bg-base-100 hover:bg-base-200 text-primary border-2 border-primary font-semibold py-4 px-8 rounded-btn transition-colors duration-200 flex items-center gap-2 text-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Explore Premium
            </button>
          </div>
          <p className="text-primary-content/80 text-sm mt-4">
            Join free • No credit card required • Start matching in minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
