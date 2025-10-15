"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaStar, FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSyncAlt, FaBriefcase } from "react-icons/fa";

export default function FeatureJobsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchJobs();
    }
  }, [status, session?.user?.role]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched jobs:", data.jobs?.length || 0, "jobs");
        setJobs(data.jobs || []);
      } else {
        console.error("Failed to fetch jobs:", res.status, res.statusText);
        setError("Failed to fetch jobs");
      }
    } catch (e) {
      console.error("Error fetching jobs:", e);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureJob = async (jobId, isFeatured) => {
    try {
      const res = await fetch("/api/admin/feature-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, isFeatured }),
      });
      
      if (res.ok) {
        await fetchJobs();
      } else {
        setError("Failed to update featured status");
      }
    } catch (e) {
      setError("Failed to update featured status");
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (status === "loading") {
    return <div className="p-4">Loading...</div>;
  }

  if (!session || session.user?.role !== "admin") {
    return <div className="p-4">Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Header Section */}
      <div className="mb-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <FaStar className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Feature Jobs Management
                </h1>
                <p className="mt-1 text-gray-600 text-sm">
                  Manage which jobs are featured on the homepage and job listings
                </p>
              </div>
            </div>
            <button
              onClick={fetchJobs}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaSyncAlt /> Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-xs">!</span>
          </div>
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Jobs Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-white text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-bold">All Jobs</h2>
              <p className="text-blue-100 text-sm">Manage job features and visibility</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search jobs by title or company..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
               <option value="">Select Category</option>
                <option>IT & Software</option>
                <option>Finance & Banking</option>
                <option>Marketing & Sales</option>
                <option>Human Resources</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Business</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>


        {/* Jobs List */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <FaSyncAlt className="text-white text-sm animate-spin" />
                </div>
                <p className="text-gray-600 font-medium text-sm">Loading jobs...</p>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBriefcase className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Jobs Found</h3>
              <p className="text-gray-500 text-sm">No jobs match your search criteria</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredJobs.map((job, index) => (
                <JobListItem 
                  key={job._id} 
                  job={job} 
                  index={index}
                  onFeature={() => handleFeatureJob(job._id, !job.isFeatured)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobListItem({ job, index, onFeature }) {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-blue-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-orange-500'
  ];
  
  const colorClass = colors[index % colors.length];
  
  return (
    <div className={`group relative overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
      job.isFeatured 
        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b ${colorClass}`}></div>
      
      <div className="flex items-center justify-between p-3 pl-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {job.isFeatured && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white text-xs font-medium shadow-sm">
                <FaStar className="text-xs" />
                <span>Featured</span>
              </div>
            )}
            <h3 className="text-base font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
              {job.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colorClass}`}></div>
              <span className="font-semibold text-gray-700">{job.companyName}</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{job.location}</span>
            </div>
            
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${colorClass} text-white`}>
              {job.employmentType}
            </span>
            
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {job.category}
            </span>
          </div>
        </div>
        
        <div className="ml-4">
          <button
            onClick={onFeature}
            className={`px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 flex items-center gap-1 ${
              job.isFeatured 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            <FaStar className="text-xs" />
            {job.isFeatured ? 'Remove Feature' : 'Feature Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
