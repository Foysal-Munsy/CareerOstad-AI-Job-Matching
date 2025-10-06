"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
export default function MatchSkillPage() {
  const [inputSkill, setInputSkill] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!inputSkill.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Skill",
        text: "Please enter at least one skill.",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/match-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputSkill }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Error matching skills:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch",
        text: "Failed to fetch matching jobs. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
        🔍 Match Your Skill
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter your skills (comma separated)"
          value={inputSkill}
          onChange={(e) => setInputSkill(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          onClick={handleMatch}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Matching..." : "Find Jobs"}
        </button>
      </div>

      <div>
        {loading && <p className="text-gray-500">Searching jobs...</p>}

        {!loading && matches.length === 0 && (
          <p className="text-gray-500">
            No matches yet. Enter skills to see results.
          </p>
        )}

        {matches.length > 0 && (
          <ul className="space-y-4">
            {matches.map((job) => (
              <li
                key={job._id}
                className="p-5 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-lg">{job.title}</h2>
                  <span
                    className={`text-sm font-semibold ${
                      job.matchPercent > 80
                        ? "text-green-600"
                        : job.matchPercent > 50
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    {job.matchPercent}% Match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Required Skills: {job.skills.join(", ")}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      job.matchPercent > 80
                        ? "bg-green-500"
                        : job.matchPercent > 50
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                    style={{ width: `${job.matchPercent}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
