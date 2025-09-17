// sections/Banner.js
import React from 'react';
import Image from 'next/image';

const Banner = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            AI-Powered Job Matching &{' '}
            <span className="text-blue-600">Career Guidance</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Transform your career with intelligent job matching, personalized
            guidance, and expert insights. Connect with top employers and unlock
            your potential.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
              Find Jobs
            </button>
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-100 transition">
              Post a Job
            </button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex space-x-10 text-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">50K+</h3>
              <p className="text-gray-500 text-sm">Active Jobs</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">25K+</h3>
              <p className="text-gray-500 text-sm">Companies</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">100K+</h3>
              <p className="text-gray-500 text-sm">Candidates</p>
            </div>
          </div>
        </div>

        {/* Right side image */}
        <div className="relative">
          <Image
            src="/banner-image.png" // তোমার দেওয়া image রাখবে public folder এ
            alt="Career Guidance"
            width={600}
            height={400}
            className="rounded-xl shadow-lg"
          />
          <span className="absolute top-3 right-3 bg-yellow-400 text-white text-sm px-3 py-1 rounded-full font-medium">
            AI Powered
          </span>
          <span className="absolute bottom-3 left-3 bg-green-600 text-white text-sm px-3 py-1 rounded-full font-medium">
            95% Match Rate
          </span>
        </div>
      </div>
    </section>
  );
};

export default Banner;
