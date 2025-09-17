import React from 'react';

const SuccessStories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Success Stories
          </h2>
          <p className="mt-3 text-base text-gray-600 max-w-3xl mx-auto">
            Real people, real results. See how CareerOstad has transformed careers and streamlined hiring for thousands of professionals and companies.
          </p>
        </div>

        {/* Candidate Success Stories */}
        <div className="mb-16">
          <h3 className="text-lg font-bold text-gray-900 text-center mb-8">
            Candidate Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                avatar: "👩‍💻",
                rating: 5,
                quote: "CareerOstad's AI matching helped me find my dream job at Google. The mock interview prep was invaluable - I felt confident and prepared.",
                previousRole: "Junior Developer",
                timeToHire: "3 weeks",
                salaryIncrease: "+65%"
              },
              {
                name: "Marcus Rodriguez",
                role: "Product Manager at Spotify",
                avatar: "👨‍💼",
                rating: 5,
                quote: "The personalized career guidance helped me transition from engineering to product management. The skill gap analysis was spot-on.",
                previousRole: "Senior Engineer",
                timeToHire: "5 weeks",
                salaryIncrease: "+40%"
              },
              {
                name: "Priya Patel",
                role: "Data Scientist at Netflix",
                avatar: "👩‍🔬",
                rating: 5,
                quote: "Found my perfect role through AI-powered matching. The resume analyzer helped me optimize my profile and land interviews at top companies.",
                previousRole: "Data Analyst",
                timeToHire: "4 weeks",
                salaryIncrease: "+55%"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{story.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{story.name}</h4>
                    <p className="text-blue-600 text-sm font-medium">{story.role}</p>
                  </div>
                </div>
                
                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-6 text-sm italic relative">
                  <span className="text-4xl text-gray-300 absolute -top-2 -left-2">&ldquo;</span>
                  {story.quote}
                </blockquote>

                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Previous Role:</span> {story.previousRole}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Time to Hire: {story.timeToHire}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Salary Increase: {story.salaryIncrease}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employer Success Stories */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-8">
            Employer Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                company: "TechStart Inc.",
                industry: "Technology",
                icon: "🚀",
                quote: "CareerOstad helped us find qualified developers 3x faster. The AI screening saves us hours of manual review.",
                metric: "60% faster hiring",
                attribution: "Alex Thompson, CTO"
              },
              {
                company: "HealthCorp",
                industry: "Healthcare",
                icon: "🏥",
                quote: "The quality of candidates is exceptional. We've reduced our time-to-hire and improved retention rates significantly.",
                metric: "40% better retention",
                attribution: "Dr. Emily Johnson, VP"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{story.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{story.company}</h4>
                    <p className="text-gray-600 text-sm">{story.industry}</p>
                  </div>
                </div>

                <blockquote className="text-gray-700 mb-6 text-sm italic relative">
                  <span className="text-4xl text-gray-300 absolute -top-2 -left-2">&ldquo;</span>
                  {story.quote}
                </blockquote>

                <div className="flex items-center justify-between">
                  <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">
                    {story.metric}
                  </span>
                  <span className="text-xs text-gray-600">
                    - {story.attribution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
