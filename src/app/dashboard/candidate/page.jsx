"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  FaBell,
  FaFileAlt,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaSearch
} from "react-icons/fa";
import { 
  HiOutlineLightningBolt,
  HiOutlineAcademicCap,
  HiOutlineSparkles
} from "react-icons/hi";

export default function CandidateDashboardPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.email) return;
      setLoading(true);
      setError("");
      try {
        const [appsRes, savedRes] = await Promise.all([
          fetch('/api/applications', { cache: 'no-store' }),
          fetch('/api/saved-jobs', { cache: 'no-store' })
        ]);
        const [appsData, savedData] = await Promise.all([appsRes.json(), savedRes.json()]);
        if (!appsRes.ok) throw new Error(appsData?.error || 'Failed to load applications');
        if (!savedRes.ok) throw new Error(savedData?.error || 'Failed to load saved jobs');
        setApplications(appsData.applications || []);
        setSaved(savedData.saved || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session?.user?.email]);

  const stats = useMemo(() => ({
    applications: applications.length,
    interviews: applications.filter(a => a.status === 'Interview Scheduled').length,
    saved: saved.length
  }), [applications, saved]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}! 👋
            </h1>
            <p className="text-base-content/70 mt-2 text-lg">
              Track your real applications and saved jobs.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid (real data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Applications</p>
              <p className="text-2xl font-bold text-primary">{stats.applications}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FaFileAlt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-primary">{stats.interviews}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FaCalendarAlt className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Saved Jobs</p>
              <p className="text-2xl font-bold text-primary">{stats.saved}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <HiOutlineSparkles className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Notifications</p>
              <p className="text-2xl font-bold text-primary">0</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <FaBell className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaFileAlt className="w-5 h-5 text-primary" />
                Recent Applications
              </h2>
              <Link href="/dashboard/candidate/applications" className="text-primary hover:underline text-sm font-medium">View All</Link>
            </div>
            <div className="p-6 space-y-3">
              {loading ? (
                <div className="text-base-content/70">Loading...</div>
              ) : applications.length === 0 ? (
                <div className="text-base-content/70">You have not applied to any jobs yet.</div>
              ) : (
                applications.slice(0, 5).map((app) => (
                  <div key={app._id} className="p-4 rounded-lg border border-base-300 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{app.job?.title || 'Job Title'}</div>
                      <div className="text-sm text-base-content/70">{app.job?.companyName} • Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                    <div className="badge badge-outline">{app.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HiOutlineLightningBolt className="w-5 h-5 text-primary" />
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {[
                { title: "Search Jobs", description: "Find your next opportunity", icon: FaSearch, href: "/jobs", color: "bg-blue-500" },
                { title: "Update Profile", description: "Keep your profile fresh", icon: FaEdit, href: "/dashboard/candidate/profile", color: "bg-green-500" },
                { title: "Build Resume", description: "Generate AI resume (Gemini)", icon: FaFileAlt, href: "/dashboard/candidate/resume-builder", color: "bg-purple-500" },
              ].map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-base-content/60">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Saved Jobs (Quick View) */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HiOutlineAcademicCap className="w-5 h-5 text-primary" />
                Saved Jobs
              </h2>
              <Link href="/dashboard/candidate/saved" className="text-primary hover:underline text-sm font-medium">View All</Link>
            </div>
            <div className="p-6 space-y-3">
              {loading ? (
                <div className="text-base-content/70">Loading...</div>
              ) : saved.length === 0 ? (
                <div className="text-base-content/70">You have no saved jobs.</div>
              ) : (
                saved.slice(0, 5).map((s) => (
                  <div key={`${s.userEmail}-${s.jobId}`} className="p-4 rounded-lg border border-base-300 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{s.job?.title || 'Job'}</div>
                      <div className="text-sm text-base-content/70">{s.job?.companyName}</div>
                    </div>
                    <Link href={`/jobs/${s.jobId}`} className="btn btn-ghost btn-sm">
                      <FaEye className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tips & Insights */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <FaBell className="w-5 h-5 text-primary" />
              Career Tip
            </h3>
            <p className="text-sm text-base-content/80">
              Keep your profile updated and apply promptly to increase your chances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


