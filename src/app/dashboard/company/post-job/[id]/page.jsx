"use client";
import React, { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function EditJobPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [form, setForm] = useState({
    title: "",
    category: "",
    employmentType: "Full-time",
    jobLevel: "Mid-level",
    overview: "",
    requirements: "",
    preferredQualifications: "",
    toolsTechnologies: "",
    location: "",
    workMode: "On-site",
    salaryMin: "",
    salaryMax: "",
    salaryType: "BDT",
    isNegotiable: false,
    perksBenefits: "",
    applicationDeadline: "",
    howToApply: "Website",
    applicationUrl: "",
    applicationEmail: "",
    numberOfVacancies: 1,
    experienceRequired: "",
    educationRequired: "",
    genderPreference: "",
    ageLimit: "",
    tags: "",
    status: "open"
  });

  const titleOk = form.title && form.title.trim().length >= 6;
  const overviewOk = form.overview && form.overview.trim().length >= 50;
  const requirementsOk = form.requirements && form.requirements.trim().length >= 30;
  const salaryOk = useMemo(() => {
    const min = form.salaryMin ? Number(form.salaryMin) : undefined;
    const max = form.salaryMax ? Number(form.salaryMax) : undefined;
    if (min == null || max == null) return true;
    if (Number.isNaN(min) || Number.isNaN(max)) return false;
    return max >= min;
  }, [form.salaryMin, form.salaryMax]);
  const deadlineOk = form.applicationDeadline ? new Date(form.applicationDeadline) > new Date() : true;

  // Fetch job data if editing
  useEffect(() => {
    if (!id) return;

    async function fetchJob() {
      setFetching(true);
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch job");
        
        const job = data.job;
        setForm({
          title: job.title || "",
          category: job.category || "",
          employmentType: job.employmentType || "Full-time",
          jobLevel: job.jobLevel || "Mid-level",
          overview: job.overview || "",
          requirements: job.requirements || "",
          preferredQualifications: job.preferredQualifications || "",
          toolsTechnologies: job.toolsTechnologies ? job.toolsTechnologies.join(", ") : "",
          location: job.location || "",
          workMode: job.workMode || "On-site",
          salaryMin: job.salaryMin ? job.salaryMin.toString() : "",
          salaryMax: job.salaryMax ? job.salaryMax.toString() : "",
          salaryType: job.salaryType || "BDT",
          isNegotiable: job.isNegotiable || false,
          perksBenefits: job.perksBenefits || "",
          applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : "",
          howToApply: job.howToApply || "Website",
          applicationUrl: job.applicationUrl || "",
          applicationEmail: job.applicationEmail || "",
          numberOfVacancies: job.numberOfVacancies || 1,
          experienceRequired: job.experienceRequired || "",
          educationRequired: job.educationRequired || "",
          genderPreference: job.genderPreference || "",
          ageLimit: job.ageLimit || "",
          tags: job.tags ? job.tags.join(", ") : "",
          status: job.status || "open"
        });
      } catch (e) {
        Swal.fire({ icon: "error", title: "Failed to load job", text: String(e.message || e) });
        router.push("/dashboard/company/jobs");
      } finally {
        setFetching(false);
      }
    }

    fetchJob();
  }, [id, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    const invalids = [];
    if (!titleOk) invalids.push("Job title must be at least 6 characters");
    if (!form.category) invalids.push("Job category is required");
    if (!overviewOk) invalids.push("Job overview must be at least 50 characters");
    if (!requirementsOk) invalids.push("Key requirements must be at least 30 characters");
    if (!salaryOk) invalids.push("Max salary must be greater than or equal to min salary");
    if (!deadlineOk) invalids.push("Application deadline must be in the future");
    if (form.howToApply === "Website" && !form.applicationUrl) invalids.push("Application URL is required when using Website application method");
    if (form.howToApply === "Email" && !form.applicationEmail) invalids.push("Application email is required when using Email application method");

    if (invalids.length) {
      Swal.fire({ icon: "warning", title: "Please fix the form", html: `<ul style='text-align:left'>${invalids.map(i => `<li>• ${i}</li>`).join("")}</ul>` });
      return;
    }

    const confirm = await Swal.fire({
      title: id ? "Update job?" : "Publish job?",
      text: id ? "Your job will be updated with the new information." : "Your job will be visible to candidates immediately.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: id ? "Update" : "Publish",
    });
    if (!confirm.isConfirmed) return;

    setLoading(true);
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      employmentType: form.employmentType,
      jobLevel: form.jobLevel,
      overview: form.overview.trim(),
      requirements: form.requirements.trim(),
      preferredQualifications: form.preferredQualifications.trim(),
      toolsTechnologies: form.toolsTechnologies.split(",").map((s) => s.trim()).filter(Boolean),
      location: form.location.trim(),
      workMode: form.workMode,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      salaryType: form.salaryType,
      isNegotiable: form.isNegotiable,
      perksBenefits: form.perksBenefits.trim(),
      applicationDeadline: form.applicationDeadline ? new Date(form.applicationDeadline) : null,
      howToApply: form.howToApply,
      applicationUrl: form.applicationUrl.trim(),
      applicationEmail: form.applicationEmail.trim(),
      numberOfVacancies: Number(form.numberOfVacancies),
      experienceRequired: form.experienceRequired.trim(),
      educationRequired: form.educationRequired.trim(),
      genderPreference: form.genderPreference.trim(),
      ageLimit: form.ageLimit.trim(),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      status: form.status
    };

    try {
      const url = id ? `/api/jobs/${id}` : "/api/jobs";
      const method = id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to ${id ? 'update' : 'create'} job`);
      
      await Swal.fire({ 
        icon: "success", 
        title: id ? "Job updated!" : "Job posted!", 
        text: id ? "Your job has been updated." : "Your job has been published." 
      });
      router.push("/dashboard/company/jobs");
    } catch (e) {
      Swal.fire({ icon: "error", title: `Failed to ${id ? 'update' : 'post'}`, text: String(e.message || e) });
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const remainingDesc = Math.max(0, 2000 - (form.overview ? form.overview.length : 0));

  if (fetching) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-base-content/70">Loading job data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">{id ? "Edit Job" : "Post a Job"}</h1>
          <p className="mt-1 text-base-content/70">
            {id ? "Update your job post with new information." : "Craft a compelling job post with clear requirements."}
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/dashboard/company/jobs" className="btn btn-sm btn-outline">My Posts</a>
          {!id && <a href="/dashboard/company/post-job" className="btn btn-sm btn-outline">New Job</a>}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm card-professional">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Basic Job Details */}
          <div className="divider text-lg font-semibold">Basic Job Details</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Job Title (Required)</span>
                {!titleOk ? <span className="label-text-alt text-error">Min 6 chars</span> : null}
              </label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className={`input input-bordered w-full ${!titleOk && form.title ? "input-error" : ""}`}
                placeholder="e.g., MERN Stack Developer"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Job Category / Department</span>
                {!form.category ? <span className="label-text-alt text-error">Required</span> : null}
              </label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select Category</option>
                <option>IT & Software</option>
                <option>Finance & Banking</option>
                <option>Marketing & Sales</option>
                <option>Human Resources</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Business</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text">Employment Type</span></label>
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={onChange}
                className="select select-bordered w-full"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Remote</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="label"><span className="label-text">Job Level</span></label>
              <select
                name="jobLevel"
                value={form.jobLevel}
                onChange={onChange}
                className="select select-bordered w-full"
              >
                <option>Entry-level</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Lead</option>
                <option>Executive</option>
              </select>
            </div>
          </div>

          {/* Job Description */}
          <div className="divider text-lg font-semibold">Job Description</div>
          
          <div>
            <label className="label">
              <span className="label-text">Overview / Responsibilities (Required)</span>
              {!overviewOk ? <span className="label-text-alt text-error">Min 50 chars</span> : <span className="label-text-alt">{Math.max(0, 2000 - (form.overview ? form.overview.length : 0))} left</span>}
            </label>
            <textarea
              name="overview"
              value={form.overview}
              onChange={onChange}
              className={`textarea textarea-bordered w-full ${!overviewOk && form.overview ? "textarea-error" : ""}`}
              placeholder="Describe the role, key responsibilities, and what the candidate will be doing..."
              rows={6}
              required
              maxLength={2000}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Key Requirements / Skills (Required)</span>
              {!requirementsOk ? <span className="label-text-alt text-error">Min 30 chars</span> : null}
            </label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={onChange}
              className={`textarea textarea-bordered w-full ${!requirementsOk && form.requirements ? "textarea-error" : ""}`}
              placeholder="List the essential skills, qualifications, and requirements..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="label"><span className="label-text">Preferred Qualifications (Optional)</span></label>
            <textarea
              name="preferredQualifications"
              value={form.preferredQualifications}
              onChange={onChange}
              className="textarea textarea-bordered w-full"
              placeholder="Additional qualifications that would be nice to have..."
              rows={3}
            />
          </div>

          <div>
            <label className="label"><span className="label-text">Tools & Technologies</span></label>
            <input
              name="toolsTechnologies"
              value={form.toolsTechnologies}
              onChange={onChange}
              className="input input-bordered w-full"
              placeholder="React, Node.js, MongoDB, AWS, Docker..."
            />
            {form.toolsTechnologies ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.toolsTechnologies.split(',').map((s, i) => s.trim()).filter(Boolean).slice(0, 10).map((s, i) => (
                  <span key={i} className={`badge ${i % 3 === 0 ? 'badge-primary' : i % 3 === 1 ? 'badge-secondary' : 'badge-accent'}`}>{s}</span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Job Location & Mode */}
          <div className="divider text-lg font-semibold">Job Location & Mode</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text">Office Location (City, Country)</span></label>
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                className="input input-bordered w-full"
                placeholder="e.g., Dhaka, Bangladesh"
              />
            </div>
            <div>
              <label className="label"><span className="label-text">Work Mode</span></label>
              <select
                name="workMode"
                value={form.workMode}
                onChange={onChange}
                className="select select-bordered w-full"
              >
                <option>On-site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          {/* Salary & Benefits */}
          <div className="divider text-lg font-semibold">Salary & Benefits</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label"><span className="label-text">Salary Min</span></label>
              <input
                type="number"
                name="salaryMin"
                value={form.salaryMin}
                onChange={onChange}
                className="input input-bordered w-full"
                placeholder="30000"
                min="0"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Salary Max</span>
                {!salaryOk && form.salaryMax ? <span className="label-text-alt text-error">Must be ≥ min</span> : null}
              </label>
              <input
                type="number"
                name="salaryMax"
                value={form.salaryMax}
                onChange={onChange}
                className={`input input-bordered w-full ${!salaryOk && form.salaryMax ? "input-error" : ""}`}
                placeholder="50000"
                min="0"
              />
            </div>
            <div>
              <label className="label"><span className="label-text">Currency</span></label>
              <select
                name="salaryType"
                value={form.salaryType}
                onChange={onChange}
                className="select select-bordered w-full"
              >
                <option>BDT</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                name="isNegotiable"
                checked={form.isNegotiable}
                onChange={(e) => setForm(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                className="checkbox checkbox-primary"
              />
              <span className="label-text">Salary is negotiable</span>
            </label>
          </div>

          <div>
            <label className="label"><span className="label-text">Perks & Benefits</span></label>
            <textarea
              name="perksBenefits"
              value={form.perksBenefits}
              onChange={onChange}
              className="textarea textarea-bordered w-full"
              placeholder="Health Insurance, Bonus, Flexible Hours, Remote Work, etc."
              rows={3}
            />
          </div>

          {/* Application Info */}
          <div className="divider text-lg font-semibold">Application Information</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Application Deadline (Required)</span>
                {!deadlineOk ? <span className="label-text-alt text-error">Must be future date</span> : null}
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={form.applicationDeadline}
                onChange={onChange}
                className={`input input-bordered w-full ${!deadlineOk && form.applicationDeadline ? "input-error" : ""}`}
                required
              />
            </div>
            <div>
              <label className="label"><span className="label-text">Number of Vacancies</span></label>
              <input
                type="number"
                name="numberOfVacancies"
                value={form.numberOfVacancies}
                onChange={onChange}
                className="input input-bordered w-full"
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="label"><span className="label-text">How to Apply</span></label>
            <select
              name="howToApply"
              value={form.howToApply}
              onChange={onChange}
              className="select select-bordered w-full"
            >
              <option>Website</option>
              <option>Email</option>
              <option>Both</option>
            </select>
          </div>

          {form.howToApply === "Website" || form.howToApply === "Both" ? (
            <div>
              <label className="label">
                <span className="label-text">Application URL</span>
                {form.howToApply === "Website" && !form.applicationUrl ? <span className="label-text-alt text-error">Required</span> : null}
              </label>
              <input
                type="url"
                name="applicationUrl"
                value={form.applicationUrl}
                onChange={onChange}
                className={`input input-bordered w-full ${form.howToApply === "Website" && !form.applicationUrl ? "input-error" : ""}`}
                placeholder="https://company.com/careers/apply"
              />
            </div>
          ) : null}

          {form.howToApply === "Email" || form.howToApply === "Both" ? (
            <div>
              <label className="label">
                <span className="label-text">Application Email</span>
                {form.howToApply === "Email" && !form.applicationEmail ? <span className="label-text-alt text-error">Required</span> : null}
              </label>
              <input
                type="email"
                name="applicationEmail"
                value={form.applicationEmail}
                onChange={onChange}
                className={`input input-bordered w-full ${form.howToApply === "Email" && !form.applicationEmail ? "input-error" : ""}`}
                placeholder="careers@company.com"
              />
            </div>
          ) : null}

          {/* Extra Information */}
          <div className="divider text-lg font-semibold">Additional Information</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text">Experience Required</span></label>
              <input
                name="experienceRequired"
                value={form.experienceRequired}
                onChange={onChange}
                className="input input-bordered w-full"
                placeholder="e.g., 2-3 years"
              />
            </div>
            <div>
              <label className="label"><span className="label-text">Education Required</span></label>
              <input
                name="educationRequired"
                value={form.educationRequired}
                onChange={onChange}
                className="input input-bordered w-full"
                placeholder="e.g., Bachelor's in Computer Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text">Gender Preference (if applicable)</span></label>
              <select
                name="genderPreference"
                value={form.genderPreference}
                onChange={onChange}
                className="select select-bordered w-full"
              >
                <option value="">No Preference</option>
                <option>Male</option>
                <option>Female</option>
                <option>Any</option>
              </select>
            </div>
            <div>
              <label className="label"><span className="label-text">Age Limit (if applicable)</span></label>
              <input
                name="ageLimit"
                value={form.ageLimit}
                onChange={onChange}
                className="input input-bordered w-full"
                placeholder="e.g., 25-35 years"
              />
            </div>
          </div>

          <div>
            <label className="label"><span className="label-text">Tags / Keywords</span></label>
            <input
              name="tags"
              value={form.tags}
              onChange={onChange}
              className="input input-bordered w-full"
              placeholder="#JavaScript, #Remote, #Startup, #Tech..."
            />
            {form.tags ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.split(',').map((s, i) => s.trim()).filter(Boolean).slice(0, 8).map((s, i) => (
                  <span key={i} className={`badge badge-outline ${i % 2 === 0 ? 'badge-primary' : 'badge-secondary'}`}>{s}</span>
                ))}
              </div>
            ) : null}
          </div>

          {id && (
            <div>
              <label className="label"><span className="label-text">Job Status</span></label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="select select-bordered w-full"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" className={`btn btn-primary btn-professional ${loading ? 'btn-loading' : ''}`} disabled={loading}>
              {loading ? (id ? "Updating..." : "Publishing...") : (id ? "Update Job" : "Publish Job")}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setForm({ 
                title: "", category: "", employmentType: "Full-time", jobLevel: "Mid-level",
                overview: "", requirements: "", preferredQualifications: "", toolsTechnologies: "",
                location: "", workMode: "On-site", salaryMin: "", salaryMax: "", salaryType: "BDT",
                isNegotiable: false, perksBenefits: "", applicationDeadline: "", howToApply: "Website",
                applicationUrl: "", applicationEmail: "", numberOfVacancies: 1, experienceRequired: "",
                educationRequired: "", genderPreference: "", ageLimit: "", tags: "", status: "open"
              })}
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
