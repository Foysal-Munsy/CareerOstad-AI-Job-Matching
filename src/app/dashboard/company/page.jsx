"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CompanyDashboardPage() {
  const { data: session } = useSession();
  const [jobCount, setJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch("/api/jobs", { cache: "no-store" }),
          fetch("/api/company/applications", { cache: "no-store" })
        ]);
        const [jobsData, appsData] = await Promise.all([jobsRes.json(), appsRes.json()]);
        if (jobsRes.ok) setJobCount((jobsData.jobs || []).length);
        if (appsRes.ok && appsData.success) setApplicationCount((appsData.applications || []).length);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Home</h1>
        <p className="mt-1 text-base-content/70">Welcome{session?.user?.name ? `, ${session.user.name}` : ""}.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-base-300 p-4 bg-base-100">
          <div className="text-sm text-base-content/70">Total Job Posts</div>
          <div className="mt-2 text-3xl font-bold">{loading ? "-" : jobCount}</div>
          <div className="mt-1 text-xs text-base-content/60">Live openings created by your company</div>
        </div>
        <div className="rounded-xl border border-base-300 p-4 bg-base-100">
          <div className="text-sm text-base-content/70">Applications</div>
          <div className="mt-2 text-3xl font-bold">{loading ? '-' : applicationCount}</div>
          <div className="mt-1 text-xs text-base-content/60">Applicants across all jobs</div>
        </div>
        <div className="rounded-xl border border-base-300 p-4 bg-base-100">
          <div className="text-sm text-base-content/70">Interviews Scheduled</div>
          <div className="mt-2 text-3xl font-bold">{loading ? '-' : 0}</div>
          <div className="mt-1 text-xs text-base-content/60">Coming soon</div>
        </div>
      </section>

      <section className="bg-base-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="/dashboard/company/post-job" className="btn btn-primary">Post a Job</a>
          <a href="/dashboard/company/jobs" className="btn btn-outline">My Job Posts</a>
        </div>
      </section>

      {/* Recent Activity could be populated from applications later */}
    </div>
  );
}

