"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaUsers, FaBuilding, FaBriefcase, FaFileAlt, FaSyncAlt, FaChartLine, FaCog } from "react-icons/fa";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ users: 0, companies: 0, activeJobs: 0, applications: 0 });

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load admin stats");
        }
        const data = await res.json();
        const s = data?.stats || {};
        setStats({
          users: s.users || 0,
          companies: s.companies || 0,
          activeJobs: s.activeJobs || 0,
          applications: s.applications || 0,
        });
      } catch (e) {
        setError("Could not fetch admin stats");
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchStats();
    }
  }, [status, session?.user?.role]);

  if (status === "loading") {
    return <div className="p-4">Loading...</div>;
  }

  if (!session || session.user?.role !== "admin") {
    return <div className="p-4">Unauthorized</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-base-content/70">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}.</p>
        </div>
        <button
          onClick={() => location.reload()}
          className="btn btn-sm btn-primary gap-2"
          aria-label="Refresh overview"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {error ? (
        <div className="alert alert-error text-sm">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={loading ? "-" : String(stats.users)}
          desc="All registered accounts"
          icon={FaUsers}
          gradient="from-primary/20 via-primary/10 to-transparent"
          accent="text-primary"
        />
        <StatCard
          title="Companies"
          value={loading ? "-" : String(stats.companies)}
          desc="Organizations hiring"
          icon={FaBuilding}
          gradient="from-warning/20 via-warning/10 to-transparent"
          accent="text-warning"
        />
        <StatCard
          title="Active Jobs"
          value={loading ? "-" : String(stats.activeJobs)}
          desc="Open positions"
          icon={FaBriefcase}
          gradient="from-success/20 via-success/10 to-transparent"
          accent="text-success"
        />
        <StatCard
          title="Applications"
          value={loading ? "-" : String(stats.applications)}
          desc="Total submissions"
          icon={FaFileAlt}
          gradient="from-info/20 via-info/10 to-transparent"
          accent="text-info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-base-200/40 via-transparent to-transparent" />
          <div className="flex items-center gap-2">
            <FaChartLine className="text-primary" />
            <h2 className="text-lg font-semibold">Insights</h2>
          </div>
          <p className="text-sm text-base-content/70 mt-1">High-level overview of platform activity.</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniKpi label="Conversion" value={loading ? "-" : "42%"} trend="up" />
            <MiniKpi label="Avg. Apps/Job" value={loading ? "-" : "18"} trend="up" />
            <MiniKpi label="New Users" value={loading ? "-" : "+128"} trend="up" />
            <MiniKpi label="Bounce" value={loading ? "-" : "21%"} trend="down" />
          </div>
          <div className="mt-6 h-36 rounded-lg bg-base-200/60 flex items-center justify-center text-xs text-base-content/60">
            Simple chart placeholder
          </div>
        </div>
        <div className="rounded-xl border border-base-300 bg-base-100 p-4">
          <div className="flex items-center gap-2">
            <FaCog className="text-info" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <p className="text-sm text-base-content/70 mt-1">Common admin tasks at your fingertips.</p>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <a className="btn btn-sm btn-primary" href="/dashboard/admin/users">Manage Users</a>
            <a className="btn btn-sm btn-success" href="/dashboard/admin/jobs">Review Jobs</a>
            <a className="btn btn-sm btn-warning" href="/dashboard/admin/roles">Role Settings</a>
            <a className="btn btn-sm btn-info" href="/dashboard/admin/advice">Advice Content</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, icon: Icon, gradient, accent }) {
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
          <div className="text-xs text-base-content/60 mt-0.5">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function MiniKpi({ label, value, trend }) {
  const isUp = trend === "up";
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-3">
      <div className="text-xs text-base-content/60">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <div className="text-lg font-semibold">{value}</div>
        <span className={`badge badge-xs ${isUp ? "badge-success" : "badge-error"}`}>{isUp ? "▲" : "▼"}</span>
      </div>
    </div>
  );
}


