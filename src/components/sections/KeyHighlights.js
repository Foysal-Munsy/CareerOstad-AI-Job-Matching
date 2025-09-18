import React from 'react';
import { Briefcase, UserCheck, Mic, Zap } from 'lucide-react'; // lucide-react icons

const highlights = [
  {
    title: 'Smart Job Matching',
    description:
      'AI-driven system that connects you with the most relevant opportunities tailored to your skills and goals.',
    icon: <Briefcase className="w-10 h-10 text-blue-600" />,
  },
  {
    title: 'Personalized Career Advice',
    description:
      'Receive expert guidance and insights to plan your career path and unlock your full potential.',
    icon: <UserCheck className="w-10 h-10 text-green-600" />,
  },
  {
    title: 'Mock Interview Preparation',
    description:
      'Practice with AI-powered mock interviews to build confidence and improve your performance.',
    icon: <Mic className="w-10 h-10 text-purple-600" />,
  },
  {
    title: 'Fast Hiring for Employers',
    description:
      'Employers can quickly find top candidates, reducing time-to-hire with smart matching tools.',
    icon: <Zap className="w-10 h-10 text-yellow-500" />,
  },
];

const KeyHighlights = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Why <span className="text-blue-600">CareerOstad?</span>
        </h2>
        <p className="mt-4 text-gray-600 text-lg">
          Explore the key features that make CareerOstad your trusted career
          partner.
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyHighlights;
