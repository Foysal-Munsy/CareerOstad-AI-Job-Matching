"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CandidateSavedJobsPage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState({});

  useEffect(() => {
    async function fetchSaved() {
      if (!session?.user?.email) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/api/saved-jobs', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load');
        setSaved(data.saved || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, [session?.user?.email]);

  const handleRemove = async (jobId) => {
    if (!jobId) return;
    setRemoving(prev => ({ ...prev, [jobId]: true }));
    try {
      const res = await fetch(`/api/saved-jobs?jobId=${encodeURIComponent(jobId)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaved(prev => prev.filter(s => s.jobId !== jobId));
      }
    } finally {
      setRemoving(prev => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Saved Jobs</h1>
          <p className="text-base-content/70">Review and apply to jobs you saved for later.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : saved.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold mb-2">No saved jobs yet</h3>
            <p className="text-base-content/70 mb-4">Save jobs you like to view and apply later.</p>
            <Link href="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {saved.map((s) => (
              <div key={`${s.userEmail}-${s.jobId}`} className="card bg-base-100 shadow">
                <div className="card-body">
                  <h2 className="card-title">{s.job?.title || 'Job'}</h2>
                  <p className="text-primary font-semibold">{s.job?.companyName}</p>
                  <p className="text-sm text-base-content/70 line-clamp-3">{s.job?.overview}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-base-content/50">Saved {new Date(s.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Link href={`/jobs/${s.jobId}`} className="btn btn-primary btn-sm">View</Link>
                      <Link href={`/jobs/${s.jobId}`} className="btn btn-success btn-sm">Apply</Link>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleRemove(s.jobId)}
                        disabled={!!removing[s.jobId]}
                        title="Remove from saved"
                      >
                        {removing[s.jobId] ? 'Removing...' : 'Remove'}
                      </button>
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


