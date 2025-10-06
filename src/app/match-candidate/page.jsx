'use client';

import React, { useState } from 'react';

export default function MatchCandidatePage() {
  const [jobRequirement, setJobRequirement] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Function to fetch candidates
  const handleMatch = async () => {
    setErrorMsg('');
    setMatches([]);

    if (!jobRequirement.trim()) {
      setErrorMsg('⚠️ Please enter required skills before searching.');
      return;
    }

    setLoading(true);
    try {
      // Hitting the API route
      const res = await fetch('/api/match-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRequirement }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch candidates');
      }

      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setErrorMsg('❌ Something went wrong while fetching candidates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
        👩‍💻 Match Candidate
      </h1>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter required skills (comma separated, e.g. React, Node.js, MongoDB)"
          value={jobRequirement}
          onChange={e => setJobRequirement(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          onClick={handleMatch}
          className="btn btn-primary sm:w-auto"
          disabled={loading}
        >
          {loading ? 'Finding...' : 'Find Candidates'}
        </button>
      </div>

      {/* Error message */}
      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 mb-4 animate-pulse">
          🔍 Searching candidates...
        </p>
      )}

      {/* Results */}
      {!loading && matches.length === 0 && !errorMsg && (
        <p className="text-gray-500">
          No matches found yet. Try entering some skills to see results.
        </p>
      )}

      {matches.length > 0 && (
        <ul className="space-y-4">
          {matches.map(candidate => (
            <li
              key={candidate._id}
              className="p-5 border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">{candidate.name}</h2>
                <span
                  className={`text-sm font-semibold ${
                    candidate.matchPercent > 80
                      ? 'text-green-600'
                      : candidate.matchPercent > 50
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}
                >
                  {candidate.matchPercent}% Match
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Skills:{' '}
                {Array.isArray(candidate.skills)
                  ? candidate.skills.join(', ')
                  : 'No skills listed'}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    candidate.matchPercent > 80
                      ? 'bg-green-500'
                      : candidate.matchPercent > 50
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`}
                  style={{ width: `${candidate.matchPercent}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
