"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [employmentType, setEmploymentType] = useState("All");
  const [jobLevel, setJobLevel] = useState("All");
  const [workMode, setWorkMode] = useState("All");
  const [applying, setApplying] = useState(false);
  const [savingIds, setSavingIds] = useState({});
  const [savedSet, setSavedSet] = useState(new Set());

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs?public=true", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load jobs");
      setJobs(data.jobs || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleApply = async (jobId, jobTitle) => {
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
          window.location.href = '/auth/signin';
        }
      });
      return;
    }

    setApplying(true);
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: jobId,
          coverLetter: `I am interested in applying for the ${jobTitle} position. I believe my skills and experience make me a strong candidate for this role.`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: `Your application for ${jobTitle} has been submitted successfully.`,
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Application Failed',
          text: result.error || 'Failed to submit application. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setApplying(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return jobs.filter(j =>
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
      j.status === "open"
    );
  }, [jobs, query, category, location, employmentType, jobLevel, workMode]);
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
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover amazing career opportunities from top companies. 
              Start your journey to success today.
            </p>
            <div className="stats stats-horizontal bg-primary-content/10 backdrop-blur-sm">
              <div className="stat">
                <div className="stat-title text-primary-content/70">Total Jobs</div>
                <div className="stat-value text-primary-content">{jobs.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-primary-content/70">Companies</div>
                <div className="stat-value text-primary-content">
                  {[...new Set(jobs.map(j => j.companyName))].length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title text-primary-content/70">Open Positions</div>
                <div className="stat-value text-primary-content">
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
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setLocation("All");
                  setEmploymentType("All");
                  setJobLevel("All");
                  setWorkMode("All");
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((job) => (
              <div key={job._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="card-title text-lg mb-2 line-clamp-2">{job.title}</h2>
                      <p className="text-primary font-semibold">{job.companyName}</p>
                    </div>
                    <div className="badge badge-primary badge-sm">{job.category}</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{job.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{job.jobLevel}</span>
                    </div>
                  </div>

                  <p className="text-sm text-base-content/80 line-clamp-3 mb-4">
                    {job.overview}
                  </p>

                  {job.toolsTechnologies?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {job.toolsTechnologies.slice(0, 4).map((tech, idx) => (
                          <span key={idx} className="badge badge-outline badge-sm">
                            {tech}
                          </span>
                        ))}
                        {job.toolsTechnologies.length > 4 && (
                          <span className="badge badge-outline badge-sm">
                            +{job.toolsTechnologies.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {job.salaryMin && job.salaryMax && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-success">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.salaryType}
                          {job.isNegotiable && <span className="text-xs"> (Negotiable)</span>}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-base-content/50">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSave(job._id)}
                        disabled={!!savingIds[job._id]}
                        className={`btn btn-ghost btn-sm ${savedSet.has(job._id) ? 'text-warning' : ''}`}
                        title={savedSet.has(job._id) ? 'Unsave' : 'Save job'}
                      >
                        {savingIds[job._id] ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : savedSet.has(job._id) ? '★ Saved' : '☆ Save'}
                      </button>
                      <button
                        onClick={() => handleApply(job._id, job.title)}
                        disabled={applying}
                        className="btn btn-success btn-sm"
                      >
                        {applying ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Applying...
                          </>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                      <Link href={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                        View Details
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
