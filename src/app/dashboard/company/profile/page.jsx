"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import VerifiedBadge from '@/components/verification/VerifiedBadge';
import { 
  FaArrowLeft, FaBuilding, FaGlobe, FaMapMarkerAlt, FaUsers, FaIndustry, FaCalendarAlt,
  FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaTwitter, FaLinkedin, FaFacebook,
  FaPhone, FaEnvelope, FaExternalLinkAlt, FaStar, FaHeart, FaTrophy, FaAward,
  FaCamera, FaVideo, FaPlay, FaCheckCircle, FaShieldAlt, FaMapPin, FaClock,
  FaGraduationCap, FaDumbbell, FaCoffee, FaGamepad, FaPlane, FaGift, FaHandshake
} from "react-icons/fa";

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [profile, setProfile] = useState({
    // Basic Info
    name: "",
    logo: "",
    tagline: "",
    website: "",
    location: "",
    size: "",
    industry: "",
    founded: "",
    
    // About Section
    about: "",
    mission: "",
    vision: "",
    values: [],
    culture: [],
    milestones: [],
    
    // Job Listings
    activeJobs: [],
    
    // Statistics
    totalEmployees: "",
    officesCount: "",
    jobsPosted: "",
    responseTime: "",
    
    // Media
    officePhotos: [],
    eventPhotos: [],
    introVideo: "",
    
    // Testimonials
    testimonials: [],
    ratings: {
      workLifeBalance: 0,
      learning: 0,
      culture: 0,
      overall: 0
    },
    
    // Perks & Benefits
    perks: [],
    benefits: {
      healthInsurance: false,
      remoteWork: false,
      learningDevelopment: false,
      bonuses: false,
      gymMembership: false,
      freeCoffee: false,
      gameRoom: false,
      vacationDays: "",
      otherBenefits: []
    },
    
    // Contact Info
    email: "",
    phone: "",
    address: "",
    socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
    
    // Verification
    isVerified: false,
    
    // Legacy fields
    techStack: [],
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

  const handleLogoUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({ 
          icon: 'error', 
          title: 'Invalid file type', 
          text: 'Please select a valid image (JPEG, PNG, GIF, WebP, or SVG).' 
        });
        return;
      }
      
      // Validate file size (5MB max for company logos)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({ 
          icon: 'error', 
          title: 'File too large', 
          text: 'Max size is 5MB for company logos.' 
        });
        return;
      }
      
      setLogoUploading(true);
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/profile/company/upload-logo', { method: 'POST', body: form });
      const data = await res.json();
      
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Upload failed');
      }
      
      const logoUrl = String(data.logoUrl || '');
      setProfile(prev => ({ 
        ...prev, 
        logo: logoUrl 
      }));
      
      Swal.fire({ 
        icon: 'success', 
        title: 'Logo updated', 
        text: 'Your company logo has been saved successfully.' 
      });
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Upload failed', 
        text: err instanceof Error ? err.message : 'Unknown error' 
      });
    } finally {
      setLogoUploading(false);
      // reset input value to allow re-uploading same file
      if (event?.target) event.target.value = '';
    }
  };

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
          <p className="text-base-content/70">Create a professional company presence and attract top talent</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button onClick={saveProfile} disabled={loading} className="btn btn-primary btn-sm">
              {loading ? <span className="loading loading-spinner loading-sm" /> : <FaSave className="w-4 h-4" />}
              Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm">
              <FaTimes className="w-4 h-4" />
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm">
            <FaEdit className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {header}

      {/* 1. Basic Info - Header Section */}
      <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Company Logo */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden shadow-lg">
                {profile.logo ? (
                  <img src={profile.logo} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <FaBuilding className="w-16 h-16 text-primary" />
                )}
              </div>
              {profile.isVerified && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                  <FaCheckCircle className="w-5 h-5" />
                </div>
              )}
              
              {/* Upload Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 rounded-2xl">
                <label 
                  htmlFor="logo-upload" 
                  className="cursor-pointer p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  title="Upload Company Logo"
                >
                  {logoUploading ? (
                    <div className="loading loading-spinner loading-sm text-primary"></div>
                  ) : (
                    <FaCamera className="w-4 h-4 text-primary" />
                  )}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={logoUploading}
                />
              </div>
            </div>

            {/* Company Details */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="input input-bordered w-full" placeholder="Company Name" value={profile.name}
                           onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    <input className="input input-bordered w-full" placeholder="Tagline (e.g., Empowering Careers in Tech)" value={profile.tagline}
                           onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} />
                  </div>
                  
                  {/* Logo Upload Section */}
                  <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                      {profile.logo ? (
                        <img 
                          src={profile.logo} 
                          alt="Company Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaBuilding className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label 
                        htmlFor="logo-upload-form" 
                        className="btn btn-outline btn-sm cursor-pointer"
                        disabled={logoUploading}
                      >
                        {logoUploading ? (
                          <>
                            <div className="loading loading-spinner loading-xs mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaCamera className="w-3 h-3 mr-2" />
                            {profile.logo ? 'Change Logo' : 'Upload Logo'}
                          </>
                        )}
                      </label>
                      <input
                        id="logo-upload-form"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={logoUploading}
                      />
                      <p className="text-xs text-base-content/60 mt-1">
                        JPG, PNG, GIF, WebP or SVG. Max 5MB.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="input input-bordered w-full" placeholder="Website" value={profile.website}
                           onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
                    <input className="input input-bordered w-full" placeholder="Location" value={profile.location}
                           onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                    <input className="input input-bordered w-full" placeholder="Company Size (e.g., 200-500 employees)" value={profile.size}
                           onChange={(e) => setProfile({ ...profile, size: e.target.value })} />
                    <input className="input input-bordered w-full" placeholder="Industry" value={profile.industry}
                           onChange={(e) => setProfile({ ...profile, industry: e.target.value })} />
                    <input className="input input-bordered w-full" placeholder="Founded Year" value={profile.founded}
                           onChange={(e) => setProfile({ ...profile, founded: e.target.value })} />
                    <input className="input input-bordered w-full" placeholder="Head Office Location" value={profile.address}
                           onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl font-bold text-primary">{profile.name || "Unnamed Company"}</h2>
                    {profile.verification?.isVerified && (
                      <VerifiedBadge size="lg" showText={true} />
                    )}
                  </div>
                  {profile.tagline && (
                    <p className="text-xl text-base-content/80 mb-4 font-medium">{profile.tagline}</p>
                  )}
                </>
              )}

              {/* Company Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {profile.website && (
                  <div className="flex items-center gap-2 text-base-content/70">
                    <FaGlobe className="w-4 h-4 text-primary" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      Website
                    </a>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-base-content/70">
                    <FaMapMarkerAlt className="w-4 h-4 text-primary" />
                    {profile.location}
                  </div>
                )}
                {profile.size && (
                  <div className="flex items-center gap-2 text-base-content/70">
                    <FaUsers className="w-4 h-4 text-primary" />
                    {profile.size}
                  </div>
                )}
                {profile.industry && (
                  <div className="flex items-center gap-2 text-base-content/70">
                    <FaIndustry className="w-4 h-4 text-primary" />
                    {profile.industry}
                  </div>
                )}
                {profile.founded && (
                  <div className="flex items-center gap-2 text-base-content/70">
                    <FaCalendarAlt className="w-4 h-4 text-primary" />
                    Founded {profile.founded}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              profile.verification?.isVerified 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-yellow-100 dark:bg-yellow-900/30'
            }`}>
              {profile.verification?.isVerified ? (
                <FaCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <FaBuilding className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.verification?.isVerified ? 'Company Verified' : 'Get Verified'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {profile.verification?.isVerified 
                  ? 'Your company is verified and shows a trusted badge'
                  : 'Verify your company to build trust with candidates'
                }
              </p>
            </div>
          </div>
          {!profile.verification?.isVerified && (
            <Link
              href="/dashboard/verification"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Verify Now
            </Link>
          )}
        </div>
        {profile.verification?.isVerified && profile.verification?.verifiedAt && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verified on: {new Date(profile.verification.verifiedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* 2. About the Company */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaBuilding className="w-6 h-6 text-primary" />
              About the Company
            </h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="label">Mission</label>
                  <textarea className="textarea textarea-bordered w-full" rows={3} placeholder="Our mission statement" value={profile.mission}
                            onChange={(e) => setProfile({ ...profile, mission: e.target.value })} />
                </div>
                <div>
                  <label className="label">Vision</label>
                  <textarea className="textarea textarea-bordered w-full" rows={3} placeholder="Our vision for the future" value={profile.vision}
                            onChange={(e) => setProfile({ ...profile, vision: e.target.value })} />
                </div>
                <div>
                  <label className="label">Company Description</label>
                  <textarea className="textarea textarea-bordered w-full" rows={4} placeholder="Detailed description of your company" value={profile.about}
                            onChange={(e) => setProfile({ ...profile, about: e.target.value })} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {profile.mission && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Mission</h4>
                    <p className="text-base-content/80">{profile.mission}</p>
                  </div>
                )}
                {profile.vision && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Vision</h4>
                    <p className="text-base-content/80">{profile.vision}</p>
                  </div>
                )}
                {profile.about && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">About Us</h4>
                    <p className="text-base-content/80 leading-relaxed">{profile.about}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Open Job Listings */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <FaHandshake className="w-6 h-6 text-primary" />
                Open Job Listings
              </h3>
              <Link href="/dashboard/company/post-job" className="btn btn-primary btn-sm">
                <FaPlus className="w-4 h-4" />
                Post New Job
              </Link>
            </div>
            
            <div className="space-y-4">
              {profile.activeJobs && profile.activeJobs.length > 0 ? (
                profile.activeJobs.map((job, index) => (
                  <div key={index} className="border border-base-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{job.title}</h4>
                        <p className="text-base-content/70">{job.location}</p>
                        <p className="text-sm text-base-content/60 mt-1">{job.description}</p>
                      </div>
                      <button className="btn btn-primary btn-sm">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <FaHandshake className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active job listings</p>
                  <p className="text-sm">Post your first job to attract top talent</p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Key Statistics */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaTrophy className="w-6 h-6 text-primary" />
              Key Statistics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Total Employees", value: profile.totalEmployees, icon: FaUsers },
                { label: "Offices Worldwide", value: profile.officesCount, icon: FaBuilding },
                { label: "Jobs Posted", value: profile.jobsPosted, icon: FaHandshake },
                { label: "Response Time", value: profile.responseTime, icon: FaClock },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{stat.value || "0"}</div>
                  <div className="text-sm text-base-content/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="space-y-6">
          {/* 5. Photos & Media */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaCamera className="w-5 h-5 text-primary" />
              Photos & Media
            </h3>
            
            <div className="space-y-4">
              {/* Office Photos */}
              <div>
                <h4 className="font-semibold mb-2">Office Environment</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-base-200 rounded-lg flex items-center justify-center">
                      <FaCamera className="w-6 h-6 text-base-content/40" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Intro Video */}
              {profile.introVideo && (
                <div>
                  <h4 className="font-semibold mb-2">Company Introduction</h4>
                  <div className="relative aspect-video bg-base-200 rounded-lg flex items-center justify-center">
                    <FaPlay className="w-8 h-8 text-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. Employee Testimonials */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaStar className="w-5 h-5 text-primary" />
              Employee Reviews
            </h3>
            
            {/* Ratings */}
            <div className="space-y-3 mb-6">
              {[
                { label: "Work-life Balance", value: profile.ratings?.workLifeBalance || 0 },
                { label: "Learning & Growth", value: profile.ratings?.learning || 0 },
                { label: "Company Culture", value: profile.ratings?.culture || 0 },
                { label: "Overall Rating", value: profile.ratings?.overall || 0 },
              ].map((rating, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{rating.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className={`w-4 h-4 ${star <= rating.value ? 'text-yellow-400' : 'text-base-300'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial */}
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-sm italic mb-2">"Great place to grow your career and work with amazing people."</p>
              <div className="text-xs text-base-content/60">- Current Employee</div>
            </div>
          </div>

          {/* 7. Perks & Benefits */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaGift className="w-5 h-5 text-primary" />
              Perks & Benefits
            </h3>
            
            <div className="space-y-3">
              {[
                { icon: FaHeart, label: "Health Insurance", enabled: profile.benefits?.healthInsurance || false },
                { icon: FaGlobe, label: "Remote Work", enabled: profile.benefits?.remoteWork || false },
                { icon: FaGraduationCap, label: "Learning & Development", enabled: profile.benefits?.learningDevelopment || false },
                { icon: FaGift, label: "Bonuses & Incentives", enabled: profile.benefits?.bonuses || false },
                { icon: FaDumbbell, label: "Gym Membership", enabled: profile.benefits?.gymMembership || false },
                { icon: FaCoffee, label: "Free Coffee & Snacks", enabled: profile.benefits?.freeCoffee || false },
                { icon: FaGamepad, label: "Game Room", enabled: profile.benefits?.gameRoom || false },
              ].map((benefit, index) => (
                <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${benefit.enabled ? 'bg-green-50 text-green-700' : 'bg-base-200 text-base-content/60'}`}>
                  <benefit.icon className={`w-4 h-4 ${benefit.enabled ? 'text-green-600' : 'text-base-content/40'}`} />
                  <span className="text-sm">{benefit.label}</span>
                  {benefit.enabled && <FaCheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* 8. Contact & Social Links */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaEnvelope className="w-5 h-5 text-primary" />
              Contact & Social
            </h3>
            
            <div className="space-y-3">
              {profile.email && (
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-4 h-4 text-primary" />
                  <a href={`mailto:${profile.email}`} className="text-sm hover:text-primary">{profile.email}</a>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3">
                  <FaPhone className="w-4 h-4 text-primary" />
                  <a href={`tel:${profile.phone}`} className="text-sm hover:text-primary">{profile.phone}</a>
                </div>
              )}
              {profile.address && (
                <div className="flex items-start gap-3">
                  <FaMapPin className="w-4 h-4 text-primary mt-0.5" />
                  <span className="text-sm">{profile.address}</span>
                </div>
              )}
            </div>
            
            {/* Social Links */}
            <div className="mt-4 pt-4 border-t border-base-300">
              <div className="flex gap-3">
                {profile.socials.linkedin && (
                  <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="btn btn-sm btn-outline hover:bg-blue-50 hover:border-blue-300">
                    <FaLinkedin className="w-4 h-4 text-blue-600" />
                  </a>
                )}
                {profile.socials.twitter && (
                  <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer"
                     className="btn btn-sm btn-outline hover:bg-sky-50 hover:border-sky-300">
                    <FaTwitter className="w-4 h-4 text-sky-500" />
                  </a>
                )}
                {profile.socials.facebook && (
                  <a href={profile.socials.facebook} target="_blank" rel="noopener noreferrer"
                     className="btn btn-sm btn-outline hover:bg-blue-50 hover:border-blue-300">
                    <FaFacebook className="w-4 h-4 text-blue-600" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


