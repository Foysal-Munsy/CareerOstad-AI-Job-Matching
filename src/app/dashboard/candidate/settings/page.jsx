"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

export default function CandidateAccountSettingsPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    // Placeholder submit for profile update.
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // Placeholder submit for password change.
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Account Settings</h1>
          <p className="text-base-content/60 mt-1">Manage your profile information and password.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmitProfile} className="lg:col-span-2 space-y-6">
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaUser className="w-5 h-5 text-primary" />
                Profile Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="form-control w-full md:col-span-2">
                <div className="label">
                  <span className="label-text">Full Name</span>
                </div>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your name"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-primary" /> Email
                  </span>
                </div>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaPhone className="w-4 h-4 text-primary" /> Phone
                  </span>
                </div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="e.g., +1 555 123 4567"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="p-6 pt-0">
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </form>

        <form onSubmit={handleSubmitPassword} className="space-y-6">
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaLock className="w-5 h-5 text-primary" />
                Change Password
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Current Password</span>
                </div>
                <input
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">New Password</span>
                </div>
                <input
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Confirm New Password</span>
                </div>
                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="p-6 pt-0">
              <button type="submit" className="btn btn-primary w-full">Update Password</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


