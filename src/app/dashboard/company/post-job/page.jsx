"use client";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

export default function PostJobPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "Full-time",
    salaryMin: "",
    salaryMax: "",
    skills: "",
  });

  const titleOk = form.title.trim().length >= 6;
  const descriptionOk = form.description.trim().length >= 50;
  const salaryOk = useMemo(() => {
    const min = form.salaryMin ? Number(form.salaryMin) : undefined;
    const max = form.salaryMax ? Number(form.salaryMax) : undefined;
    if (min == null || max == null) return true;
    if (Number.isNaN(min) || Number.isNaN(max)) return false;
    return max >= min;
  }, [form.salaryMin, form.salaryMax]);

  async function handleSubmit(e) {
    e.preventDefault();
    const invalids = [];
    if (!titleOk) invalids.push("Title must be at least 6 characters");
    if (!descriptionOk) invalids.push("Description must be at least 50 characters");
    if (!salaryOk) invalids.push("Max salary must be greater than or equal to min salary");

    if (invalids.length) {
      Swal.fire({ icon: "warning", title: "Please fix the form", html: `<ul style='text-align:left'>${invalids.map(i => `<li>• ${i}</li>`).join("")}</ul>` });
      return;
    }

    const confirm = await Swal.fire({
      title: "Publish job?",
      text: "Your job will be visible to candidates immediately.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Publish",
    });
    if (!confirm.isConfirmed) return;

    setLoading(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      employmentType: form.employmentType,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create job");
      await Swal.fire({ icon: "success", title: "Job posted!", text: "Your job has been published." });
      setForm({ title: "", description: "", location: "", employmentType: "Full-time", salaryMin: "", salaryMax: "", skills: "" });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed to post", text: String(e.message || e) });
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const remainingDesc = Math.max(0, 5000 - form.description.length);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Post a Job</h1>
          <p className="mt-1 text-base-content/70">Craft a compelling job post with clear requirements.</p>
        </div>
        <a href="/dashboard/company/jobs" className="btn btn-sm btn-outline">My Posts</a>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm card-professional">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="label">
              <span className="label-text">Job title</span>
              {!titleOk ? <span className="label-text-alt text-error">Min 6 chars</span> : null}
            </label>
            <input
              name="title"
              value={form.title}
                onChange={onChange}
              className={`input input-bordered form-input w-full ${!titleOk && form.title ? "input-error" : ""}`}
              placeholder="e.g., Senior Frontend Engineer"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
              {!descriptionOk ? <span className="label-text-alt text-error">Min 50 chars</span> : <span className="label-text-alt">{remainingDesc} left</span>}
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className={`textarea textarea-bordered form-input w-full ${!descriptionOk && form.description ? "textarea-error" : ""}`}
              placeholder="Role overview, responsibilities, requirements, perks, etc."
              rows={8}
              required
              maxLength={5000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="label"><span className="label-text">Location</span></label>
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                className="input input-bordered form-input w-full"
                placeholder="Remote / Dhaka / Hybrid"
              />
            </div>
            <div>
              <label className="label"><span className="label-text">Employment type</span></label>
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={onChange}
                className="select select-bordered form-input w-full"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="label"><span className="label-text">Skills (comma-separated)</span></label>
              <input
                name="skills"
                value={form.skills}
                onChange={onChange}
                className="input input-bordered form-input w-full"
                placeholder="React, Node.js, MongoDB"
              />
              {form.skills ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.skills.split(',').map((s, i) => s.trim()).filter(Boolean).slice(0, 8).map((s, i) => (
                    <span key={i} className={`${i % 3 === 0 ? 'badge badge-primary' : i % 3 === 1 ? 'badge badge-secondary' : 'badge badge-accent'}`}>{s}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label"><span className="label-text">Salary min</span></label>
              <input
                type="number"
                name="salaryMin"
                value={form.salaryMin}
                onChange={onChange}
                className="input input-bordered form-input w-full"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Salary max</span>
                {!salaryOk && form.salaryMax ? <span className="label-text-alt text-error">Must be ≥ min</span> : null}
              </label>
              <input
                type="number"
                name="salaryMax"
                value={form.salaryMax}
                onChange={onChange}
                className={`input input-bordered form-input w-full ${!salaryOk && form.salaryMax ? "input-error" : ""}`}
                placeholder="0"
                min="0"
              />
              {(form.salaryMin || form.salaryMax) && salaryOk ? (
                <div className="mt-1 text-xs text-base-content/70">
                  Range: {form.salaryMin || 0} - {form.salaryMax || 0}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className={`btn btn-primary btn-professional ${loading ? 'btn-loading' : ''}`} disabled={loading}>
              {loading ? "Publishing..." : "Publish Job"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setForm({ title: "", description: "", location: "", employmentType: "Full-time", salaryMin: "", salaryMax: "", skills: "" })}
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}


