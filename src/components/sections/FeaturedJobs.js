import React from 'react';

const FeaturedJobs = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Featured Jobs & Top Companies
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
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
              theme: "blue",
              icon: "💻"
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
              theme: "green",
              icon: "📊"
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
              theme: "purple",
              icon: "🤖"
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
              theme: "pink",
              icon: "🎨"
            }
          ].map((job, index) => {
            // Define color themes
            const themes = {
              blue: {
                bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
                accent: 'bg-blue-500',
                text: 'text-blue-700',
                border: 'border-blue-200',
                button: 'bg-blue-600 hover:bg-blue-700'
              },
              green: {
                bg: 'bg-gradient-to-br from-green-50 to-green-100',
                accent: 'bg-green-500',
                text: 'text-green-700',
                border: 'border-green-200',
                button: 'bg-green-600 hover:bg-green-700'
              },
              purple: {
                bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
                accent: 'bg-purple-500',
                text: 'text-purple-700',
                border: 'border-purple-200',
                button: 'bg-purple-600 hover:bg-purple-700'
              },
              pink: {
                bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
                accent: 'bg-pink-500',
                text: 'text-pink-700',
                border: 'border-pink-200',
                button: 'bg-pink-600 hover:bg-pink-700'
              }
            };
            
            const theme = themes[job.theme];
            
            return (
              <div key={index} className={`${theme.bg} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer p-6 ${theme.border} border-2 relative overflow-hidden group`}>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full bg-white opacity-20"></div>
                
                {/* Top Section */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${theme.accent} rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {job.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">{job.title}</h3>
                        <p className={`text-sm font-medium ${theme.text}`}>{job.company}</p>
                      </div>
                    </div>
                    
                    {/* Featured Badge */}
                    {job.featured && (
                      <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Location & Salary */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-sm font-bold text-gray-800">{job.salary}</span>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="mb-4">
                    <span className={`${theme.text} bg-white ${theme.border} border text-sm font-medium px-3 py-1 rounded-full shadow-sm`}>
                      {job.type}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{job.posted}</span>
                  <button className={`${theme.button} text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105`}>
                    Apply Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Jobs Button */}
        <div className="text-center mt-8">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group">
            <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            View All Jobs
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <p className="mt-3 text-gray-500 text-sm">Discover thousands of opportunities from top companies</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
