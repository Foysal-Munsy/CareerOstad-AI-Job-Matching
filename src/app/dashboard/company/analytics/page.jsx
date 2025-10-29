"use client";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function CompanyAnalyticsPage() {
  const [stats, setStats] = useState({ activeJobs: 0, applications: 0, interviews: 0 });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [statsRes, jobsRes, appsRes] = await Promise.all([
          fetch("/api/company/stats", { cache: "no-store" }),
          fetch("/api/jobs", { cache: "no-store" }),
          fetch("/api/company/applications", { cache: "no-store" })
        ]);
        
        const [statsData, jobsData, appsData] = await Promise.all([
          statsRes.json(),
          jobsRes.json(),
          appsRes.json()
        ]);
        
        if (statsRes.ok && statsData.success) {
          setStats(statsData.stats || { activeJobs: 0, applications: 0, interviews: 0 });
        }
        if (jobsRes.ok && jobsData.jobs) {
          setJobs(jobsData.jobs || []);
        }
        if (appsRes.ok && appsData.success) {
          setApplications(appsData.applications || []);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const applicationPerJob = stats.activeJobs > 0 ? (stats.applications / stats.activeJobs).toFixed(1) : "0.0";

  // Prepare data for charts
  const applicationsByMonth = useMemo(() => {
    const monthCounts = {};
    applications.forEach(app => {
      if (app.createdAt) {
        const date = new Date(app.createdAt);
        const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      }
    });
    return Object.entries(monthCounts).map(([name, value]) => ({ name, value })).slice(-7);
  }, [applications]);

  const jobsByStatus = useMemo(() => {
    const statusCounts = { "Open": 0, "Closed": 0 };
    jobs.forEach(job => {
      if (job.status === 'open') statusCounts["Open"]++;
      else statusCounts["Closed"]++;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  const applicationsByJob = useMemo(() => {
    const jobAppCounts = {};
    applications.forEach(app => {
      if (app.job?.title) {
        const title = app.job.title.length > 20 ? app.job.title.substring(0, 20) + '...' : app.job.title;
        jobAppCounts[title] = (jobAppCounts[title] || 0) + 1;
      }
    });
    return Object.entries(jobAppCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [applications]);

  const applicationStatusData = useMemo(() => {
    const statusCounts = {};
    applications.forEach(app => {
      const status = app.status || "Applied";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  const PIE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Job Analytics</h1>
        <p className="mt-1 text-base-content/70">Comprehensive insights about your job posts and applicants.</p>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Active Job Posts</div>
          <div className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">{loading ? "-" : stats.activeJobs}</div>
          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Open roles currently visible</div>
        </div>
        <div className="rounded-xl border-2 border-purple-200 p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Total Applications</div>
          <div className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-100">{loading ? "-" : stats.applications}</div>
          <div className="mt-1 text-xs text-purple-600 dark:text-purple-400">Across all your job posts</div>
        </div>
        <div className="rounded-xl border-2 border-green-200 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="text-sm text-green-700 dark:text-green-300 font-medium">Interviews Scheduled</div>
          <div className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">{loading ? "-" : stats.interviews}</div>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400">Based on application status</div>
        </div>
      </section>

      {/* Charts Row 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <div className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-base-content">Applications Over Time</h3>
          <p className="text-sm text-base-content/70 mb-4">Application trends by month</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={applicationsByMonth.length > 0 ? applicationsByMonth : [{ name: 'No data', value: 0 }]}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#45B7D1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#45B7D1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#45B7D1" 
                strokeWidth={3}
                fill="url(#colorApplications)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Job Status Distribution */}
        <div className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-base-content">Job Status Distribution</h3>
          <p className="text-sm text-base-content/70 mb-4">Open vs closed positions</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobsByStatus.length > 0 ? jobsByStatus : [{ name: 'No data', value: 0 }]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {jobsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#4ECDC4' : '#FF6B6B'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Charts Row 2 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Jobs by Applications */}
        <div className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-base-content">Top Jobs by Applications</h3>
          <p className="text-sm text-base-content/70 mb-4">Most popular job positions</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationsByJob.length > 0 ? applicationsByJob : [{ name: 'No data', value: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={11} 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} 
              />
              <Bar dataKey="value" fill="#FFA07A" radius={[8, 8, 0, 0]}>
                {applicationsByJob.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status Breakdown */}
        <div className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-base-content">Application Status Breakdown</h3>
          <p className="text-sm text-base-content/70 mb-4">Distribution by application status</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationStatusData.length > 0 ? applicationStatusData : [{ name: 'No data', value: 0 }]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {applicationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Additional Metric */}
      <section className="rounded-xl border-2 border-orange-200 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Applications per Active Job</div>
            <div className="mt-2 text-3xl font-bold text-orange-900 dark:text-orange-100">{loading ? "-" : applicationPerJob}</div>
            <div className="mt-1 text-xs text-orange-600 dark:text-orange-400">Average application volume by open role</div>
          </div>
          <div className="text-6xl opacity-20">📊</div>
        </div>
      </section>
    </div>
  );
}


