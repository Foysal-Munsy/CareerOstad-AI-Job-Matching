import React from "react";
import { User, FileText, Search, Users, CheckCircle, Zap } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          A simple process designed to connect Candidates and Employers efficiently. Follow these steps to get started and accelerate your career or hiring journey.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Candidate Flow */}
          <div className="p-8 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 transform transition hover:scale-105">
            <h3 className="text-2xl font-semibold text-blue-800 mb-6">For Candidates</h3>
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-4">
                <User className="w-10 h-10 text-blue-600" />
                <p className="text-gray-700 font-medium">
                  Build your profile with skills, resume & goals.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-blue-600" />
                <p className="text-gray-700 font-medium">
                  Apply for jobs & get AI-powered career guidance.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-10 h-10 text-blue-600" />
                <p className="text-gray-700 font-medium">
                  Track your application status & receive notifications.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Zap className="w-10 h-10 text-blue-600" />
                <p className="text-gray-700 font-medium">
                  Get instant tips to improve your profile and interview skills.
                </p>
              </div>
            </div>
            <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>

          {/* Employer Flow */}
          <div className="p-8 rounded-2xl shadow-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 transform transition hover:scale-105">
            <h3 className="text-2xl font-semibold text-green-800 mb-6">For Employers</h3>
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-4">
                <Search className="w-10 h-10 text-green-600" />
                <p className="text-gray-700 font-medium">
                  Post jobs & showcase your company.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-green-600" />
                <p className="text-gray-700 font-medium">
                  Find the right talent & hire faster.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
                <p className="text-gray-700 font-medium">
                  Manage applications & shortlist top candidates.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Zap className="w-10 h-10 text-green-600" />
                <p className="text-gray-700 font-medium">
                  Receive AI recommendations for the best matches.
                </p>
              </div>
            </div>
            <button className="mt-8 px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition">
              Get Started
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
