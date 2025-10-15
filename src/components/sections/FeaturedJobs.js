"use client";
import React, { useState, useEffect } from "react";

const FeaturedJobs = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const res = await fetch("/api/admin/feature-jobs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setFeaturedJobs(data.featuredJobs || []);
      }
    } catch (error) {
      console.error("Error fetching featured jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getJobIcon = (category) => {
    const icons = {
      "IT & Software": "💻",
      "Finance & Banking": "💰",
      "Marketing & Sales": "📊",
      "Human Resources": "👥",
      "Healthcare": "🏥",
      "Education": "📚",
      "Engineering": "⚙️",
      "Design": "🎨",
      "Business": "💼",
      "Other": "💼"
    };
    return icons[category] || "💼";
  };

  const formatSalary = (salaryMin, salaryMax, salaryType) => {
    if (!salaryMin && !salaryMax) return "Salary not specified";
    if (salaryMin && salaryMax) {
      return `${salaryType} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`;
    }
    if (salaryMin) {
      return `${salaryType} ${salaryMin.toLocaleString()}+`;
    }
    if (salaryMax) {
      return `Up to ${salaryType} ${salaryMax.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredJobs.length === 0) {
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-lg font-semibold text-base-content mb-2">No Featured Jobs Yet</h3>
            <p className="text-neutral">Check back soon for featured opportunities</p>
          </div>
        </div>
      </section>
    );
  }

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
          {featuredJobs.slice(0, 4).map((job, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-100 relative overflow-hidden group"
              >
                {/* Premium gradient accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                {/* Featured badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    Featured
                  </div>
                </div>

                <div className="p-6">
                  {/* Header Section */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {getJobIcon(job.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-semibold text-lg">
                        {job.companyName}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">{job.category}</p>
                    </div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="text-sm font-semibold text-gray-900">{job.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Salary</p>
                        <p className="text-sm font-semibold text-gray-900">{formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Type & Skills */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                        {job.employmentType}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    {job.toolsTechnologies && job.toolsTechnologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.toolsTechnologies.slice(0, 4).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.toolsTechnologies.length > 4 && (
                          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                            +{job.toolsTechnologies.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>Quick Apply</span>
                    </div>
                    <button 
                      onClick={() => window.location.href = `/jobs/${job._id}`}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Apply Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Jobs Button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => window.location.href = '/jobs'}
            className="bg-primary hover:bg-primary/90 text-primary-content font-semibold py-3 px-8 rounded-btn transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group"
          >
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
