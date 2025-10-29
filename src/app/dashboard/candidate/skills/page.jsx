"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FaChartLine, FaSearch, FaTags, FaBriefcase, FaStar, FaMapMarkerAlt } from "react-icons/fa";

export default function CandidateSkillsAssessmentPage() {
  const [skillsInput, setSkillsInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [minMatch, setMinMatch] = useState(0);
  const [query, setQuery] = useState("");

  const parsedSkills = useMemo(() => (
    skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  ), [skillsInput]);

  const filteredResults = useMemo(() => {
    return results
      .filter((r) => (minMatch ? r.matchPercent >= minMatch : true))
      .filter((r) => (
        query.trim().length === 0 ||
        (r.title || "").toLowerCase().includes(query.toLowerCase()) ||
        (r.companyName || "").toLowerCase().includes(query.toLowerCase())
      ));
  }, [results, minMatch, query]);

  const handleAssess = async (e) => {
    e.preventDefault();
    setError("");
    if (parsedSkills.length === 0) {
      setError("Please enter at least one skill.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/match-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputSkill: skillsInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to assess skills");
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkills = async () => {
    setError("");
    setSaveMsg("");
    if (parsedSkills.length === 0) {
      setError("Add some skills first to save.");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: parsedSkills }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || "Failed to save skills");
      setSaveMsg("Skills saved to profile.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <FaChartLine className="w-7 h-7" /> Skills Assessment
          </h1>
          <p className="text-base-content/60 mt-1">Match your skills to real jobs and discover best-fit opportunities.</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleSaveSkills} className="btn btn-outline btn-sm" disabled={saving}>
              {saving ? "Saving..." : "Save Skills to Profile"}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleAssess} className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
        <div className="p-6 border-b border-base-300">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaTags className="w-5 h-5 text-primary" /> Enter your skills (comma-separated)
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="join w-full">
            <div className="join-item input input-bordered flex items-center gap-2 w-full">
              <FaSearch className="w-4 h-4 text-base-content/60" />
              <input
                className="grow bg-transparent outline-none"
                placeholder="e.g., React, Node.js, MongoDB, Tailwind"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </div>
            <button type="submit" className="join-item btn btn-primary" disabled={loading}>
              {loading ? "Assessing..." : "Assess Skills"}
            </button>
          </div>

          {parsedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsedSkills.map((s, idx) => (
                <span key={`${s}-${idx}`} className="badge badge-ghost">{s}</span>
              ))}
            </div>
          )}

          {error && <div className="alert alert-error text-sm">{error}</div>}
          {saveMsg && <div className="alert alert-success text-sm">{saveMsg}</div>}
        </div>
      </form>

      <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
        <div className="p-6 border-b border-base-300 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaBriefcase className="w-5 h-5 text-primary" /> Matched Jobs
          </h2>
          <div className="flex items-center gap-3">
            <div className="join">
              <div className="join-item input input-bordered input-sm flex items-center gap-2">
                <FaSearch className="w-3.5 h-3.5 text-base-content/60" />
                <input
                  className="grow bg-transparent outline-none"
                  placeholder="Search matches..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select className="join-item select select-bordered select-sm" value={minMatch} onChange={(e) => setMinMatch(Number(e.target.value))}>
                <option value={0}>All</option>
                <option value={25}>25%+</option>
                <option value={50}>50%+</option>
                <option value={75}>75%+</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-base-content/70">Loading results...</div>
        ) : results.length === 0 ? (
          <div className="p-10 text-center text-base-content/60">Run an assessment to see matched jobs.</div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((job) => (
              <div key={job._id} className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <h3 className="card-title text-lg">{job.title}</h3>
                    <span className={`badge ${job.matchPercent >= 75 ? 'badge-success' : job.matchPercent >= 50 ? 'badge-warning' : 'badge-ghost'}`}>
                      {job.matchPercent}% match
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70">{job.companyName || 'Company'}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-base-content/70">
                    {job.location && (
                      <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="w-3.5 h-3.5" /> {job.location}
                      </span>
                    )}
                    {job.rating > 0 && (
                      <span className="flex items-center gap-1.5">
                        <FaStar className="w-3.5 h-3.5 text-warning" /> {job.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Skill match</span>
                      <span>{job.matchPercent}%</span>
                    </div>
                    <progress className="progress progress-primary" value={job.matchPercent} max="100"></progress>
                  </div>
                  <div className="card-actions mt-4">
                    <Link href={`/jobs/${job._id}`} className="btn btn-primary btn-block">View Job</Link>
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


