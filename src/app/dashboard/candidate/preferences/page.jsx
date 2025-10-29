"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt, FaDollarSign, FaBriefcase, FaTags } from "react-icons/fa";

export default function CandidateJobPreferencesPage() {
  const [form, setForm] = useState({
    desiredRole: "",
    locations: "",
    salaryMin: "",
    salaryMax: "",
    jobTypes: [],
    skills: "",
  });

  const toggleJobType = (type) => {
    setForm((prev) => {
      const exists = prev.jobTypes.includes(type);
      return {
        ...prev,
        jobTypes: exists ? prev.jobTypes.filter((t) => t !== type) : [...prev.jobTypes, type],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit. Hook up to API when available.
  };

  const jobTypeOptions = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Job Preferences</h1>
          <p className="text-base-content/60 mt-1">Tell us what you are looking for to get better recommendations.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaBriefcase className="w-5 h-5 text-primary" />
                Role & Locations
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Desired Role/Title</span>
                </div>
                <input
                  name="desiredRole"
                  value={form.desiredRole}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., Frontend Developer"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-primary" /> Preferred Locations
                  </span>
                </div>
                <input
                  name="locations"
                  value={form.locations}
                  onChange={handleChange}
                  type="text"
                  placeholder="City names or Remote"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaDollarSign className="w-5 h-5 text-primary" />
                Compensation
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Minimum Salary (USD)</span>
                </div>
                <input
                  name="salaryMin"
                  value={form.salaryMin}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 40000"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Maximum Salary (USD)</span>
                </div>
                <input
                  name="salaryMax"
                  value={form.salaryMax}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 90000"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaTags className="w-5 h-5 text-primary" />
                Skills & Keywords
              </h2>
            </div>
            <div className="p-6">
              <textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="textarea textarea-bordered w-full min-h-28"
                placeholder="Comma-separated skills, tools, or keywords"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h3 className="text-lg font-bold">Job Type</h3>
            </div>
            <div className="p-6 space-y-3">
              {jobTypeOptions.map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={form.jobTypes.includes(type)}
                    onChange={() => toggleJobType(type)}
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
            <button type="submit" className="btn btn-primary w-full">Save Preferences</button>
          </div>
        </div>
      </form>
    </div>
  );
}


