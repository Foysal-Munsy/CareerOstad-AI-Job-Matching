"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { 
  FaArrowLeft, FaBuilding, FaGlobe, FaMapMarkerAlt, FaUsers, FaIndustry, FaCalendarAlt,
  FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaTwitter, FaLinkedin, FaFacebook
} from "react-icons/fa";

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    logo: "",
    website: "",
    location: "",
    size: "",
    industry: "",
    founded: "",
    about: "",
    socials: { linkedin: "", twitter: "", facebook: "" },
    perks: [],
    techStack: [],
    culture: [],
    hiring: true,
  });

  async function loadProfile() {
    try {
      const res = await fetch("/api/profile/company", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load company profile");
      setProfile(data);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed to load", text: String(e.message || e) });
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function saveProfile() {
    try {
      setLoading(true);
      const res = await fetch("/api/profile/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || "Failed to save");
      setIsEditing(false);
      Swal.fire({ icon: "success", title: "Saved", timer: 1500, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Save failed", text: String(e.message || e) });
    } finally {
      setLoading(false);
    }
  }

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/company" className="btn btn-ghost btn-sm">
          <FaArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaBuilding className="w-6 h-6" />
            Company Profile
          </h1>
          <p className="text-base-content/70">Manage your brand presence and hiring information</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button onClick={saveProfile} disabled={loading} className="btn btn-primary btn-sm">
              {loading ? <span className="loading loading-spinner loading-sm" /> : <FaSave className="w-4 h-4" />}
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm">
              <FaTimes className="w-4 h-4" />
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm">
            <FaEdit className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {header}

      {/* Overview Card */}
      <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-28 h-28 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {profile.logo ? (
                <img src={profile.logo} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <FaBuilding className="w-12 h-12 text-primary" />
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="input input-bordered w-full" placeholder="Company Name" value={profile.name}
                         onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  <input className="input input-bordered w-full" placeholder="Website" value={profile.website}
                         onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
                  <input className="input input-bordered w-full" placeholder="Location" value={profile.location}
                         onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                  <input className="input input-bordered w-full" placeholder="Company Size (e.g., 51-200)" value={profile.size}
                         onChange={(e) => setProfile({ ...profile, size: e.target.value })} />
                  <input className="input input-bordered w-full" placeholder="Industry" value={profile.industry}
                         onChange={(e) => setProfile({ ...profile, industry: e.target.value })} />
                  <input className="input input-bordered w-full" placeholder="Founded (e.g., 2018)" value={profile.founded}
                         onChange={(e) => setProfile({ ...profile, founded: e.target.value })} />
                  <textarea className="textarea textarea-bordered md:col-span-2" rows={3} placeholder="About the company" value={profile.about}
                            onChange={(e) => setProfile({ ...profile, about: e.target.value })} />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-primary">{profile.name || "Unnamed Company"}</h2>
                  <p className="text-base-content/70 mt-1">{profile.about}</p>
                </>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-base-content/70 mt-4">
                {profile.website && (
                  <span className="flex items-center gap-1"><FaGlobe className="w-4 h-4" /> {profile.website}</span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1"><FaMapMarkerAlt className="w-4 h-4" /> {profile.location}</span>
                )}
                {profile.size && (
                  <span className="flex items-center gap-1"><FaUsers className="w-4 h-4" /> {profile.size}</span>
                )}
                {profile.industry && (
                  <span className="flex items-center gap-1"><FaIndustry className="w-4 h-4" /> {profile.industry}</span>
                )}
                {profile.founded && (
                  <span className="flex items-center gap-1"><FaCalendarAlt className="w-4 h-4" /> {profile.founded}</span>
                )}
              </div>

              {/* Socials */}
              <div className="mt-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <FaLinkedin className="w-4 h-4 text-blue-600" />
                      <input className="input input-bordered input-sm flex-1" placeholder="LinkedIn URL" value={profile.socials.linkedin}
                             onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })} />
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTwitter className="w-4 h-4 text-sky-500" />
                      <input className="input input-bordered input-sm flex-1" placeholder="Twitter URL" value={profile.socials.twitter}
                             onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, twitter: e.target.value } })} />
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFacebook className="w-4 h-4 text-blue-500" />
                      <input className="input input-bordered input-sm flex-1" placeholder="Facebook URL" value={profile.socials.facebook}
                             onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, facebook: e.target.value } })} />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    {profile.socials.linkedin && <a className="btn btn-sm btn-outline" href={profile.socials.linkedin}><FaLinkedin /></a>}
                    {profile.socials.twitter && <a className="btn btn-sm btn-outline" href={profile.socials.twitter}><FaTwitter /></a>}
                    {profile.socials.facebook && <a className="btn btn-sm btn-outline" href={profile.socials.facebook}><FaFacebook /></a>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections: Perks, Tech Stack, Culture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { key: "perks", title: "Perks & Benefits", hint: "Health, PTO, Bonuses" },
          { key: "techStack", title: "Tech Stack", hint: "React, Node.js, AWS" },
          { key: "culture", title: "Culture", hint: "Remote-first, Learning, Diversity" },
        ].map((sec) => (
          <div key={sec.key} className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{sec.title}</h3>
              {isEditing && (
                <button className="btn btn-sm" onClick={() => setProfile({ ...profile, [sec.key]: [...profile[sec.key], ""] })}>
                  <FaPlus className="w-3 h-3" />
                  Add
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile[sec.key].length === 0 && !isEditing ? (
                <span className="text-sm text-base-content/60">Add items like: {sec.hint}</span>
              ) : null}
              {profile[sec.key].map((item, idx) => (
                <div key={idx} className="badge badge-outline gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input className="input input-bordered input-xs" value={item}
                             onChange={(e) => {
                               const arr = [...profile[sec.key]];
                               arr[idx] = e.target.value;
                               setProfile({ ...profile, [sec.key]: arr });
                             }} />
                      <button className="btn btn-xs btn-error" onClick={() => setProfile({ ...profile, [sec.key]: profile[sec.key].filter((_, i) => i !== idx) })}>
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


