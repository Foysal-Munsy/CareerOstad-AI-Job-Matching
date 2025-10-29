"use client";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function CompanyPerformancePage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/company/applications", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.success) {
          setApplications(data.applications || []);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totals = useMemo(() => {
    const total = applications.length;
    const byStatus = applications.reduce((acc, app) => {
      const key = (app.status || "Applied").trim();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const shortlisted = byStatus["Shortlisted"] || 0;
    const interviewScheduled = byStatus["Interview Scheduled"] || 0;
    const underReview = byStatus["Under Review"] || 0;
    const applied = byStatus["Applied"] || 0;
    const rejected = byStatus["Rejected"] || 0;
    const accepted = byStatus["Accepted"] || 0;

    const shortlistRate = total > 0 ? Math.round((shortlisted / total) * 100) : 0;
    const interviewRate = total > 0 ? Math.round((interviewScheduled / total) * 100) : 0;
    const conversionRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    return { total, byStatus, shortlisted, interviewScheduled, underReview, applied, rejected, accepted, shortlistRate, interviewRate, conversionRate };
  }, [applications]);

  // Prepare data for conversion funnel
  const conversionFunnel = useMemo(() => {
    return [
      { name: "Applied", value: totals.applied || totals.total, fill: "#FF6B6B" },
      { name: "Under Review", value: totals.underReview, fill: "#FFA07A" },
      { name: "Shortlisted", value: totals.shortlisted, fill: "#F7DC6F" },
      { name: "Interview", value: totals.interviewScheduled, fill: "#45B7D1" },
      { name: "Accepted", value: totals.accepted, fill: "#4ECDC4" },
    ];
  }, [totals]);

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    return Object.entries(totals.byStatus).map(([name, value]) => ({ name, value }));
  }, [totals.byStatus]);

  // Performance metrics over time
  const performanceByMonth = useMemo(() => {
    const monthData = {};
    applications.forEach(app => {
      if (app.createdAt) {
        const date = new Date(app.createdAt);
        const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        if (!monthData[monthKey]) {
          monthData[monthKey] = { applied: 0, shortlisted: 0, interview: 0, accepted: 0 };
        }
        monthData[monthKey].applied++;
        if (app.status === "Shortlisted") monthData[monthKey].shortlisted++;
        if (app.status === "Interview Scheduled") monthData[monthKey].interview++;
        if (app.status === "Accepted") monthData[monthKey].accepted++;
      }
    });
    return Object.entries(monthData)
      .map(([name, data]) => ({ name, ...data }))
      .slice(-6)
      .sort((a, b) => new Date(a.name) - new Date(b.name));
  }, [applications]);

  // Status breakdown for stacked bar
  const statusBreakdown = useMemo(() => {
    const statusCounts = {};
    applications.forEach(app => {
      const status = app.status || "Applied";
      if (!statusCounts[status]) statusCounts[status] = 0;
      statusCounts[status]++;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  const PIE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Performance Metrics</h1>
        <p className="mt-1 text-base-content/70">Track hiring performance and pipeline health with detailed analytics.</p>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-indigo-200 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
          <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Total Applications</div>
          <div className="mt-2 text-3xl font-bold text-indigo-900 dark:text-indigo-100">{loading ? "-" : totals.total}</div>
          <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">All applications across jobs</div>
        </div>
        <div className="rounded-xl border-2 border-yellow-200 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <div className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Shortlist Rate</div>
          <div className="mt-2 text-3xl font-bold text-yellow-900 dark:text-yellow-100">{loading ? "-" : `${totals.shortlistRate}%`}</div>
          <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">Shortlisted ÷ Total</div>
        </div>
        <div className="rounded-xl border-2 border-cyan-200 p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20">
          <div className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">Interview Rate</div>
          <div className="mt-2 text-3xl font-bold text-cyan-900 dark:text-cyan-100">{loading ? "-" : `${totals.interviewRate}%`}</div>
          <div className="mt-1 text-xs text-cyan-600 dark:text-cyan-400">Interview Scheduled ÷ Total</div>
        </div>
      </section>

      {/* Additional Metric Card */}
      {totals.conversionRate > 0 && (
        <section className="rounded-xl border-2 border-green-200 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-700 dark:text-green-300 font-medium">Conversion Rate</div>
              <div className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">{loading ? "-" : `${totals.conversionRate}%`}</div>
              <div className="mt-1 text-xs text-green-600 dark:text-green-400">Accepted offers ÷ Total applications</div>
            </div>
            <div className="text-6xl opacity-20">🎯</div>
          </div>
        </section>
      )}

      {/* Charts Row 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-base-content">Conversion Funnel</h3>
          <p className="text-sm text-base-content/70 mb-4">Application pipeline flow</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={conversionFunnel.filter(item => item.value > 0)} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#666" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#666" fontSize={12} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} 
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {conversionFunnel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution Pie */}
        <div className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-base-content">Status Distribution</h3>
          <p className="text-sm text-base-content/70 mb-4">Applications by current status</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution.length > 0 ? statusDistribution : [{ name: 'No data', value: 0 }]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Charts Row 2 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <div className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-base-content">Performance Trends</h3>
          <p className="text-sm text-base-content/70 mb-4">Application stages over time</p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={performanceByMonth.length > 0 ? performanceByMonth : [{ name: 'No data', applied: 0 }]}>
              <defs>
                <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorShortlisted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F7DC6F" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F7DC6F" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorInterview" x1="0" y1="0" x2="0" y2="1">
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
              <Legend />
              <Area type="monotone" dataKey="applied" stackId="1" stroke="#FF6B6B" fill="url(#colorApplied)" />
              <Area type="monotone" dataKey="shortlisted" stackId="2" stroke="#F7DC6F" fill="url(#colorShortlisted)" />
              <Area type="monotone" dataKey="interview" stackId="3" stroke="#45B7D1" fill="url(#colorInterview)" />
              <Line type="monotone" dataKey="accepted" stroke="#4ECDC4" strokeWidth={3} dot={{ fill: '#4ECDC4', r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown Bar */}
        <div className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-base-content">Status Breakdown</h3>
          <p className="text-sm text-base-content/70 mb-4">Counts by application status</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusBreakdown.length > 0 ? statusBreakdown : [{ name: 'No data', value: 0 }]}>
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
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Pipeline Cards Grid */}
      <section className="rounded-xl border-2 border-base-300 p-6 bg-base-100 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-base-content">Pipeline by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="text-base-content/70">Loading...</div>
          ) : (
            Object.entries(totals.byStatus).map(([status, count], index) => (
              <div 
                key={status} 
                className="rounded-lg border-2 p-4 bg-gradient-to-br"
                style={{
                  borderColor: COLORS[index % COLORS.length] + '40',
                  background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}15 0%, ${COLORS[index % COLORS.length]}05 100%)`
                }}
              >
                <div className="text-sm font-medium" style={{ color: COLORS[index % COLORS.length] }}>
                  {status}
                </div>
                <div className="mt-2 text-3xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                  {count}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}


