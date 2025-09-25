"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CompanyDashboardPage() {
  const { data: session } = useSession();
  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setJobCount((data.jobs || []).length);
        }
      } catch (e) {
        // ignore for demo
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
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
          <div className="text-sm text-base-content/70">Applications (demo)</div>
          <div className="mt-2 text-3xl font-bold">128</div>
          <div className="mt-1 text-xs text-base-content/60">Applicants across all active jobs</div>
        </div>
        <div className="rounded-xl border border-base-300 p-4 bg-base-100">
          <div className="text-sm text-base-content/70">Candidates in Pipeline (demo)</div>
          <div className="mt-2 text-3xl font-bold">37</div>
          <div className="mt-1 text-xs text-base-content/60">Screening, interview, and offer stages</div>
        </div>
      </section>

      <section className="bg-base-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="/dashboard/company/post-job" className="btn btn-primary">Post a Job</a>
          <a href="/dashboard/company/jobs" className="btn btn-outline">My Job Posts</a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Activity (demo)</h2>
        <ul className="timeline timeline-vertical timeline-compact">
          <li>
            <div className="timeline-start">Now</div>
            <div className="timeline-middle">⚡</div>
            <div className="timeline-end timeline-box">Interview scheduled with 3 candidates</div>
          </li>
          <li>
            <div className="timeline-start">2h</div>
            <div className="timeline-middle">📨</div>
            <div className="timeline-end timeline-box">15 new applications for Frontend Engineer</div>
          </li>
          <li>
            <div className="timeline-start">Yesterday</div>
            <div className="timeline-middle">📣</div>
            <div className="timeline-end timeline-box">Job “Backend Engineer” published</div>
          </li>
        </ul>
      </section>
    </div>
  );
}

