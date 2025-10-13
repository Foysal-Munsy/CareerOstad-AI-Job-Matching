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
      const res = await fetch('/api/match-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRequirement: query })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to search');
      }
      setResults(Array.isArray(data) ? data : []);
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
    <div className="min-h-screen">
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/company" className="btn btn-ghost btn-circle">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-base-content">Search Talent</h1>
                <p className="text-base-content/70">Find candidates matching your job requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-base-100 rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-3">
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
            <div>
              <label className="label"><span className="label-text">Location</span></label>
              <input
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                placeholder="Any"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label"><span className="label-text">Min match %</span></label>
              <input
                type="number"
                value={minMatch}
                min={0}
                max={100}
                onChange={e => setMinMatch(Number(e.target.value))}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <button className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`} onClick={runSearch}>
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

        {/* Results */}
        {!loading && filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧑‍💼</div>
            <h3 className="text-2xl font-bold mb-2">No candidates found</h3>
            <p className="text-base-content/70">Try broadening your skills or lowering min match.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div key={c._id} className="bg-base-100 rounded-xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
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
                  <div className="text-right">
                    <div className="badge badge-primary">{c.matchPercent || 0}% match</div>
                  </div>
                </div>

                {Array.isArray(c.skills) && c.skills.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-medium mb-2 flex items-center gap-2"><FaTools className="w-3 h-3" /> Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {c.skills.slice(0, 8).map((s, idx) => (
                        <span key={idx} className="badge badge-ghost badge-sm">{s}</span>
                      ))}
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

                <div className="mt-5 flex items-center gap-2">
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="btn btn-outline btn-sm">
                      <FaEnvelope className="w-4 h-4" /> Email
                    </a>
                  )}
                  {c.email && (
                    <Link href={`/dashboard/company/candidate-profile/${c.email}`} className="btn btn-primary btn-sm">
                      <FaUserTie className="w-4 h-4" /> View Profile
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


