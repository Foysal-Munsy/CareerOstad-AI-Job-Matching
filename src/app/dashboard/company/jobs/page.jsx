"use client";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
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

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return jobs.filter(j =>
      (!q || j.title.toLowerCase().includes(q) || j.toolsTechnologies?.some(s => s.toLowerCase().includes(q)) || j.tags?.some(s => s.toLowerCase().includes(q))) &&
      (type === "All" || j.employmentType === type)
    );
  }, [jobs, query, type]);

  async function confirmCopy(job) {
    const res = await Swal.fire({
      title: "Duplicate job?",
      text: "A new draft will be created from this post.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Duplicate",
    });
    if (!res.isConfirmed) return;
    try {
      const payload = { ...job, _id: undefined, createdAt: undefined, updatedAt: undefined, status: "open" };
      const r = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed to duplicate");
      await Swal.fire({ icon: "success", title: "Duplicated" });
      fetchJobs();
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed", text: String(e.message || e) });
    }
  }

  async function confirmDelete(job) {
    const res = await Swal.fire({
      title: "Delete job?",
      text: `Are you sure you want to delete "${job.title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Cancel"
    });
    if (!res.isConfirmed) return;
    
    try {
      const r = await fetch(`/api/jobs/${job._id}`, { method: "DELETE" });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed to delete job");
      await Swal.fire({ icon: "success", title: "Deleted", text: "Job has been deleted successfully." });
      fetchJobs();
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed to delete", text: String(e.message || e) });
    }
  }

  async function toggleJobStatus(job) {
    const newStatus = job.status === "open" ? "closed" : "open";
    const action = newStatus === "open" ? "reopen" : "close";
    
    const res = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} job?`,
      text: `Are you sure you want to ${action} "${job.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
    });
    if (!res.isConfirmed) return;
    
    try {
      const payload = { ...job, status: newStatus };
      const r = await fetch(`/api/jobs/${job._id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || `Failed to ${action} job`);
      await Swal.fire({ icon: "success", title: `${action.charAt(0).toUpperCase() + action.slice(1)}d`, text: `Job has been ${action}d successfully.` });
      fetchJobs();
    } catch (e) {
      Swal.fire({ icon: "error", title: `Failed to ${action}`, text: String(e.message || e) });
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Job Posts</h1>
          <p className="mt-1 text-base-content/70">View and manage your posted jobs.</p>
        </div>
        <a className="btn btn-primary" href="/dashboard/company/post-job">Post a Job</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="input input-bordered" placeholder="Search title, skills, or tags" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="select select-bordered" value={type} onChange={(e) => setType(e.target.value)}>
          <option>All</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
        <div className="flex items-center text-sm text-base-content/70">Total: {filtered.length}</div>
      </div>

      {error ? <p className="text-red-500">{error}</p> : null}

      {loading ? (
        <div className="text-base-content/70">Loading...</div>
      ) : filtered.length === 0 ? (
        <p className="text-base-content/70">No matching jobs.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((job) => (
            <li
              key={job._id}
              className="relative overflow-hidden rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm card-professional"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />

              <div className="flex items-start justify-between gap-6">
                <div className="pr-2">
                  <div className="flex items-start gap-3">
                    <h3 className="font-semibold text-lg leading-snug">{job.title}</h3>
                    <span
                      className={
                        "ml-auto badge badge-sm " +
                        (job.status === "open"
                          ? "badge-success"
                          : job.status === "closed"
                          ? "badge-error"
                          : "badge-warning")
                      }
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-base-content/70 space-y-1">
                    <p>{job.location} • {job.employmentType} • {job.jobLevel}</p>
                    {job.category && <p className="text-xs">Category: {job.category}</p>}
                    {job.workMode && <p className="text-xs">Work Mode: {job.workMode}</p>}
                    {job.numberOfVacancies > 1 && <p className="text-xs">Vacancies: {job.numberOfVacancies}</p>}
                    {job.applicationDeadline && <p className="text-xs text-warning">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>}
                  </div>
                  <p className="mt-3 whitespace-pre-line text-base-content/90">{job.overview}</p>

                  {job.toolsTechnologies?.length ? (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-base-content/80 mb-2">Technologies:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.toolsTechnologies.map((s, idx) => (
                          <span
                            key={idx}
                            className={
                              "badge badge-sm " + (idx % 3 === 0 ? "badge-primary" : idx % 3 === 1 ? "badge-secondary" : "badge-accent")
                            }
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {job.tags?.length ? (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-base-content/80 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((s, idx) => (
                          <span
                            key={idx}
                            className="badge badge-outline badge-sm"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="min-w-44 text-right text-sm text-base-content/70">
                  {job.salaryMin != null || job.salaryMax != null ? (
                    <div className="font-medium text-base-content">
                      {job.salaryMin ? job.salaryMin.toLocaleString() : "0"} - {job.salaryMax ? job.salaryMax.toLocaleString() : "0"} {job.salaryType || "BDT"}
                      {job.isNegotiable && <span className="text-xs text-success ml-1">(Negotiable)</span>}
                    </div>
                  ) : null}
                  <div className="mt-1">Posted {new Date(job.createdAt).toLocaleDateString()}</div>
                  {job.howToApply && (
                    <div className="mt-1 text-xs">
                      Apply via: {job.howToApply}
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-2">
                    <a className="btn btn-sm btn-primary btn-professional" href={`/dashboard/company/post-job/${job._id}`}>
                      Edit
                    </a>
                    <button 
                      className={`btn btn-sm ${job.status === "open" ? "btn-warning" : "btn-success"} btn-professional`}
                      onClick={() => toggleJobStatus(job)}
                    >
                      {job.status === "open" ? "Close" : "Reopen"}
                    </button>
                    <button className="btn btn-sm btn-primary btn-professional" onClick={() => confirmCopy(job)}>
                      Duplicate
                    </button>
                    <button 
                      className="btn btn-sm btn-error btn-professional" 
                      onClick={() => confirmDelete(job)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


