"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export default function JobDetailsPage({ params }) {
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch job");
        setJob(data.job);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchJob();
    }
  }, [id]);

  useEffect(() => {
    async function fetchSaved() {
      if (!session?.user?.email || !job?._id) return;
      try {
        const res = await fetch('/api/saved-jobs', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.success) {
          const ids = new Set((data.saved || []).map(s => s.jobId));
          setSaved(ids.has(job._id));
        }
      } catch {}
    }
    fetchSaved();
  }, [session?.user?.email, job?._id]);

  const handleApply = async () => {
    if (!session?.user?.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to apply for this job',
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
          jobId: job._id,
          coverLetter: `I am interested in applying for the ${job.title} position at ${job.companyName}. I believe my skills and experience make me a strong candidate for this role.`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: `Your application for ${job.title} has been submitted successfully.`,
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
  const toggleSave = async () => {
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
    setSaving(true);
    try {
      if (saved) {
        const res = await fetch(`/api/saved-jobs?jobId=${encodeURIComponent(job._id)}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.success) setSaved(false);
      } else {
        const res = await fetch('/api/saved-jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId: job._id }) });
        const data = await res.json();
        if (res.ok && data.success) setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  };


  const isApplicationDeadlinePassed = job?.applicationDeadline ? 
    new Date(job.applicationDeadline) < new Date() : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-base-content/70 mb-4">{error || "The job you're looking for doesn't exist."}</p>
          <Link href="/jobs" className="btn btn-primary">Browse All Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Breadcrumb */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="breadcrumbs text-sm">
            <ul>
              <li><Link href="/" className="text-primary hover:underline">Home</Link></li>
              <li><Link href="/jobs" className="text-primary hover:underline">Jobs</Link></li>
              <li>{job.title}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                      <p className="text-xl text-primary font-semibold mb-2">{job.companyName}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="badge badge-primary">{job.category}</span>
                        <span className="badge badge-outline">{job.employmentType}</span>
                        <span className="badge badge-outline">{job.jobLevel}</span>
                        <span className="badge badge-outline">{job.workMode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    {job.applicationDeadline && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className={isApplicationDeadlinePassed ? "text-error" : "text-warning"}>
                          Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                          {isApplicationDeadlinePassed && " (Expired)"}
                        </span>
                      </div>
                    )}
                    {job.numberOfVacancies > 1 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        <span>{job.numberOfVacancies} positions available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Overview */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Job Overview</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-base-content/80 leading-relaxed">
                  {job.overview}
                </p>
              </div>
            </div>

            {/* Key Requirements */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Key Requirements</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-base-content/80 leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            </div>

            {/* Preferred Qualifications */}
            {job.preferredQualifications && (
              <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Preferred Qualifications</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line text-base-content/80 leading-relaxed">
                    {job.preferredQualifications}
                  </p>
                </div>
              </div>
            )}

            {/* Tools & Technologies */}
            {job.toolsTechnologies?.length > 0 && (
              <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-3">
                  {job.toolsTechnologies.map((tech, idx) => (
                    <span key={idx} className="badge badge-primary badge-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {(job.experienceRequired || job.educationRequired || job.genderPreference || job.ageLimit) && (
              <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.experienceRequired && (
                    <div>
                      <h3 className="font-semibold text-base-content/80 mb-1">Experience Required</h3>
                      <p className="text-base-content/70">{job.experienceRequired}</p>
                    </div>
                  )}
                  {job.educationRequired && (
                    <div>
                      <h3 className="font-semibold text-base-content/80 mb-1">Education Required</h3>
                      <p className="text-base-content/70">{job.educationRequired}</p>
                    </div>
                  )}
                  {job.genderPreference && (
                    <div>
                      <h3 className="font-semibold text-base-content/80 mb-1">Gender Preference</h3>
                      <p className="text-base-content/70">{job.genderPreference}</p>
                    </div>
                  )}
                  {job.ageLimit && (
                    <div>
                      <h3 className="font-semibold text-base-content/80 mb-1">Age Limit</h3>
                      <p className="text-base-content/70">{job.ageLimit}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {job.tags?.length > 0 && (
              <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="badge badge-outline badge-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                {job.salaryMin && job.salaryMax ? (
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-success">
                      {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                    </div>
                    <div className="text-sm text-base-content/70">
                      {job.salaryType} {job.isNegotiable && "(Negotiable)"}
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-base-content/70 mb-4">
                    Salary Not Specified
                  </div>
                )}

                {job.perksBenefits && (
                  <div className="text-left mb-4">
                    <h3 className="font-semibold mb-2">Benefits & Perks</h3>
                    <p className="text-sm text-base-content/70 whitespace-pre-line">
                      {job.perksBenefits}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
              <button
                className={`btn w-full btn-lg ${
                  isApplicationDeadlinePassed 
                    ? "btn-disabled" 
                    : "btn-primary hover:btn-primary/90"
                }`}
                onClick={handleApply}
                disabled={isApplicationDeadlinePassed || applying}
              >
                {applying ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Applying...
                  </>
                ) : isApplicationDeadlinePassed ? (
                  "Application Closed"
                ) : (
                  "Apply Now"
                )}
              </button>
              <button
                className="btn btn-outline w-full"
                onClick={toggleSave}
                disabled={saving}
              >
                {saving ? 'Working...' : (saved ? '★ Saved' : '☆ Save job')}
              </button>
              </div>

              {job.howToApply && (
                <div className="mt-4 text-center text-sm text-base-content/70">
                  Apply via: {job.howToApply}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-base-300">
                <h3 className="font-semibold mb-3">Share this job</h3>
                <div className="flex gap-2">
                  <button
                    className="btn btn-outline btn-sm flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      Swal.fire({
                        icon: "success",
                        title: "Copied!",
                        text: "Job link copied to clipboard",
                        timer: 2000,
                        showConfirmButton: false
                      });
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">About {job.companyName}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <span>Industry: {job.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Location: {job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Similar Jobs</h3>
              <p className="text-sm text-base-content/70">
                Discover more opportunities in {job.category} and {job.location}.
              </p>
              <Link href="/jobs" className="btn btn-outline btn-sm mt-3 w-full">
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
