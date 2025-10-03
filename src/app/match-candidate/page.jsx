'use client';
import React, { useState } from 'react';

const candidatesData = [
  { id: 1, name: 'Rafiq', skills: ['React', 'Node.js'] },
  { id: 2, name: 'Salma', skills: ['Python', 'Django'] },
  { id: 3, name: 'Hasan', skills: ['MongoDB', 'Express', 'React'] },
];

export default function MatchCandidatePage() {
  const [jobRequirement, setJobRequirement] = useState('');
  const [matches, setMatches] = useState([]);

  const handleMatch = () => {
    const requiredSkills = jobRequirement
      .split(',')
      .map(s => s.trim().toLowerCase());
    const matchedCandidates = candidatesData.filter(candidate =>
      candidate.skills.some(skill =>
        requiredSkills.includes(skill.toLowerCase())
      )
    );
    setMatches(matchedCandidates);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-primary mb-6">
        👩‍💻 Match Candidate
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter required skills (comma separated)"
          value={jobRequirement}
          onChange={e => setJobRequirement(e.target.value)}
          className="input input-bordered w-full"
        />
        <button onClick={handleMatch} className="btn btn-primary">
          Find Candidates
        </button>
      </div>

      <div>
        {matches.length > 0 ? (
          <ul className="space-y-3">
            {matches.map(candidate => (
              <li
                key={candidate.id}
                className="p-4 border rounded-lg shadow hover:bg-gray-50"
              >
                <h2 className="font-semibold">{candidate.name}</h2>
                <p className="text-sm text-gray-600">
                  Skills: {candidate.skills.join(', ')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No matches yet. Enter skills to see results.
          </p>
        )}
      </div>
    </div>
  );
}
