"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaBriefcase,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaTrash,
  FaTags,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

export default function AdminJobsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchJobs();
    }
  }, [status, session?.user?.role]);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (e) {
      setError(e.message || "Could not load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm("Delete this job? This cannot be undone.");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data?.success !== true) {
        throw new Error(data?.error || "Failed to delete job");
      }
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (e) {
      setError(e.message || "Failed to delete job");
    }
  };

  const toggleStatus = async (job) => {
    const nextStatus = job.status === "open" ? "closed" : "open";
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // required fields for PUT, keep existing values and just change status
          title: job.title,
          category: job.category,
          employmentType: job.employmentType,
          jobLevel: job.jobLevel,
          overview: job.overview,
          requirements: job.requirements,
          preferredQualifications: job.preferredQualifications,
          toolsTechnologies: job.toolsTechnologies || [],
          location: job.location,
          workMode: job.workMode,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          salaryType: job.salaryType,
          isNegotiable: job.isNegotiable,
          perksBenefits: job.perksBenefits,
          applicationDeadline: job.applicationDeadline,
          howToApply: job.howToApply,
          applicationUrl: job.applicationUrl,
          applicationEmail: job.applicationEmail,
          numberOfVacancies: job.numberOfVacancies,
          experienceRequired: job.experienceRequired,
          educationRequired: job.educationRequired,
          genderPreference: job.genderPreference,
          ageLimit: job.ageLimit,
          tags: job.tags || [],
          companyWebsite: job.companyWebsite,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success !== true) {
        throw new Error(data?.error || "Failed to update status");
      }
      setJobs((prev) => prev.map((j) => (j._id === job._id ? data.job : j)));
    } catch (e) {
      setError(e.message || "Failed to update status");
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => j?.category && set.add(j.category));
    return Array.from(set).sort();
  }, [jobs]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const open = jobs.filter((j) => j.status === "open").length;
    const closed = jobs.filter((j) => j.status === "closed").length;
    const featured = jobs.filter((j) => j.isFeatured).length;
    return { total, open, closed, featured };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch = !t
        || job.title?.toLowerCase().includes(t)
        || job.companyName?.toLowerCase().includes(t)
        || job.category?.toLowerCase().includes(t);
      const matchesCategory = !selectedCategory || job.category === selectedCategory;
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [jobs, searchTerm, selectedCategory, statusFilter]);

  if (status === "loading") {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="p-4">
        <div className="alert alert-error">
          <span>Unauthorized - Admin access required</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <FaBriefcase className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All Jobs Management
              </h1>
              <p className="mt-1 text-gray-600 text-sm">Manage all job posts across the platform</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Jobs" value={loading ? "-" : stats.total} gradient="from-slate-500 to-slate-700" />
        <StatCard title="Open" value={loading ? "-" : stats.open} gradient="from-emerald-500 to-teal-600" />
        <StatCard title="Closed" value={loading ? "-" : stats.closed} gradient="from-amber-500 to-orange-600" />
        <StatCard title="Featured" value={loading ? "-" : stats.featured} gradient="from-sky-500 to-indigo-600" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaSearch className="text-white text-xs" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Search & Filter</h2>
              <p className="text-gray-500 text-xs">Find jobs quickly using filters</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by title, company or category..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-sm md:w-56"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-sm md:w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <Link
              href="/dashboard/admin/feature-jobs"
              className="px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaTags /> Manage Featured
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Data */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-white text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-bold">All Jobs</h2>
              <p className="text-blue-100 text-xs">Showing {loading ? '-' : filteredJobs.length} of {loading ? '-' : jobs.length}</p>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="p-4 md:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-md"></span>
              <span className="ml-2 text-sm text-gray-600">Loading jobs...</span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No jobs found</div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job, index) => (
                <JobCard key={job._id} job={job} index={index} onToggle={() => toggleStatus(job)} onDelete={() => handleDelete(job._id)} />
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden md:block">
          <table className="table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                    <span className="ml-2">Loading jobs...</span>
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-base-content/50">No jobs found</td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {job.companyLogo ? (
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-md">
                              <img src={job.companyLogo} alt={job.companyName || "Company"} />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-md w-10">
                              <span className="text-xs">{job.title?.charAt(0)?.toUpperCase() || "J"}</span>
                            </div>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium break-words max-w-[300px]">{job.title}</div>
                          <div className="text-xs text-base-content/60 flex items-center gap-1 flex-wrap">
                            <span className="badge badge-ghost badge-xs">{job.employmentType}</span>
                            <span className="badge badge-ghost badge-xs">{job.jobLevel}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{job.companyName || "-"}</td>
                    <td>
                      <span className="badge badge-outline">{job.category || "-"}</span>
                    </td>
                    <td>
                      <span className={`badge badge-sm ${job.status === "open" ? "badge-success" : "badge-warning"}`}>
                        {job.status || "open"}
                      </span>
                      {job.isFeatured && (
                        <span className="badge badge-info badge-sm ml-2">Featured</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/jobs/${job._id}`} className="btn btn-xs">
                          <FaEye /> View
                        </Link>
                        <button onClick={() => toggleStatus(job)} className="btn btn-xs">
                          {job.status === "open" ? <FaToggleOff /> : <FaToggleOn />} {job.status === "open" ? "Close" : "Open"}
                        </button>
                        <button onClick={() => handleDelete(job._id)} className="btn btn-xs bg-red-500 hover:bg-red-600 text-white">
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10`}></div>
      <div className="p-4 relative">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function JobCard({ job, index, onToggle, onDelete }) {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-blue-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
  ];
  const colorClass = colors[index % colors.length];

  return (
    <div className={`group relative overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white border-gray-200`}>
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorClass}`}></div>
      <div className="p-3 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {job.companyLogo ? (
              <div className="avatar">
                <div className="w-10 h-10 rounded-md">
                  <img src={job.companyLogo} alt={job.companyName || "Company"} />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-md w-10">
                  <span className="text-xs">{job.title?.charAt(0)?.toUpperCase() || "J"}</span>
                </div>
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {job.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm">Featured</span>
                )}
                <h3 className="text-sm font-bold text-gray-800 break-words">{job.title}</h3>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${colorClass} text-white`}>{job.employmentType}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{job.jobLevel}</span>
              </div>
            </div>
          </div>
          <span className={`badge badge-sm ${job.status === "open" ? "badge-success" : "badge-warning"}`}>{job.status || "open"}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[11px] text-gray-500">
            <span className="mr-2">{job.companyName || "-"}</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{job.category || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/jobs/${job._id}`} className="btn btn-xs"> <FaEye /> View</Link>
            <button onClick={onToggle} className="btn btn-xs">{job.status === "open" ? <FaToggleOff /> : <FaToggleOn />} {job.status === "open" ? "Close" : "Open"}</button>
            <button onClick={onDelete} className="btn btn-xs bg-red-500 hover:bg-red-600 text-white"><FaTrash /> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}


