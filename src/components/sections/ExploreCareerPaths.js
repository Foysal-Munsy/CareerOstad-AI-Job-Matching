import React from "react";

const ExploreCareerPaths = () => {
  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Explore Career Paths with AI Guidance
          </h2>
          <p className="mt-3 text-sm text-neutral max-w-2xl mx-auto leading-relaxed">
            Discover trending industries and get personalized recommendations
            based on your skills and interests
          </p>
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Technology & IT",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 3C2 2.44772 2.44772 2 3 2H5C5.55228 2 6 2.44772 6 3V21C6 21.5523 5.55228 22 5 22H3C2.44772 22 2 21.5523 2 21V3Z" />
                  <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V21C14 21.5523 13.5523 22 13 22H11C10.4477 22 10 21.5523 10 21V3Z" />
                  <path d="M18 3C18 2.44772 18.4477 2 19 2H21C21.5523 2 22 2.44772 22 3V21C22 21.5523 21.5523 22 21 22H19C18.4477 22 18 21.5523 18 21V3Z" />
                </svg>
              ),
              jobs: "15,000+ jobs",
              growth: "+18% growth",
              description:
                "Software development, cybersecurity, data science, and more",
              iconBg: "bg-primary/20",
              iconColor: "text-primary",
            },
            {
              name: "Finance & Banking",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ),
              jobs: "8,500+ jobs",
              growth: "+12% growth",
              description:
                "Investment banking, fintech, risk management, and more",
              iconBg: "bg-secondary/20",
              iconColor: "text-secondary",
            },
            {
              name: "Healthcare & Medical",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ),
              jobs: "12,000+ jobs",
              growth: "+22% growth",
              description:
                "Medical technology, pharmaceuticals, biotechnology, and more",
              iconBg: "bg-error/20",
              iconColor: "text-error",
            },
            {
              name: "Engineering",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6 12,15.6z" />
                </svg>
              ),
              jobs: "9,200+ jobs",
              growth: "+15% growth",
              description:
                "Civil, mechanical, electrical, and software engineering",
              iconBg: "bg-accent/20",
              iconColor: "text-accent",
            },
            {
              name: "Business & Consulting",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                </svg>
              ),
              jobs: "11,800+ jobs",
              growth: "+14% growth",
              description:
                "Management consulting, strategy, operations, and more",
              iconBg: "bg-warning/20",
              iconColor: "text-warning",
            },
            {
              name: "Creative & Design",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
              jobs: "6,500+ jobs",
              growth: "+20% growth",
              description: "Graphic design, UX/UI, digital marketing, and more",
              iconBg: "bg-success/20",
              iconColor: "text-success",
            },
          ].map((industry, index) => (
            <div
              key={index}
              className="bg-base-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer p-6 border border-base-300 group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-base-100 opacity-10"></div>
              <div className="flex flex-col h-full relative z-10">
                {/* Icon and Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-3 rounded-lg ${industry.iconBg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                  >
                    <div className={industry.iconColor}>{industry.icon}</div>
                  </div>
                  <h3 className="text-base font-semibold text-base-content group-hover:text-primary transition-colors duration-300">
                    {industry.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral mb-4 leading-relaxed flex-grow">
                  {industry.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3 text-neutral"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-base-content">
                      {industry.jobs}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3 text-success"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-xs font-medium text-success-content bg-success px-2 py-1 rounded-full">
                      {industry.growth}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="#"
                  className="inline-flex items-center justify-center text-base-content hover:text-primary-content font-medium text-xs py-2 px-3 rounded-btn border border-base-300 hover:border-primary bg-base-100 hover:bg-primary transition-all duration-300 group/btn shadow-sm"
                >
                  Explore Jobs
                  <svg
                    className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-Action Button */}
        <div className="text-center mt-12">
          <button className="bg-primary hover:bg-primary/90 text-primary-content font-semibold py-3 px-6 rounded-btn transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group text-sm">
            <svg
              className="w-4 h-4 group-hover:animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Get Personalized Career Guidance
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <p className="mt-3 text-neutral text-xs">
            Our AI analyzes your skills and preferences to recommend the best
            career paths
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExploreCareerPaths;
