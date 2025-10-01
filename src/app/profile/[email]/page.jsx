"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaCalendarAlt, FaFileAlt, FaLinkedin, FaGithub, FaGlobe, FaTwitter } from "react-icons/fa";

export default function PublicProfilePage() {
  const params = useParams();
  const email = params.email;
  const [profile, setProfile] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/public/profile/${email}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data?.error || 'Failed to load profile');
        setProfile(data.profile);
        setRecentApplications(data.recentApplications || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (email) loadProfile();
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-base-content/70 mb-4">{error || "The requested profile could not be found."}</p>
          <Link href="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const p = profile.personalInfo || {};

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">{p.name || 'Candidate'}</h1>
          <p className="text-base-content/70">{p.professionalTitle}</p>
          {p.availability && (
            <p className="text-xs text-base-content/60 mt-1">Availability: {p.availability}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-base-100 rounded-xl shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="w-16 h-16 text-primary" />
                )}
              </div>
              <div className="text-primary font-semibold">{p.email}</div>
            </div>

            <div className="space-y-3 text-sm">
              {p.location && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-base-content/60" />
                  <span>{p.location}</span>
                </div>
              )}
              {(profile.socialLinks?.website || profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.twitter) && (
                <div className="flex items-center gap-2 pt-2">
                  {profile.socialLinks?.website && (
                    <a
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Website"
                      className="btn btn-outline btn-sm btn-circle"
                      title="Website"
                    >
                      <FaGlobe className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socialLinks?.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="btn btn-outline btn-sm btn-circle text-[#0A66C2] border-[#0A66C2]/30"
                      title="LinkedIn"
                    >
                      <FaLinkedin className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socialLinks?.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="btn btn-outline btn-sm btn-circle"
                      title="GitHub"
                    >
                      <FaGithub className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socialLinks?.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="btn btn-outline btn-sm btn-circle text-[#1DA1F2] border-[#1DA1F2]/30"
                      title="Twitter"
                    >
                      <FaTwitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {p.bio && (
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">About</h3>
              <p className="text-base-content/80 whitespace-pre-line">{p.bio}</p>
            </div>
          )}

          {Array.isArray(profile.skills) && profile.skills.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (
                  <span key={i} className="badge badge-outline">{s.name || s}</span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(profile.experience) && profile.experience.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Work Experience</h3>
              <div className="space-y-4">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-primary/20 pl-4">
                    <div className="font-semibold">{exp.title || exp.role}</div>
                    {exp.company && <div className="text-primary font-medium">{exp.company}</div>}
                    <div className="text-sm text-base-content/70">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''}
                      {" "}-{" "}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </div>
                    {exp.location && (
                      <div className="text-sm text-base-content/60 flex items-center gap-1">
                        <FaMapMarkerAlt className="w-3 h-3" /> {exp.location}
                      </div>
                    )}
                    {exp.description && (
                      <p className="text-sm text-base-content/80 mt-2 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(profile.education) && profile.education.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Education</h3>
              <div className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="border-l-4 border-primary/20 pl-4">
                    <div className="font-semibold">{edu.degree || edu.title}</div>
                    {edu.institution && <div className="text-primary font-medium">{edu.institution}</div>}
                    <div className="text-sm text-base-content/70">
                      {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : ''}
                      {" "}-{" "}
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                    </div>
                    {edu.gpa && <div className="text-sm text-base-content/60">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(profile.certifications) && profile.certifications.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Certifications</h3>
              <div className="space-y-2">
                {profile.certifications.map((c, i) => (
                  <div key={i} className="p-3 bg-base-200 rounded-lg">
                    <div className="font-medium">{c.name || c.title}</div>
                    <div className="text-xs text-base-content/60">
                      {[c.issuer, c.date && (new Date(c.date).toLocaleDateString())].filter(Boolean).join(' • ')}
                    </div>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="link link-primary text-xs">Verify</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(profile.languages) && profile.languages.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((l, i) => (
                  <span key={i} className="badge badge-outline">{l.name || l}</span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(profile.portfolio) && profile.portfolio.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.portfolio.map((pr, i) => (
                  <div key={i} className="p-4 border border-base-300 rounded-lg">
                    <div className="font-semibold mb-1">{pr.title || pr.name || 'Project'}</div>
                    {pr.description && (
                      <p className="text-sm text-base-content/80 mb-2 whitespace-pre-line">{pr.description}</p>
                    )}
                    {pr.url && (
                      <a href={pr.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Visit</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentApplications.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><FaFileAlt className="w-4 h-4" /> Recent Applications</h3>
              <div className="space-y-3">
                {recentApplications.map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div>
                      <div className="font-medium">{a.job?.title || 'Job'}</div>
                      <div className="text-sm text-base-content/70">{a.job?.companyName}</div>
                    </div>
                    <div className="text-xs text-base-content/60 flex items-center gap-1">
                      <FaCalendarAlt className="w-3 h-3" /> {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


