import React from "react";

const FeaturedJobs = () => {
  return (
    <section className="py-12 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-base-content sm:text-2xl">
            Featured Jobs & Top Companies
          </h2>
          <p className="mt-2 text-sm text-neutral max-w-xl mx-auto">
            Discover the latest opportunities from leading companies
          </p>
        </div>

        {/* Featured Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              title: "Senior Software Engineer",
              company: "TechCorp",
              location: "San Francisco, CA",
              type: "Full-time",
              salary: "$120K - $180K",
              featured: true,
              skills: ["React", "TypeScript", "Node.js"],
              posted: "2 days ago",
              icon: "💻",
            },
            {
              title: "Product Manager",
              company: "InnovateLabs",
              location: "New York, NY",
              type: "Full-time",
              salary: "$130K - $160K",
              featured: true,
              skills: ["Strategy", "Analytics", "Leadership"],
              posted: "1 day ago",
              icon: "📊",
            },
            {
              title: "Data Scientist",
              company: "DataFlow Inc",
              location: "Remote",
              type: "Contract",
              salary: "$90K - $130K",
              featured: false,
              skills: ["Python", "ML", "Statistics"],
              posted: "3 days ago",
              icon: "🤖",
            },
            {
              title: "UX Designer",
              company: "DesignStudio",
              location: "Dhanmondi,Dhaka",
              type: "Full-time",
              salary: "$85K - $115K",
              featured: false,
              skills: ["Figma", "User Research", "Prototyping"],
              posted: "1 day ago",
              icon: "🎨",
            },
          ].map((job, index) => {
            return (
              <div
                key={index}
                className="bg-primary/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer p-6 border border-primary/20 border-2 relative overflow-hidden group"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full bg-base-100 opacity-20"></div>

                {/* Top Section */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-content text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {job.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors duration-300">
                          {job.title}
                        </h3>
                        <p className="text-sm font-medium text-primary">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {job.featured && (
                      <span className="bg-warning text-warning-content text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Location & Salary */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-neutral"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm text-neutral">
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-success"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span className="text-sm font-bold text-base-content">
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="mb-4">
                    <span className="text-primary bg-base-100 border border-primary/20 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                      {job.type}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-base-100 text-base-content text-xs font-medium px-3 py-1 rounded-full shadow-sm border border-base-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs text-neutral">{job.posted}</span>
                  <button className="bg-primary hover:bg-primary/90 text-primary-content text-sm font-semibold py-2 px-4 rounded-btn transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Apply Now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Jobs Button */}
        <div className="text-center mt-8">
          <button className="bg-primary hover:bg-primary/90 text-primary-content font-semibold py-3 px-8 rounded-btn transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group">
            <svg
              className="w-5 h-5 group-hover:animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            View All Jobs
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <p className="mt-3 text-neutral text-sm">
            Discover thousands of opportunities from top companies
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
