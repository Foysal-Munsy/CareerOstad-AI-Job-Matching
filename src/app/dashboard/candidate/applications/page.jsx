'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { 
  FaArrowLeft, FaBriefcase, FaBuilding, FaMapMarkerAlt, 
  FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, 
  FaEye, FaExternalLinkAlt, FaSpinner, FaFileContract,
  FaUser, FaEnvelope, FaPhone, FaSearch, FaFilter
} from 'react-icons/fa';

export default function MyApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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
        return <FaFileContract className="w-3 h-3" />;
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
        return <FaFileContract className="w-3 h-3" />;
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications');
      const data = await response.json();

      if (response.ok && data.success) {
        setApplications(data.applications || []);
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

  useEffect(() => {
    if (session?.user?.email) {
      fetchApplications();
    }
  }, [session?.user?.email]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchQuery || 
      app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
          <p className="text-base-content/70">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/candidate" className="btn btn-ghost btn-circle">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-base-content">My Applications</h1>
                <p className="text-base-content/70">Track your job applications and their status</p>
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
              <FaFileContract className="w-8 h-8" />
            </div>
            <div className="stat-title">Total</div>
            <div className="stat-value text-primary">{stats.total}</div>
          </div>
          
          <div className="stat bg-base-100 rounded-xl shadow-sm">
            <div className="stat-figure text-info">
              <FaFileContract className="w-8 h-8" />
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="md:w-64">
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
              {searchQuery || statusFilter !== 'All' ? 'No applications found' : 'No applications yet'}
            </h3>
            <p className="text-base-content/70 mb-4">
              {searchQuery || statusFilter !== 'All' 
                ? 'Try adjusting your search criteria'
                : 'Start applying to jobs to see them here'
              }
            </p>
            <Link href="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application._id} className="bg-base-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-base-content mb-1">
                          {application.job?.title || 'Job Title Not Available'}
                        </h3>
                        <p className="text-lg text-primary font-semibold">
                          {application.job?.companyName || 'Company Not Available'}
                        </p>
                      </div>
                      <div className={`badge ${getStatusColor(application.status)} gap-1`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-base-content/70 mb-4">
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

                    <div className="flex items-center gap-4 text-sm text-base-content/60">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                      </div>
                      {application.job?.createdAt && (
                        <div className="flex items-center gap-1">
                          <FaClock className="w-4 h-4" />
                          <span>Posted: {new Date(application.job.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {application.coverLetter && (
                      <div className="mt-4 p-3 bg-base-200 rounded-lg">
                        <p className="text-sm text-base-content/80">
                          <strong>Cover Letter:</strong> {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-[200px]">
                    <Link 
                      href={`/jobs/${application.jobId}`}
                      className="btn btn-primary btn-sm w-full"
                    >
                      <FaEye className="w-4 h-4" />
                      View Job
                    </Link>
                    {application.job?.applicationUrl && (
                      <a 
                        href={application.job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm w-full"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        Company Website
                      </a>
                    )}
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
