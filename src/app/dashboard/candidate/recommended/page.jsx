"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function RecommendedJobsPage() {
  const { data: session } = useSession();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchRecommendedJobs();
    }
  }, [session?.user?.email]);

  const fetchRecommendedJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/jobs/recommended', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load recommended jobs');
      setRecommendedJobs(data.jobs || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId, jobTitle) => {
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

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-base-content/70 mb-4">Please login to view your recommended jobs.</p>
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Recommended Jobs for You
            </h1>
            <p className="text-xl mb-8 opacity-90">
              AI-powered job recommendations based on your profile, skills, and experience.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-2xl">
            <div className="stat-figure text-primary">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-title">Total Recommendations</div>
            <div className="stat-value text-primary">{loading ? '...' : recommendedJobs.length}</div>
            <div className="stat-desc">Jobs matched to your profile</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-2xl">
            <div className="stat-figure text-success">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-title">High Match Jobs</div>
            <div className="stat-value text-success">
              {loading ? '...' : recommendedJobs.filter(job => job.matchingPercentage >= 80).length}
            </div>
            <div className="stat-desc">80%+ match rate</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-2xl">
            <div className="stat-figure text-warning">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-title">New This Week</div>
            <div className="stat-value text-warning">
              {loading ? '...' : recommendedJobs.filter(job => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(job.createdAt) > weekAgo;
              }).length}
            </div>
            <div className="stat-desc">Recently posted</div>
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
        ) : recommendedJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-2">No Recommendations Yet</h3>
            <p className="text-base-content/70 mb-4">
              Complete your profile to get personalized job recommendations.
            </p>
            <Link href="/dashboard/candidate/profile" className="btn btn-primary">
              Complete Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedJobs.map((job) => (
              <div key={job._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="card-title text-lg mb-2 line-clamp-2">{job.title}</h2>
                      <p className="text-primary font-semibold">{job.companyName}</p>
                      
                      {/* Matching Percentage */}
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className={`text-sm font-semibold ${
                              job.matchingPercentage >= 80 ? 'text-success' :
                              job.matchingPercentage >= 60 ? 'text-warning' :
                              'text-error'
                            }`}>
                              {job.matchingPercentage}% Match
                            </span>
                          </div>
                          <div className="w-20 bg-base-300 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                job.matchingPercentage >= 80 ? 'bg-success' :
                                job.matchingPercentage >= 60 ? 'bg-warning' :
                                'bg-error'
                              }`}
                              style={{ width: `${job.matchingPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
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
