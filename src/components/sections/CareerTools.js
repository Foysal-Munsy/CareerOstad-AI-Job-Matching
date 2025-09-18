import React from 'react';

const CareerTools = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Career Tools & Resources
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            Enhance your career with our AI-powered tools and resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Resume Analyzer",
              description: "Get AI-powered feedback on your resume with specific improvement suggestions and ATS optimization tips.",
              icon: "📄",
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
              buttonBg: "bg-blue-600",
              buttonHover: "hover:bg-blue-700",
              features: ["ATS Compatibility Check", "Keyword Optimization", "Format Suggestions", "Industry Standards"]
            },
            {
              title: "Skill Gap Finder",
              description: "Identify missing skills for your target roles and get personalized learning recommendations.",
              icon: "🎯",
              iconBg: "bg-orange-100",
              iconColor: "text-orange-600",
              buttonBg: "bg-orange-600",
              buttonHover: "hover:bg-orange-700",
              features: ["Skill Assessment", "Gap Analysis", "Learning Paths", "Certification Guidance"]
            },
            {
              title: "Mock Interview Prep",
              description: "Practice with AI interviewer, get real-time feedback, and build confidence for any interview.",
              icon: "💬",
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
              buttonBg: "bg-green-600",
              buttonHover: "hover:bg-green-700",
              features: ["Industry-Specific Questions", "Real-time Feedback", "Performance Analytics", "Video Practice"]
            }
          ].map((tool, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer p-6 border border-gray-100">
              <div className="flex items-start mb-4">
                <div className={`w-12 h-12 ${tool.iconBg} rounded-full flex items-center justify-center mr-4`}>
                  <span className={`text-xl font-bold ${tool.iconColor}`}>{tool.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{tool.title}</h3>
                  <p className="text-xs text-gray-600 mb-4">{tool.description}</p>
                </div>
              </div>
              
              <ul className="text-xs text-gray-600 mb-6 space-y-2">
                {tool.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className={`w-3 h-3 ${tool.iconColor} mr-2`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full ${tool.buttonBg} ${tool.buttonHover} text-white text-xs font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center`}>
                Try Now →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerTools;
