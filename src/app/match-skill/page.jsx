'use client';
import React, { useState } from 'react';

const jobsData = [
  {
    id: 1,
    title: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'CSS'],
  },
  {
    id: 2,
    title: 'Backend Developer',
    skills: ['Node.js', 'Express', 'MongoDB'],
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'MongoDB', 'CSS'],
  },
];

export default function MatchSkillPage() {
  const [inputSkill, setInputSkill] = useState('');
  const [matches, setMatches] = useState([]);

  const handleMatch = () => {
    const skillArray = inputSkill.split(',').map(s => s.trim().toLowerCase());
    const matchedJobs = jobsData.filter(job =>
      job.skills.some(skill => skillArray.includes(skill.toLowerCase()))
    );
    setMatches(matchedJobs);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-primary mb-6">
        🔍 Match Your Skill
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter your skills (comma separated)"
          value={inputSkill}
          onChange={e => setInputSkill(e.target.value)}
          className="input input-bordered w-full"
        />
        <button onClick={handleMatch} className="btn btn-primary">
          Find Jobs
        </button>
      </div>

      <div>
        {matches.length > 0 ? (
          <ul className="space-y-3">
            {matches.map(job => (
              <li
                key={job.id}
                className="p-4 border rounded-lg shadow hover:bg-gray-50"
              >
                <h2 className="font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-600">
                  Required: {job.skills.join(', ')}
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
