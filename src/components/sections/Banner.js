import React from "react";

const Banner = () => {
  return (
    <section className="bg-base-100 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-7 items-center">
        {/* Left side text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content leading-tight">
            AI-Powered Job Matching &{" "}
            <span className="text-primary">Career Guidance</span>
          </h1>
          <p className="mt-4 text-lg text-neutral">
            Transform your career with intelligent job matching, personalized
            guidance, and expert insights. Connect with top employers and unlock
            your potential.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="px-6 py-3 bg-primary text-primary-content font-medium rounded-btn shadow hover:bg-primary/90 transition">
              Find Jobs
            </button>
            <button className="px-6 py-3 bg-base-300 border border-base-300 text-base-content font-medium rounded-btn shadow hover:bg-base-200 transition">
              Post a Job
            </button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex space-x-10 text-center">
            <div>
              <h3 className="text-2xl font-bold text-base-content">50K+</h3>
              <p className="text-neutral text-sm">Active Jobs</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-base-content">25K+</h3>
              <p className="text-neutral text-sm">Companies</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-base-content">100K+</h3>
              <p className="text-neutral text-sm">Candidates</p>
            </div>
          </div>
        </div>

        {/* Right side image */}
        <div className="relative">
          <img
            src="https://i.ibb.co.com/hF09BJ7C/image.png"
            alt="Career Guidance"
            width={600}
            height={450}
            className="rounded-xl shadow-lg"
          />
          <span className="absolute top-3 right-3 bg-accent text-accent-content text-sm px-3 py-1 rounded-full font-medium">
            AI Powered
          </span>
          <span className="absolute bottom-3 left-3 bg-secondary text-secondary-content text-sm px-3 py-1 rounded-full font-medium">
            95% Match Rate
          </span>
        </div>
      </div>
    </section>
  );
};

export default Banner;
