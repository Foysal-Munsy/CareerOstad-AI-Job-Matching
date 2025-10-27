'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  FaUsers, 
  FaBuilding, 
  FaBriefcase, 
  FaFileAlt, 
  FaChartLine,
  FaDownload,
  FaSyncAlt,
  FaCheckCircle,
  FaTag,
  FaSave,
  FaBook,
  FaUserTie
} from 'react-icons/fa';

export default function AdminReports() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchReports();
    }
  }, [status, session?.user?.role]);

  async function fetchReports() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/reports', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load reports');
      }
      const data = await res.json();
      setReports(data.reports || {});
    } catch (e) {
      setError('Could not fetch reports');
      console.error('Error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    fetchReports();
  }

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return <div className="p-4">Unauthorized</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-primary mt-4" onClick={fetchReports}>
          Retry
        </button>
      </div>
    );
  }

  const { summary = {}, growth = {}, breakdowns = {}, topPerformers = {}, recentActivity = {} } = reports || {};

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports Dashboard</h1>
          <p className="mt-1 text-base-content/70">Comprehensive insights and analytics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="btn btn-sm btn-primary gap-2"
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Refreshing...
              </>
            ) : (
              <>
                <FaSyncAlt /> Refresh
              </>
            )}
          </button>
          <button className="btn btn-sm btn-success gap-2">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Users"
          value={summary.totalUsers || 0}
          subtitle={`${summary.totalCompanies || 0} companies, ${summary.totalCandidates || 0} candidates`}
          icon={FaUsers}
          gradient="from-primary/20 via-primary/10 to-transparent"
          accent="text-primary"
        />
        <SummaryCard
          title="Total Jobs"
          value={summary.totalJobs || 0}
          subtitle={`${summary.activeJobs || 0} active, ${summary.closedJobs || 0} closed`}
          icon={FaBriefcase}
          gradient="from-success/20 via-success/10 to-transparent"
          accent="text-success"
        />
        <SummaryCard
          title="Applications"
          value={summary.totalApplications || 0}
          subtitle={`${growth.applicationsLast7Days || 0} this week`}
          icon={FaFileAlt}
          gradient="from-info/20 via-info/10 to-transparent"
          accent="text-info"
        />
        <SummaryCard
          title="Verified Users"
          value={summary.verifiedUsers || 0}
          subtitle={`Featured Jobs: ${summary.featuredJobsCount || 0}`}
          icon={FaCheckCircle}
          gradient="from-warning/20 via-warning/10 to-transparent"
          accent="text-warning"
        />
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GrowthCard
          title="User Growth"
          last7Days={growth.usersLast7Days || 0}
          last30Days={growth.usersLast30Days || 0}
        />
        <GrowthCard
          title="Job Growth"
          last7Days={growth.jobsLast7Days || 0}
          last30Days={growth.jobsLast30Days || 0}
        />
        <GrowthCard
          title="Application Growth"
          last7Days={growth.applicationsLast7Days || 0}
          last30Days={growth.applicationsLast30Days || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Application Status Breakdown */}
        <BreakdownCard
          title="Application Status"
          data={breakdowns.applicationStatus || []}
          color="primary"
        />

        {/* Roles Breakdown */}
        <BreakdownCard
          title="User Roles"
          data={breakdowns.roles || []}
          color="info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Job Categories */}
        <BreakdownCard
          title="Top Job Categories"
          data={breakdowns.categories || []}
          color="success"
        />

        {/* Employment Types */}
        <BreakdownCard
          title="Employment Types"
          data={breakdowns.employmentTypes || []}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Work Modes */}
        <BreakdownCard
          title="Work Modes"
          data={breakdowns.workModes || []}
          color="secondary"
        />

        {/* Job Levels */}
        <BreakdownCard
          title="Job Levels"
          data={breakdowns.jobLevels || []}
          color="accent"
        />
      </div>

      {/* Top Companies */}
      {topPerformers.companies && topPerformers.companies.length > 0 && (
        <div className="rounded-xl border border-base-300 bg-base-100 p-4">
          <div className="flex items-center gap-2 mb-4">
            <FaBuilding className="text-primary" />
            <h2 className="text-lg font-semibold">Top Companies by Job Posts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Posts</th>
                  <th>Avg. Vacancies</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.companies.map((company, idx) => (
                  <tr key={idx}>
                    <td>{company._id || 'Unknown'}</td>
                    <td>
                      <span className="badge badge-primary">{company.jobCount || 0}</span>
                    </td>
                    <td>{Math.round(company.avgVacancies || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Most Applied Jobs */}
      {topPerformers.mostAppliedJobs && topPerformers.mostAppliedJobs.length > 0 && (
        <div className="rounded-xl border border-base-300 bg-base-100 p-4">
          <div className="flex items-center gap-2 mb-4">
            <FaFileAlt className="text-success" />
            <h2 className="text-lg font-semibold">Most Applied Jobs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applications</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.mostAppliedJobs.map((job, idx) => (
                  <tr key={idx}>
                    <td>{job.jobTitle}</td>
                    <td>{job.companyName}</td>
                    <td>
                      <span className="badge badge-success">{job.applicationCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Jobs */}
        {recentActivity.jobs && recentActivity.jobs.length > 0 && (
          <div className="rounded-xl border border-base-300 bg-base-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <FaBriefcase className="text-info" />
              <h3 className="text-lg font-semibold">Recent Jobs</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentActivity.jobs.slice(0, 5).map((job, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-medium truncate">{job.title}</div>
                  <div className="text-xs text-base-content/60">{job.companyName}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        {recentActivity.applications && recentActivity.applications.length > 0 && (
          <div className="rounded-xl border border-base-300 bg-base-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <FaFileAlt className="text-success" />
              <h3 className="text-lg font-semibold">Recent Applications</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentActivity.applications.slice(0, 5).map((app, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-medium truncate">{app.candidateName || 'Unknown'}</div>
                  <div className="text-xs text-base-content/60">{app.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Users */}
        {recentActivity.users && recentActivity.users.length > 0 && (
          <div className="rounded-xl border border-base-300 bg-base-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <FaUsers className="text-warning" />
              <h3 className="text-lg font-semibold">Recent Users</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentActivity.users.slice(0, 5).map((user, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-medium truncate">{user.name || 'Unknown'}</div>
                  <div className="text-xs text-base-content/60">{user.role || 'candidate'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon: Icon, gradient, accent }) {
  return (
    <div className="relative rounded-xl border border-base-300 bg-base-100 overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="relative p-4 flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-base-200 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-base-content/70">{title}</div>
          <div className={`text-2xl font-bold ${accent}`}>{value}</div>
          <div className="text-xs text-base-content/60 mt-0.5">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function GrowthCard({ title, last7Days, last30Days }) {
  const growthRate = last30Days > 0 ? ((last7Days / last30Days) * 100).toFixed(1) : 0;
  
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4">
      <h3 className="text-sm font-medium text-base-content/70 mb-3">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Last 7 days</span>
          <span className="font-bold text-primary">{last7Days}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Last 30 days</span>
          <span className="font-bold text-success">{last30Days}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-base-300">
          <span className="text-xs text-base-content/60">Growth rate</span>
          <span className={`font-bold ${growthRate >= 0 ? 'text-success' : 'text-error'}`}>
            {growthRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({ title, data, color }) {
  const badgeColors = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error'
  };

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.length === 0 ? (
          <div className="text-sm text-base-content/60">No data available</div>
        ) : (
          data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium">{item._id || 'Unknown'}</div>
                <div className="w-full bg-base-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full bg-${color}`}
                    style={{
                      width: `${Math.min((item.count / (data[0]?.count || 1)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
              <div className="ml-3">
                <span className={`badge ${badgeColors[color]}`}>{item.count}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

