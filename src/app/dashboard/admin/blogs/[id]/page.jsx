"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaUpload } from "react-icons/fa";

export default function AdminBlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Resume Tips",
    image: "",
    status: "draft",
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const result = await res.json();
        if (result.success) {
          const { title, content, category, image, status } = result.data;
          setFormData({
            title: title || "",
            content: content || "",
            category: category || "Resume Tips",
            image: image || "",
            status: status || "draft",
          });
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const response = await fetch("/api/admin/blogs/upload", {
        method: "POST",
        body: fd,
      });
      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({ ...prev, image: result.data.url }));
      }
    } catch (e) {}
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        router.push("/dashboard/admin/blogs");
      }
    } catch (e) {}
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="Resume Tips">Resume Tips</option>
            <option value="Interview Tips">Interview Tips</option>
            <option value="Career Planning">Career Planning</option>
            <option value="Job Search">Job Search</option>
            <option value="Job Applications">Job Applications</option>
            <option value="Interview Preparation">Interview Preparation</option>
            <option value="Salary Negotiation">Salary Negotiation</option>
            <option value="Career Growth">Career Growth</option>
            <option value="Career Change">Career Change</option>
            <option value="Remote Work">Remote Work</option>
            <option value="Work-Life Balance">Work-Life Balance</option>
            <option value="Networking">Networking</option>
            <option value="LinkedIn Optimization">LinkedIn Optimization</option>
            <option value="Portfolio & Personal Branding">Portfolio & Personal Branding</option>
            <option value="Internships & Entry-Level">Internships & Entry-Level</option>
            <option value="Freelancing & Gig Work">Freelancing & Gig Work</option>
            <option value="Tech Careers">Tech Careers</option>
            <option value="Non-Tech Careers">Non-Tech Careers</option>
            <option value="Management & Leadership">Management & Leadership</option>
            <option value="Productivity & Skills">Productivity & Skills</option>
            <option value="Industry Trends">Industry Trends</option>
            <option value="Company Culture">Company Culture</option>
            <option value="Employee Benefits">Employee Benefits</option>
            <option value="Professional Development">Professional Development</option>
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Featured Image</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {formData.image ? (
              <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover mx-auto rounded" />
            ) : (
              <p className="text-gray-500">No image selected</p>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              id="image-upload"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleImageUpload(file);
              }}
            />
            <label htmlFor="image-upload" className="btn btn-sm btn-outline mt-2 cursor-pointer" disabled={uploading}>
              <FaUpload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Choose Image"}
            </label>
          </div>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Content</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full h-48"
            required
          ></textarea>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => router.push("/dashboard/admin/blogs")}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}


