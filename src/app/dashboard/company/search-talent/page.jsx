'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FaSearch, FaUserTie, FaMapMarkerAlt, FaEnvelope, FaSpinner, 
  FaTools, FaGraduationCap, FaAward, FaUser, FaFilter, FaArrowLeft
} from 'react-icons/fa';

export default function SearchTalentPage() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState('react, node, mongodb');
  const [locationFilter, setLocationFilter] = useState('');
  const [minMatch, setMinMatch] = useState(40);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  const isCompany = session?.user?.role === 'company' || session?.user?.role === 'admin';

  const filtered = useMemo(() => {
    return results
      .filter(c => (typeof minMatch === 'number' ? (c.matchPercent || 0) >= minMatch : true))
      .filter(c => !locationFilter || (c.location || '').toLowerCase().includes(locationFilter.toLowerCase()));
  }, [results, minMatch, locationFilter]);

  async function runSearch() {
    try {
      setError('');
      setLoading(true);
      const trimmedQuery = (query || '').trim();
      if (!trimmedQuery) {
        throw new Error('Please enter at least one skill or keyword');
      }
      const res = await fetch('/api/match-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRequirement: trimmedQuery })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to search');
      }
      const candidates = Array.isArray(data?.candidates)
        ? data.candidates
        : Array.isArray(data)
          ? data
          : [];
      setResults(candidates);
    } catch (e) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && isCompany) {
      runSearch();
    }
  }, [status, isCompany]);

  function getSkillLabel(skill) {
    if (typeof skill === 'string') return skill;
    if (skill && typeof skill === 'object') {
      const { name, skill: skillName, title, category, level } = skill;
      const base = name || skillName || title || category || '';
      if (base && level) return `${base} (${level})`;
      return base || 'Skill';
    }
    return 'Skill';
  }

  function getBadgeColor(idx) {
    const palette = [
      'badge-primary',
      'badge-secondary',
      'badge-accent',
      'badge-info',
      'badge-success',
      'badge-warning',
      'badge-error',
      'badge-ghost'
    ];
    return palette[idx % palette.length];
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!isCompany) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-2xl font-bold">Restricted</h2>
          <p className="text-base-content/70 mt-1">Only company users can access Search Talent.</p>
          <Link href="/dashboard" className="btn btn-primary btn-sm mt-4">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-base-100">
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/company" className="btn btn-ghost btn-circle">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Search Talent</h1>
                <p className="text-base-content/70">Find candidates matching your job requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl p-[1px] bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40 mb-6">
          <div className="bg-base-100 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2 lg:col-span-3">
              <label className="label"><span className="label-text">Required skills/keywords (comma separated)</span></label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 w-4 h-4" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. react, next.js, node, mongodb, tailwind"
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label className="label"><span className="label-text">Location</span></label>
              <input
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                placeholder="Any"
                className="input input-bordered w-full"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="label"><span className="label-text">Min match %</span></label>
              <input
                type="number"
                value={Number.isFinite(minMatch) ? minMatch : 0}
                min={0}
                max={100}
                onChange={e => {
                  const parsed = parseInt(e.target.value, 10);
                  if (Number.isNaN(parsed)) {
                    setMinMatch(0);
                  } else {
                    const bounded = Math.min(100, Math.max(0, parsed));
                    setMinMatch(bounded);
                  }
                }}
                className="input input-bordered w-full"
                aria-label="Minimum match percentage"
              />
            </div>
            <div className="sm:col-span-1">
              <button className={`btn btn-primary w-full shadow-md`} onClick={runSearch} disabled={loading} aria-busy={loading}>
                {loading ? <><FaSpinner className="w-4 h-4 animate-spin" /> Searching...</> : <><FaSearch className="w-4 h-4" /> Search</>}
              </button>
            </div>
          </div>
          {error && (
            <div className="alert alert-error mt-4">
              <FaFilter className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          </div>
        </div>

        {/* Results */}
        {!loading && filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧑‍💼</div>
            <h3 className="text-2xl font-bold mb-2">No candidates found</h3>
            <p className="text-base-content/70">Try broadening your skills or lowering min match.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((c, idx) => (
              <div key={c._id || c.email || idx} className="rounded-2xl p-[1px] bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 hover:from-primary/50 hover:via-accent/50 hover:to-secondary/50 transition">
                <div className="bg-base-100 rounded-2xl shadow-sm p-4 md:p-5 hover:shadow-xl transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center ring-2 ring-primary/20">
                      <FaUser className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-base font-semibold">{c.name || 'Unnamed Candidate'}</div>
                      {c.professionalTitle ? (
                        <div className="text-xs text-base-content/70">{c.professionalTitle}</div>
                      ) : null}
                      {c.location ? (
                        <div className="text-xs text-base-content/70 flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span>{c.location}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="sm:text-right sm:ml-auto mt-2 sm:mt-0">
                      <div className="badge badge-primary">{c.matchPercent || 0}% match</div>
                  </div>
                </div>

                {Array.isArray(c.skills) && c.skills.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-medium mb-2 flex items-center gap-2"><FaTools className="w-3 h-3" /> Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {c.skills.slice(0, 10).map((s, sidx) => {
                        const label = getSkillLabel(s);
                        return (
                          <span key={`${label}-${sidx}`} className={`badge ${getBadgeColor(sidx)} badge-sm`}>{label}</span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {Array.isArray(c.education) && c.education.length > 0 && (
                  <div className="mt-3 text-xs text-base-content/70 flex items-center gap-2">
                    <FaGraduationCap className="w-3 h-3" />
                    <span>{c.education[0]?.degree || c.education[0]?.institution || 'Education available'}</span>
                  </div>
                )}

                {Array.isArray(c.certifications) && c.certifications.length > 0 && (
                  <div className="mt-2 text-xs text-base-content/70 flex items-center gap-2">
                    <FaAward className="w-3 h-3" />
                    <span>{c.certifications[0]?.name || 'Certification'}</span>
                  </div>
                )}

                  <div className="mt-4">
                    <progress className="progress progress-primary w-full" value={c.matchPercent || 0} max="100"></progress>
                  </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="btn btn-outline btn-sm w-full sm:w-auto">
                      <FaEnvelope className="w-4 h-4" /> Email
                    </a>
                  )}
                  {c.email && (
                    <Link href={`/dashboard/company/candidate-profile/${c.email}`} className="btn btn-primary btn-sm w-full sm:w-auto">
                      <FaUserTie className="w-4 h-4" /> View Profile
                    </Link>
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


