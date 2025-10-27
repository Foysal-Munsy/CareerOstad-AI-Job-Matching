"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function JobsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [employmentType, setEmploymentType] = useState("All");
  const [jobLevel, setJobLevel] = useState("All");
  const [workMode, setWorkMode] = useState("All");
  const [savingIds, setSavingIds] = useState({});
  const [savedSet, setSavedSet] = useState(new Set());
  const [matchingPercentages, setMatchingPercentages] = useState({});
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs?public=true", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load jobs");
      setJobs(data.jobs || []);
      
      // Extract featured jobs
      const featured = (data.jobs || []).filter(job => job.isFeatured);
      setFeaturedJobs(featured);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // Function to calculate job matching percentages
  const calculateJobMatches = async (jobs) => {
    if (!session?.user?.email) return;
    
    setLoadingMatches(true);
    const matches = {};
    
    try {
      // Process jobs in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        
        const promises = batch.map(async (job) => {
          try {
            const response = await fetch('/api/jobs/match', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jobId: job._id,
                jobDescription: job.overview,
                jobRequirements: job.requirements || '',
                jobSkills: job.toolsTechnologies || []
              }),
            });
            
            if (response.ok) {
              const result = await response.json();
              return { jobId: job._id, percentage: result.matchingPercentage };
            }
            return { jobId: job._id, percentage: null };
          } catch (error) {
            console.error(`Error calculating match for job ${job._id}:`, error);
            return { jobId: job._id, percentage: null };
          }
        });
        
        const batchResults = await Promise.all(promises);
        batchResults.forEach(({ jobId, percentage }) => {
          if (percentage !== null) {
            matches[jobId] = percentage;
          }
        });
        
        // Update state with current batch results
        setMatchingPercentages(prev => ({ ...prev, ...matches }));
        
        // Small delay between batches to be respectful to the API
        if (i + batchSize < jobs.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error calculating job matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Calculate matches when jobs are loaded and user is logged in
  useEffect(() => {
    if (jobs.length > 0 && session?.user?.email) {
      calculateJobMatches(jobs);
    }
  }, [jobs, session?.user?.email]);

  useEffect(() => {
    async function fetchSaved() {
      if (!session?.user?.email) return;
      try {
        const res = await fetch('/api/saved-jobs', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.success) {
          const ids = new Set((data.saved || []).map(s => s.jobId));
          setSavedSet(ids);
        }
      } catch {}
    }
    fetchSaved();
  }, [session?.user?.email]);

  const handleApply = (jobId, jobTitle) => {
    if (!session?.user?.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to apply for jobs',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    // Navigate to the apply page
    router.push(`/jobs/${jobId}/apply`);
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const filteredJobs = jobs.filter(j =>
      (!q || 
        j.title.toLowerCase().includes(q) || 
        j.companyName.toLowerCase().includes(q) ||
        j.toolsTechnologies?.some(s => s.toLowerCase().includes(q)) || 
        j.tags?.some(s => s.toLowerCase().includes(q)) ||
        j.overview.toLowerCase().includes(q)
      ) &&
      (category === "All" || j.category === category) &&
      (employmentType === "All" || j.employmentType === employmentType) &&
      (jobLevel === "All" || j.jobLevel === jobLevel) &&
      (workMode === "All" || j.workMode === workMode) &&
      (location === "All" || (j.location && j.location.toLowerCase().includes(location.toLowerCase()))) &&
      (!showFeaturedOnly || j.isFeatured) &&
      j.status === "open"
    );

    // Sort by matching percentage if user is logged in and matches are available
    if (session?.user?.email && Object.keys(matchingPercentages).length > 0) {
      return filteredJobs.sort((a, b) => {
        const matchA = matchingPercentages[a._id] || 0;
        const matchB = matchingPercentages[b._id] || 0;
        return matchB - matchA; // Sort descending (highest match first)
      });
    }

    return filteredJobs;
  }, [jobs, query, category, location, employmentType, jobLevel, workMode, showFeaturedOnly, session?.user?.email, matchingPercentages]);
  const toggleSave = async (jobId) => {
    if (!session?.user?.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to save jobs',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/auth/signin';
        }
      });
      return;
    }
    setSavingIds(prev => ({ ...prev, [jobId]: true }));
    const isSaved = savedSet.has(jobId);
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-jobs?jobId=${encodeURIComponent(jobId)}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.success) {
          const next = new Set(savedSet);
          next.delete(jobId);
          setSavedSet(next);
        }
      } else {
        const res = await fetch('/api/saved-jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId }) });
        const data = await res.json();
        if (res.ok && data.success) {
          const next = new Set(savedSet);
          next.add(jobId);
          setSavedSet(next);
        }
      }
    } finally {
      setSavingIds(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const categories = [...new Set(jobs.map(j => j.category).filter(Boolean))];
  const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-2 text-white">
              Find Your Dream Job
            </h1>
            <p className="text-sm md:text-base mb-4 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover amazing career opportunities from top companies. 
              Start your journey to success today.
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                <div className="text-xs text-blue-200 font-medium mb-1">Total Jobs</div>
                <div className="text-base font-bold text-white">{jobs.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                <div className="text-xs text-blue-200 font-medium mb-1">Companies</div>
                <div className="text-base font-bold text-white">
                  {[...new Set(jobs.map(j => j.companyName))].length}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                <div className="text-xs text-blue-200 font-medium mb-1">Open Positions</div>
                <div className="text-base font-bold text-white">
                  {jobs.filter(j => j.status === "open").length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-base-100 rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="xl:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Search Jobs</span>
              </label>
              <input
                type="text"
                placeholder="Job title, company, or skills..."
                className="input input-bordered w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            
            <div>
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Location</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="All">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Employment Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Work Mode</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
              >
                <option value="All">All Modes</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-base-content/70">
              Showing {filtered.length} of {jobs.length} jobs
              {featuredJobs.length > 0 && (
                <span className="ml-2 text-warning">
                  • {featuredJobs.length} featured
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {featuredJobs.length > 0 && (
                <button
                  className={`btn btn-sm ${showFeaturedOnly ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                >
                  ⭐ Featured Only
                </button>
              )}
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setLocation("All");
                  setEmploymentType("All");
                  setJobLevel("All");
                  setWorkMode("All");
                  setShowFeaturedOnly(false);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
            <p className="text-base-content/70 mb-4">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setLocation("All");
                setEmploymentType("All");
                setJobLevel("All");
                setWorkMode("All");
              }}
            >
              View All Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((job) => (
              <div key={job._id} className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
                {/* Featured Job Top Border */}
                {job.isFeatured && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                )}
                
                <div className="p-4">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h2>
                          <p className="text-blue-600 font-semibold text-sm mt-0.5">{job.companyName}</p>
                        </div>
                        {/* Featured Badge - Positioned at top right */}
                        {job.isFeatured && (
                          <div className="flex-shrink-0">
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow">
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                              Featured
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                          {job.category}
                        </span>
                      </div>
                      
                      {/* Job Matching Percentage */}
                      {session?.user?.email && matchingPercentages[job._id] !== null && matchingPercentages[job._id] !== undefined && (
                        <div className="mb-2 p-1.5 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${
                              matchingPercentages[job._id] >= 80 ? 'text-green-600' :
                              matchingPercentages[job._id] >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {matchingPercentages[job._id]}% Match
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${
                                  matchingPercentages[job._id] >= 80 ? 'bg-green-500' :
                                  matchingPercentages[job._id] >= 60 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${matchingPercentages[job._id]}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Details - Compact */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700 truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">{job.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">{job.jobLevel}</span>
                    </div>
                  </div>

                  {/* Job Description - Shortened */}
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {job.overview}
                  </p>

                  {/* Skills Section - Compact */}
                  {job.toolsTechnologies?.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {job.toolsTechnologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                            {tech}
                          </span>
                        ))}
                        {job.toolsTechnologies.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                            +{job.toolsTechnologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer Section - Compact */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleSave(job._id)}
                        disabled={!!savingIds[job._id]}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded border transition-all ${
                          savedSet.has(job._id) 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                        title={savedSet.has(job._id) ? 'Remove from saved' : 'Save job'}
                      >
                        {savingIds[job._id] ? (
                          <div className="animate-spin rounded-full h-2.5 w-2.5 border-b border-gray-600"></div>
                        ) : (
                          <svg className="w-3 h-3" fill={savedSet.has(job._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            {savedSet.has(job._id) ? (
                              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            )}
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleApply(job._id, job.title)}
                        className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-all"
                      >
                        Apply
                      </button>
                      
                      <Link 
                        href={`/jobs/${job._id}`} 
                        className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
