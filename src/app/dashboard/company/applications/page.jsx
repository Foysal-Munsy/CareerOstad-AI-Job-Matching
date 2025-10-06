'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { 
  FaArrowLeft, FaBriefcase, FaBuilding, FaMapMarkerAlt, 
  FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, 
  FaEye, FaUser, FaEnvelope, FaPhone, FaSearch, FaFilter,
  FaFileAlt, FaDownload, FaEdit, FaTrash, FaSpinner,
  FaUserTie, FaGraduationCap, FaCode, FaAward
} from 'react-icons/fa';

export default function CompanyApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageToEmail, setMessageToEmail] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageSending, setMessageSending] = useState(false);

  const statusOptions = [
    'All',
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled',
    'Accepted',
    'Rejected'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'badge-info';
      case 'Under Review':
        return 'badge-warning';
      case 'Shortlisted':
        return 'badge-primary';
      case 'Interview Scheduled':
        return 'badge-secondary';
      case 'Accepted':
        return 'badge-success';
      case 'Rejected':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
        return <FaFileAlt className="w-3 h-3" />;
      case 'Under Review':
        return <FaSpinner className="w-3 h-3" />;
      case 'Shortlisted':
        return <FaCheckCircle className="w-3 h-3" />;
      case 'Interview Scheduled':
        return <FaCalendarAlt className="w-3 h-3" />;
      case 'Accepted':
        return <FaCheckCircle className="w-3 h-3" />;
      case 'Rejected':
        return <FaTimesCircle className="w-3 h-3" />;
      default:
        return <FaFileAlt className="w-3 h-3" />;
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/company/applications');
      const data = await response.json();

      if (response.ok && data.success) {
        setApplications(data.applications || []);
        setJobs(data.jobs || []);
      } else {
        setError(data.error || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch('/api/company/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status: newStatus, updatedAt: new Date() }
              : app
          )
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Status Updated!',
          text: `Application status updated to ${newStatus}`,
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: data.error || 'Failed to update status',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again',
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchApplications();
    }
  }, [session?.user?.email]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchQuery || 
      app.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesJob = jobFilter === 'All' || app.jobId === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getApplicationStats = () => {
    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'Applied').length,
      underReview: applications.filter(app => app.status === 'Under Review').length,
      shortlisted: applications.filter(app => app.status === 'Shortlisted').length,
      accepted: applications.filter(app => app.status === 'Accepted').length,
      rejected: applications.filter(app => app.status === 'Rejected').length
    };
    return stats;
  };

  const stats = getApplicationStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/company" className="btn btn-ghost btn-circle">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-base-content">Job Applications</h1>
                <p className="text-base-content/70">Manage and review candidate applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="stat bg-base-100 rounded-xl shadow-sm">
            <div className="stat-figure text-primary">
              <FaFileAlt className="w-8 h-8" />
            </div>
            <div className="stat-title">Total</div>
            <div className="stat-value text-primary">{stats.total}</div>
          </div>
          
          <div className="stat bg-base-100 rounded-xl shadow-sm">
            <div className="stat-figure text-info">
              <FaFileAlt className="w-8 h-8" />
            </div>
            <div className="stat-title">Applied</div>
            <div className="stat-value text-info">{stats.applied}</div>
          </div>
          
          <div className="stat bg-base-100 rounded-xl shadow-sm">
            <div className="stat-figure text-warning">
              <FaSpinner className="w-8 h-8" />
            </div>
            <div className="stat-title">Under Review</div>
            <div className="stat-value text-warning">{stats.underReview}</div>
          </div>
          
          <div className="stat bg-base-100 rounded-xl shadow-sm">
            <div className="stat-figure text-primary">
              <FaCheckCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Shortlisted</div>
            <div className="stat-value text-primary">{stats.shortlisted}</div>
          </div>
          
          <div className="stat bg-base-100 rounded-xl shadow-sm">
            <div className="stat-figure text-success">
              <FaCheckCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Accepted</div>
            <div className="stat-value text-success">{stats.accepted}</div>
          </div>
          
          <div className="stat bg-base-100 rounded-xl shadow-sm">
            <div className="stat-figure text-error">
              <FaTimesCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Rejected</div>
            <div className="stat-value text-error">{stats.rejected}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-base-100 rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by candidate name, email, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered w-full focus:ring-2 focus:ring-primary/20"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="select select-bordered w-full focus:ring-2 focus:ring-primary/20"
              >
                <option value="All">All Jobs</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {error ? (
          <div className="alert alert-error">
            <FaTimesCircle className="w-4 h-4" />
            <span>{error}</span>
            <button onClick={fetchApplications} className="btn btn-sm btn-outline">
              Try Again
            </button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-2">
              {searchQuery || statusFilter !== 'All' || jobFilter !== 'All' ? 'No applications found' : 'No applications yet'}
            </h3>
            <p className="text-base-content/70 mb-4">
              {searchQuery || statusFilter !== 'All' || jobFilter !== 'All' 
                ? 'Try adjusting your search criteria'
                : 'Applications will appear here when candidates apply to your jobs'
              }
            </p>
            <Link href="/dashboard/company/post-job" className="btn btn-primary">
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application._id} className="bg-base-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <FaUser className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-base-content">
                            {application.candidateName || 'Unknown Candidate'}
                          </h3>
                          <p className="text-primary font-semibold">
                            {application.candidateEmail}
                          </p>
                        </div>
                      </div>
                      <div className={`badge ${getStatusColor(application.status)} gap-1`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </div>
                    </div>

                    {/* Job Info */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-base-content mb-2">
                        Applied for: {application.job?.title || 'Job Title Not Available'}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                        {application.job?.location && (
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="w-4 h-4" />
                            <span>{application.job.location}</span>
                          </div>
                        )}
                        {application.job?.employmentType && (
                          <div className="flex items-center gap-1">
                            <FaBriefcase className="w-4 h-4" />
                            <span>{application.job.employmentType}</span>
                          </div>
                        )}
                        {application.job?.salaryMin && application.job?.salaryMax && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-success">
                              ${application.job.salaryMin.toLocaleString()} - ${application.job.salaryMax.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="flex items-center gap-4 text-sm text-base-content/60 mb-4">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                      </div>
                      {application.updatedAt && (
                        <div className="flex items-center gap-1">
                          <FaClock className="w-4 h-4" />
                          <span>Updated: {new Date(application.updatedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Cover Letter */}
                    {application.coverLetter && (
                      <div className="mb-4 p-4 bg-base-200 rounded-lg">
                        <h5 className="font-semibold text-base-content mb-2">Cover Letter:</h5>
                        <p className="text-sm text-base-content/80">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Resume Link */}
                    {application.resumeUrl && (
                      <div className="mb-4">
                        <a 
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          <FaDownload className="w-4 h-4" />
                          Download Resume
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Panel */}
                  <div className="lg:w-80">
                    <div className="bg-base-200 rounded-lg p-4">
                      <h5 className="font-semibold text-base-content mb-3">Quick Actions</h5>
                      
                      {/* Status Update */}
                      <div className="mb-4">
                        <label className="label">
                          <span className="label-text font-medium">Update Status</span>
                        </label>
                        <select
                          value={application.status}
                          onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                          className="select select-bordered w-full select-sm"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Link 
                          href={`/jobs/${application.jobId}`}
                          className="btn btn-primary btn-sm w-full"
                        >
                          <FaEye className="w-4 h-4" />
                          View Job Details
                        </Link>
                        
                        <Link 
                          href={`/dashboard/company/candidate-profile/${application.candidateEmail}`}
                          className="btn btn-outline btn-sm w-full"
                        >
                          <FaUser className="w-4 h-4" />
                          View Candidate Profile
                        </Link>
                        
                        <button 
                          className="btn btn-outline btn-sm w-full"
                          onClick={() => {
                            setMessageToEmail(application.candidateEmail);
                            setMessageSubject(`Regarding your application for ${application?.job?.title || 'the position'}`);
                            setMessageBody('');
                            setIsMessageOpen(true);
                          }}
                        >
                          <FaEnvelope className="w-4 h-4" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Send Message Modal */}
    {isMessageOpen && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
        <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">Send Message</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsMessageOpen(false)}>✕</button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="label"><span className="label-text">To</span></label>
              <input value={messageToEmail} readOnly className="input input-bordered w-full" />
            </div>
            <div>
              <label className="label"><span className="label-text">Subject</span></label>
              <input 
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                className="input input-bordered w-full" 
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="label"><span className="label-text">Message</span></label>
              <textarea 
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="textarea textarea-bordered w-full min-h-32"
                placeholder="Write your message..."
              />
            </div>
          </div>
          <div className="p-4 border-t flex items-center justify-end gap-2">
            <button className="btn btn-ghost" onClick={() => setIsMessageOpen(false)}>Cancel</button>
            <button 
              className={`btn btn-primary ${messageSending ? 'btn-disabled' : ''}`}
              onClick={async () => {
                if (!messageBody?.trim()) {
                  Swal.fire({ icon: 'warning', title: 'Message required', text: 'Please write a message body.' });
                  return;
                }
                try {
                  setMessageSending(true);
                  const res = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      receiverEmail: messageToEmail,
                      subject: messageSubject,
                      body: messageBody,
                    }),
                  });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    Swal.fire({ icon: 'success', title: 'Message sent', timer: 1800, timerProgressBar: true });
                    setIsMessageOpen(false);
                    setMessageBody('');
                  } else {
                    Swal.fire({ icon: 'error', title: 'Failed', text: data.error || 'Could not send message' });
                  }
                } catch (e) {
                  Swal.fire({ icon: 'error', title: 'Network error', text: 'Please try again.' });
                } finally {
                  setMessageSending(false);
                }
              }}
            >
              {messageSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
