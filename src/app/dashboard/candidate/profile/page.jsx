'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { 
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaGraduationCap,
  FaBriefcase,
  FaAward,
  FaLanguage,
  FaCode,
  FaFileAlt,
  FaDownload,
  FaUpload,
  FaCamera,
  FaCheck,
  FaStar,
  FaCalendarAlt,
  FaBuilding,
  FaUserTie,
  FaRocket,
  FaHeart,
  FaEye,
  FaShare,
  FaTwitter
} from 'react-icons/fa';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  // Profile data from API - will be loaded from backend
  const [profile, setProfile] = useState({
    personalInfo: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      location: '',
      bio: '',
      avatar: session?.user?.image || '',
      professionalTitle: '',
      availability: 'Available for new opportunities',
      experience: '0+ years'
    },
    resumeUrl: '',
    socialLinks: {
      linkedin: '',
      github: '',
      website: '',
      twitter: ''
    },
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    portfolio: []
  });

  const [stats, setStats] = useState({
    profileViews: 0,
    profileCompleteness: 0,
    jobMatches: 0,
    applications: 0,
    interviews: 0
  });

  // Fetch profile data from API
  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const response = await fetch('/api/profile');
      
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setResumeUrl(String(profileData?.resumeUrl || ''));
        console.log('Profile fetched successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch profile:', errorData.error);
        // Set default profile data if fetch fails
        setProfile({
          personalInfo: {
            name: session?.user?.name || '',
            email: session?.user?.email || '',
            phone: '',
            location: '',
            bio: '',
            avatar: session?.user?.image || '',
            professionalTitle: '',
            availability: 'Available for new opportunities',
            experience: '0+ years'
          },
          socialLinks: {
            linkedin: '',
            github: '',
            website: '',
            twitter: ''
          },
          skills: [],
          experience: [],
          education: [],
          certifications: [],
          languages: [],
          portfolio: []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set default profile data if network error
      setProfile({
        personalInfo: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          phone: '',
          location: '',
          bio: '',
          avatar: session?.user?.image || '',
          professionalTitle: '',
          availability: 'Available for new opportunities',
          experience: '0+ years'
        },
        socialLinks: {
          linkedin: '',
          github: '',
          website: '',
          twitter: ''
        },
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        languages: [],
        portfolio: []
      });
    } finally {
      setProfileLoading(false);
    }
  }, []); // Remove session dependency to prevent infinite loop

  // Load profile data on component mount
  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session?.user?.email]); // Remove fetchProfile dependency

  // Update stats when profile changes
  useEffect(() => {
    const completionPercentage = calculateProfileCompletion();
    console.log('Profile data:', {
      avatar: profile.personalInfo.avatar,
      name: profile.personalInfo.name,
      email: profile.personalInfo.email
    });
    setStats(prevStats => ({
      ...prevStats,
      profileCompleteness: completionPercentage
    }));
  }, [profile]);

  const handleResumeUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.type !== 'application/pdf') {
        Swal.fire({ icon: 'error', title: 'Invalid file', text: 'Please select a PDF file.' });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({ icon: 'error', title: 'File too large', text: 'Max size is 10MB.' });
        return;
      }
      setResumeUploading(true);
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/profile/upload-resume', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Upload failed');
      }
      const url = String(data.resumeUrl || '');
      setResumeUrl(url);
      setProfile(prev => ({ ...prev, resumeUrl: url }));
      Swal.fire({ icon: 'success', title: 'Resume uploaded', text: 'Your resume has been saved.' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Upload failed', text: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setResumeUploading(false);
      // reset input value to allow re-uploading same file
      if (event?.target) event.target.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsEditing(false);
        setEditingSection(null);
        console.log('Profile updated successfully');
        // Show success message with SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully!',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        console.error('Failed to update profile:', result.error);
        // Show error message with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: result.error || 'Unknown error occurred',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show network error message with SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  // Save specific section data
  const handleSectionSave = async (sectionName) => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setEditingSection(null);
        console.log(`${sectionName} section updated successfully`);
        // Show success message with SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${sectionName} section updated successfully!`,
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        console.error(`Failed to update ${sectionName} section:`, result.error);
        // Show error message with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: result.error || 'Unknown error occurred',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error(`Error updating ${sectionName} section:`, error);
      // Show network error message with SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-green-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Beginner': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getSkillLevelWidth = (level) => {
    switch (level) {
      case 'Expert': return '90%';
      case 'Advanced': return '75%';
      case 'Intermediate': return '60%';
      case 'Beginner': return '30%';
      default: return '30%';
    }
  };

  // Calculate total years of experience from experience array
  const calculateTotalExperience = () => {
    if (!profile.experience || profile.experience.length === 0) {
      return '0+ years';
    }

    let totalMonths = 0;
    profile.experience.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        const diffTime = Math.abs(end - start);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        totalMonths += diffMonths;
      } else if (exp.startDate && !exp.endDate) {
        // Current job
        const start = new Date(exp.startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        totalMonths += diffMonths;
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    if (years === 0 && months === 0) {
      return '0+ years';
    } else if (years === 0) {
      return `${months}+ months`;
    } else if (months === 0) {
      return `${years}+ years`;
    } else {
      return `${years}+ years`;
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let totalScore = 0;
    let maxScore = 0;
    const debugInfo = {};

    // Personal Information (40% weight)
    const personalInfoFields = [
      'name', 'email', 'phone', 'location', 'bio', 
      'professionalTitle', 'availability', 'experience'
    ];
    personalInfoFields.forEach(field => {
      maxScore += 5; // Each field worth 5 points
      const hasValue = profile.personalInfo[field] && profile.personalInfo[field].toString().trim() !== '';
      if (hasValue) {
        totalScore += 5;
      }
      debugInfo[`personal_${field}`] = hasValue;
    });

    // Social Links (10% weight)
    const socialFields = ['linkedin', 'github', 'website', 'twitter'];
    socialFields.forEach(field => {
      maxScore += 2.5; // Each social link worth 2.5 points
      const hasValue = profile.socialLinks[field] && profile.socialLinks[field].trim() !== '';
      if (hasValue) {
        totalScore += 2.5;
      }
      debugInfo[`social_${field}`] = hasValue;
    });

    // Skills (15% weight)
    maxScore += 15;
    const hasSkills = profile.skills && profile.skills.length > 0;
    if (hasSkills) {
      totalScore += 15;
    }
    debugInfo.skills = hasSkills;

    // Experience (20% weight)
    maxScore += 20;
    const hasExperience = profile.experience && profile.experience.length > 0;
    if (hasExperience) {
      totalScore += 20;
    }
    debugInfo.experience = hasExperience;

    // Education (10% weight)
    maxScore += 10;
    const hasEducation = profile.education && profile.education.length > 0;
    if (hasEducation) {
      totalScore += 10;
    }
    debugInfo.education = hasEducation;

    // Languages (5% weight)
    maxScore += 5;
    const hasLanguages = profile.languages && profile.languages.length > 0;
    if (hasLanguages) {
      totalScore += 5;
    }
    debugInfo.languages = hasLanguages;

    const percentage = Math.round((totalScore / maxScore) * 100);
    return percentage;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'skills', label: 'Skills', icon: FaCode },
    { id: 'portfolio', label: 'Portfolio', icon: FaFileAlt },
    { id: 'certifications', label: 'Certifications', icon: FaAward }
  ];

  // Loading state
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/candidate"
              className="btn btn-ghost btn-sm hover:bg-primary/10 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-primary" />
                </div>
                My Profile
              </h1>
              <p className="text-base-content/70 mt-1">
                Manage your professional profile and showcase your skills
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="resume-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleResumeUpload}
            />
            <label htmlFor="resume-input" className="btn btn-outline btn-sm cursor-pointer">
              {resumeUploading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <FaUpload className="w-4 h-4" />
              )}
              <span className="hidden md:inline">Upload Resume (PDF)</span>
            </label>
            {isEditing && (
              <>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <FaSave className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Save Changes</span>
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditingSection(null);
                  }}
                  className="btn btn-ghost btn-sm hover:bg-base-200 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion Tips */}
      {stats.profileCompleteness < 100 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <FaRocket className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Complete Your Profile ({stats.profileCompleteness}%)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {!profile.personalInfo.bio && (
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <FaUser className="w-4 h-4" />
                <span>Add a professional bio</span>
              </div>
            )}
            {!profile.personalInfo.phone && (
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <FaPhone className="w-4 h-4" />
                <span>Add your phone number</span>
              </div>
            )}
            {!profile.personalInfo.location && (
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>Add your location</span>
              </div>
            )}
            {profile.skills.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <FaCode className="w-4 h-4" />
                <span>Add your skills</span>
              </div>
            )}
            {profile.experience.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <FaBriefcase className="w-4 h-4" />
                <span>Add work experience</span>
              </div>
            )}
            {profile.education.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <FaGraduationCap className="w-4 h-4" />
                <span>Add education</span>
              </div>
            )}
            {profile.languages.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <FaLanguage className="w-4 h-4" />
                <span>Add languages</span>
              </div>
            )}
            {!profile.socialLinks.linkedin && (
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <FaLinkedin className="w-4 h-4" />
                <span>Add LinkedIn profile</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Profile Views</p>
              <p className="text-xl font-bold text-primary">{stats.profileViews.toLocaleString()}</p>
            </div>
            <FaEye className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-base-content/60">Profile Completeness</p>
              <p className="text-xl font-bold text-primary">{stats.profileCompleteness}%</p>
              <div className="w-full bg-base-300 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stats.profileCompleteness >= 80 ? 'bg-green-500' :
                    stats.profileCompleteness >= 60 ? 'bg-yellow-500' :
                    stats.profileCompleteness >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stats.profileCompleteness}%` }}
                ></div>
              </div>
              <p className="text-xs text-base-content/50 mt-1">
                {stats.profileCompleteness >= 80 ? 'Excellent!' :
                 stats.profileCompleteness >= 60 ? 'Good progress' :
                 stats.profileCompleteness >= 40 ? 'Getting there' : 'Needs work'}
              </p>
            </div>
            <FaCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Job Matches</p>
              <p className="text-xl font-bold text-primary">{stats.jobMatches}</p>
            </div>
            <FaStar className="w-6 h-6 text-yellow-600" />
          </div>
        </div>

        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Applications</p>
              <p className="text-xl font-bold text-primary">{stats.applications}</p>
            </div>
            <FaFileAlt className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Interviews</p>
              <p className="text-xl font-bold text-primary">{stats.interviews}</p>
            </div>
            <FaCalendarAlt className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 p-6 relative">

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white/50">
                {profile.personalInfo.avatar && profile.personalInfo.avatar.trim() !== '' ? (
                  <img 
                    src={profile.personalInfo.avatar} 
                    alt={profile.personalInfo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', profile.personalInfo.avatar);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${profile.personalInfo.avatar && profile.personalInfo.avatar.trim() !== '' ? 'hidden' : 'flex'}`}>
                  {profile.personalInfo.name ? (
                    <span className="text-4xl font-bold text-primary">
                      {profile.personalInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  ) : (
                    <FaUser className="w-16 h-16 text-primary" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-base-content">Personal Information</h2>
                <div className="flex gap-2">
                  {editingSection === 'personalInfo' ? (
                    <>
                      <button 
                        onClick={() => setEditingSection(null)}
                        className="btn btn-sm btn-ghost hover:bg-base-200"
                        title="Cancel"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSectionSave('Personal Information')}
                        className="btn btn-sm btn-primary"
                        title="Save Changes"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditingSection('personalInfo')}
                      className="btn btn-sm btn-primary"
                      title="Edit Personal Information"
                    >
                      <FaEdit className="w-3 h-3" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              {(isEditing || editingSection === 'personalInfo') ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profile.personalInfo.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, name: e.target.value }
                    })}
                    className="input input-bordered w-full text-2xl font-bold focus:ring-2 focus:ring-primary/20"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={profile.personalInfo.professionalTitle}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, professionalTitle: e.target.value }
                    })}
                    className="input input-bordered w-full text-lg focus:ring-2 focus:ring-primary/20"
                    placeholder="Professional Title"
                  />
                  <textarea
                    value={profile.personalInfo.bio}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, bio: e.target.value }
                    })}
                    className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary/20"
                    placeholder="Bio"
                    rows={3}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={profile.personalInfo.location}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, location: e.target.value }
                      })}
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      placeholder="Location"
                    />
                    <input
                      type="text"
                      value={profile.personalInfo.availability}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, availability: e.target.value }
                      })}
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      placeholder="Availability Status"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-primary mb-2">
                    {profile.personalInfo.name}
                  </h2>
                  <p className="text-lg text-base-content/70 mb-2">
                    {profile.personalInfo.professionalTitle}
                  </p>
                  <p className="text-base-content/60 mb-4">
                    {profile.personalInfo.bio}
                  </p>
                </>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  {profile.personalInfo.location}
                </span>
                <span className="flex items-center gap-1">
                  <FaBriefcase className="w-4 h-4" />
                  {calculateTotalExperience()}
                </span>
                <span className="flex items-center gap-1">
                  <FaRocket className="w-4 h-4" />
                  {profile.personalInfo.availability}
                </span>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-base-content">Social Links</h3>
                  <div className="flex gap-2">
                    {editingSection === 'socialLinks' ? (
                      <>
                        <button 
                          onClick={() => setEditingSection(null)}
                          className="btn btn-sm btn-ghost hover:bg-base-200"
                          title="Cancel"
                        >
                          <FaTimes className="w-3 h-3" />
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSectionSave('Social Links')}
                          className="btn btn-sm btn-primary"
                          title="Save Changes"
                        >
                          <FaSave className="w-3 h-3" />
                          Save
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setEditingSection('socialLinks')}
                        className="btn btn-sm btn-primary"
                        title="Edit Social Links"
                      >
                        <FaEdit className="w-3 h-3" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                {(isEditing || editingSection === 'socialLinks') ? (
                  <div className="space-y-3">
                    <label className="label">
                      <span className="label-text font-medium">Social Links</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <FaLinkedin className="w-4 h-4 text-blue-600" />
                        <input
                          type="url"
                          value={profile.socialLinks.linkedin}
                          onChange={(e) => setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1"
                          placeholder="LinkedIn Profile URL"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <FaGithub className="w-4 h-4 text-gray-800" />
                        <input
                          type="url"
                          value={profile.socialLinks.github}
                          onChange={(e) => setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, github: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1"
                          placeholder="GitHub Profile URL"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <FaGlobe className="w-4 h-4 text-green-600" />
                        <input
                          type="url"
                          value={profile.socialLinks.website}
                          onChange={(e) => setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, website: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1"
                          placeholder="Personal Website URL"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <FaTwitter className="w-4 h-4 text-blue-400" />
                        <input
                          type="url"
                          value={profile.socialLinks.twitter}
                          onChange={(e) => setProfile({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1"
                          placeholder="Twitter Profile URL"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    {profile.socialLinks.linkedin && (
                      <a href={profile.socialLinks.linkedin} className="btn btn-sm btn-outline">
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    {profile.socialLinks.github && (
                      <a href={profile.socialLinks.github} className="btn btn-sm btn-outline">
                        <FaGithub className="w-4 h-4" />
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a href={profile.socialLinks.website} className="btn btn-sm btn-outline">
                        <FaGlobe className="w-4 h-4" />
                      </a>
                    )}
                    {profile.socialLinks.twitter && (
                      <a href={profile.socialLinks.twitter} className="btn btn-sm btn-outline">
                        <FaTwitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-lg overflow-hidden">
        <div className="border-b border-base-300 bg-gradient-to-r from-base-100 to-base-200/50">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 relative group ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5 shadow-sm'
                    : 'border-transparent text-base-content/70 hover:text-base-content hover:bg-base-200/50'
                }`}
              >
                <tab.icon className={`w-4 h-4 transition-transform duration-200 ${
                  activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-gradient-to-br from-base-100 to-base-200/30 p-6 rounded-xl border border-base-300 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                        <FaEnvelope className="w-5 h-5 text-primary" />
                        Contact Information
                      </h3>
                      <div className="flex gap-2">
                        {editingSection === 'contactInfo' ? (
                          <>
                            <button 
                              onClick={() => setEditingSection(null)}
                              className="btn btn-sm btn-ghost hover:bg-base-200"
                              title="Cancel"
                            >
                              <FaTimes className="w-3 h-3" />
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleSectionSave('Contact Information')}
                              className="btn btn-sm btn-primary"
                              title="Save Changes"
                            >
                              <FaSave className="w-3 h-3" />
                              Save
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => setEditingSection('contactInfo')}
                            className="btn btn-sm btn-primary"
                            title="Edit Contact Information"
                          >
                            <FaEdit className="w-3 h-3" />
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="w-5 h-5 text-primary" />
                      {(isEditing || editingSection === 'contactInfo') ? (
                        <input
                          type="email"
                          value={profile.personalInfo.email}
                          onChange={(e) => setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, email: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1 focus:ring-2 focus:ring-primary/20"
                          placeholder="Email"
                        />
                      ) : (
                        <span className="text-base-content">{profile.personalInfo.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="w-5 h-5 text-primary" />
                      {(isEditing || editingSection === 'contactInfo') ? (
                        <input
                          type="tel"
                          value={profile.personalInfo.phone}
                          onChange={(e) => setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, phone: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1 focus:ring-2 focus:ring-primary/20"
                          placeholder="Phone Number"
                        />
                      ) : (
                        <span className="text-base-content">{profile.personalInfo.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="w-5 h-5 text-primary" />
                      {(isEditing || editingSection === 'contactInfo') ? (
                        <input
                          type="text"
                          value={profile.personalInfo.location}
                          onChange={(e) => setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, location: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1 focus:ring-2 focus:ring-primary/20"
                          placeholder="Location"
                        />
                      ) : (
                        <span className="text-base-content">{profile.personalInfo.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-gradient-to-br from-base-100 to-base-200/30 p-6 rounded-xl border border-base-300 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                      <FaLanguage className="w-5 h-5 text-primary" />
                      Languages
                    </h3>
                    <div className="flex gap-2">
                      {editingSection === 'languages' ? (
                        <>
                          <button 
                            onClick={() => setEditingSection(null)}
                            className="btn btn-sm btn-ghost hover:bg-base-200"
                            title="Cancel"
                          >
                            <FaTimes className="w-3 h-3" />
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSectionSave('Languages')}
                            className="btn btn-sm btn-primary"
                            title="Save Changes"
                          >
                            <FaSave className="w-3 h-3" />
                            Save
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setEditingSection('languages')}
                          className="btn btn-sm btn-primary"
                          title="Edit Languages"
                        >
                          <FaEdit className="w-3 h-3" />
                          Edit
                        </button>
                      )}
                      {(isEditing || editingSection === 'languages') && (
                        <button
                          onClick={() => setProfile({
                            ...profile,
                            languages: [...profile.languages, { name: '', proficiency: 'Beginner' }]
                          })}
                          className="btn btn-sm btn-secondary"
                          title="Add Language"
                        >
                          <FaPlus className="w-3 h-3" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {profile.languages.map((language, index) => (
                      <div key={index} className="flex items-center justify-between gap-3">
                        {(isEditing || editingSection === 'languages') ? (
                          <>
                            <input
                              type="text"
                              value={language.name}
                              onChange={(e) => {
                                const newLanguages = [...profile.languages];
                                newLanguages[index] = { ...newLanguages[index], name: e.target.value };
                                setProfile({ ...profile, languages: newLanguages });
                              }}
                              className="input input-bordered input-sm flex-1"
                              placeholder="Language"
                            />
                            <select
                              value={language.proficiency}
                              onChange={(e) => {
                                const newLanguages = [...profile.languages];
                                newLanguages[index] = { ...newLanguages[index], proficiency: e.target.value };
                                setProfile({ ...profile, languages: newLanguages });
                              }}
                              className="select select-bordered select-sm w-32"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Native">Native</option>
                            </select>
                            <button
                              onClick={() => {
                                const newLanguages = profile.languages.filter((_, i) => i !== index);
                                setProfile({ ...profile, languages: newLanguages });
                              }}
                              className="btn btn-sm btn-error"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-base-content">{language.name}</span>
                            <span className="badge badge-outline">{language.proficiency}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Skills */}
              <div className="bg-gradient-to-br from-base-100 to-base-200/30 p-6 rounded-xl border border-base-300 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                    <FaCode className="w-5 h-5 text-primary" />
                    Top Skills
                  </h3>
                  <div className="text-sm text-base-content/60">
                    Manage skills in the Skills tab
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <div key={index} className="p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-base-content">{skill.name}</span>
                          <span className="text-sm text-base-content/60">{skill.category}</span>
                        </div>
                        <div className="w-full bg-base-300 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                            style={{ width: getSkillLevelWidth(skill.level) }}
                          ></div>
                        </div>
                        <span className="text-xs text-base-content/60 mt-1 block">{skill.level}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-base-content/60">
                      <FaCode className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
                      <p className="text-lg font-medium mb-2">No skills added yet</p>
                      <p className="text-sm">Go to the Skills tab to add your skills and expertise</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {/* Experience Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
                  <FaBriefcase className="w-6 h-6 text-primary" />
                  Work Experience
                </h2>
                <div className="flex gap-2">
                  {editingSection === 'experience' ? (
                    <>
                      <button 
                        onClick={() => setEditingSection(null)}
                        className="btn btn-sm btn-ghost hover:bg-base-200"
                        title="Cancel"
                      >
                        <FaTimes className="w-4 h-4" />
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSectionSave('Experience')}
                        className="btn btn-sm btn-primary"
                        title="Save Changes"
                      >
                        <FaSave className="w-4 h-4" />
                        Save
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditingSection('experience')}
                      className="btn btn-sm btn-primary"
                      title="Edit Experience"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit Experience
                    </button>
                  )}
                </div>
              </div>

              {profile.experience.map((exp, expIndex) => (
                <div key={exp.id} className="border-l-4 border-primary pl-6 pb-6">
                  {(isEditing || editingSection === 'experience') ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-primary">Experience {expIndex + 1}</h3>
                        <button
                          onClick={() => {
                            const newExperience = profile.experience.filter((_, i) => i !== expIndex);
                            setProfile({ ...profile, experience: newExperience });
                          }}
                          className="btn btn-sm btn-error"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const newExperience = [...profile.experience];
                            newExperience[expIndex] = { ...newExperience[expIndex], title: e.target.value };
                            setProfile({ ...profile, experience: newExperience });
                          }}
                          className="input input-bordered"
                          placeholder="Job Title"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExperience = [...profile.experience];
                            newExperience[expIndex] = { ...newExperience[expIndex], company: e.target.value };
                            setProfile({ ...profile, experience: newExperience });
                          }}
                          className="input input-bordered"
                          placeholder="Company"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const newExperience = [...profile.experience];
                            newExperience[expIndex] = { ...newExperience[expIndex], location: e.target.value };
                            setProfile({ ...profile, experience: newExperience });
                          }}
                          className="input input-bordered"
                          placeholder="Location"
                        />
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-base-content">Start Date</label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => {
                              const newExperience = [...profile.experience];
                              newExperience[expIndex] = { ...newExperience[expIndex], startDate: e.target.value };
                              setProfile({ ...profile, experience: newExperience });
                            }}
                            className="input input-bordered w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-base-content">End Date</label>
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => {
                              const newExperience = [...profile.experience];
                              newExperience[expIndex] = { ...newExperience[expIndex], endDate: e.target.value };
                              setProfile({ ...profile, experience: newExperience });
                            }}
                            className="input input-bordered w-full"
                            placeholder="Leave empty for current position"
                          />
                        </div>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExperience = [...profile.experience];
                          newExperience[expIndex] = { ...newExperience[expIndex], description: e.target.value };
                          setProfile({ ...profile, experience: newExperience });
                        }}
                        className="textarea textarea-bordered w-full"
                        placeholder="Job Description"
                        rows={3}
                      />
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Key Achievements</span>
                        </label>
                        {exp.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={achievement}
                              onChange={(e) => {
                                const newExperience = [...profile.experience];
                                const newAchievements = [...newExperience[expIndex].achievements];
                                newAchievements[achIndex] = e.target.value;
                                newExperience[expIndex] = { ...newExperience[expIndex], achievements: newAchievements };
                                setProfile({ ...profile, experience: newExperience });
                              }}
                              className="input input-bordered flex-1"
                              placeholder="Achievement"
                            />
                            <button
                              onClick={() => {
                                const newExperience = [...profile.experience];
                                const newAchievements = newExperience[expIndex].achievements.filter((_, i) => i !== achIndex);
                                newExperience[expIndex] = { ...newExperience[expIndex], achievements: newAchievements };
                                setProfile({ ...profile, experience: newExperience });
                              }}
                              className="btn btn-sm btn-error"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newExperience = [...profile.experience];
                            newExperience[expIndex] = { 
                              ...newExperience[expIndex], 
                              achievements: [...newExperience[expIndex].achievements, ''] 
                            };
                            setProfile({ ...profile, experience: newExperience });
                          }}
                          className="btn btn-sm btn-outline"
                        >
                          <FaPlus className="w-3 h-3" />
                          Add Achievement
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-base-content">{exp.title}</h3>
                        <div className="flex items-center gap-2 text-base-content/70 mb-2">
                          <FaBuilding className="w-4 h-4" />
                          <span className="font-medium">{exp.company}</span>
                          <span>•</span>
                          <FaMapMarkerAlt className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base-content/60 mb-3">
                          <FaCalendarAlt className="w-4 h-4" />
                          <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-base-content/80 mb-3">{exp.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-base-content">Key Achievements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-base-content/70">
                            {exp.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(isEditing || editingSection === 'experience') && (
                <button 
                  onClick={() => setProfile({
                    ...profile,
                    experience: [...profile.experience, {
                      id: Date.now(),
                      title: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                      achievements: ['']
                    }]
                  })}
                  className="btn btn-outline w-full hover:bg-primary hover:text-primary-content transition-all duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Experience
                </button>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              {/* Education Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
                  <FaGraduationCap className="w-6 h-6 text-primary" />
                  Education
                </h2>
                <div className="flex gap-2">
                  {editingSection === 'education' ? (
                    <>
                      <button 
                        onClick={() => setEditingSection(null)}
                        className="btn btn-sm btn-ghost hover:bg-base-200"
                        title="Cancel"
                      >
                        <FaTimes className="w-4 h-4" />
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSectionSave('Education')}
                        className="btn btn-sm btn-primary"
                        title="Save Changes"
                      >
                        <FaSave className="w-4 h-4" />
                        Save
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditingSection('education')}
                      className="btn btn-sm btn-primary"
                      title="Edit Education"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit Education
                    </button>
                  )}
                </div>
              </div>

              {profile.education.map((edu, eduIndex) => (
                <div key={edu.id} className="border-l-4 border-secondary pl-6 pb-6">
                  {(isEditing || editingSection === 'education') ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-secondary">Education {eduIndex + 1}</h3>
                        <button
                          onClick={() => {
                            const newEducation = profile.education.filter((_, i) => i !== eduIndex);
                            setProfile({ ...profile, education: newEducation });
                          }}
                          className="btn btn-sm btn-error"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEducation = [...profile.education];
                            newEducation[eduIndex] = { ...newEducation[eduIndex], degree: e.target.value };
                            setProfile({ ...profile, education: newEducation });
                          }}
                          className="input input-bordered"
                          placeholder="Degree (e.g., Bachelor of Science)"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEducation = [...profile.education];
                            newEducation[eduIndex] = { ...newEducation[eduIndex], institution: e.target.value };
                            setProfile({ ...profile, education: newEducation });
                          }}
                          className="input input-bordered"
                          placeholder="Institution Name"
                        />
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const newEducation = [...profile.education];
                            newEducation[eduIndex] = { ...newEducation[eduIndex], location: e.target.value };
                            setProfile({ ...profile, education: newEducation });
                          }}
                          className="input input-bordered"
                          placeholder="Location"
                        />
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => {
                            const newEducation = [...profile.education];
                            newEducation[eduIndex] = { ...newEducation[eduIndex], gpa: e.target.value };
                            setProfile({ ...profile, education: newEducation });
                          }}
                          className="input input-bordered"
                          placeholder="GPA (e.g., 3.8/4.0)"
                        />
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-base-content">Start Date</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => {
                              const newEducation = [...profile.education];
                              newEducation[eduIndex] = { ...newEducation[eduIndex], startDate: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            className="input input-bordered w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-base-content">End Date</label>
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => {
                              const newEducation = [...profile.education];
                              newEducation[eduIndex] = { ...newEducation[eduIndex], endDate: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            className="input input-bordered w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Achievements</span>
                        </label>
                        {edu.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={achievement}
                              onChange={(e) => {
                                const newEducation = [...profile.education];
                                const newAchievements = [...newEducation[eduIndex].achievements];
                                newAchievements[achIndex] = e.target.value;
                                newEducation[eduIndex] = { ...newEducation[eduIndex], achievements: newAchievements };
                                setProfile({ ...profile, education: newEducation });
                              }}
                              className="input input-bordered flex-1"
                              placeholder="Achievement"
                            />
                            <button
                              onClick={() => {
                                const newEducation = [...profile.education];
                                const newAchievements = newEducation[eduIndex].achievements.filter((_, i) => i !== achIndex);
                                newEducation[eduIndex] = { ...newEducation[eduIndex], achievements: newAchievements };
                                setProfile({ ...profile, education: newEducation });
                              }}
                              className="btn btn-sm btn-error"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newEducation = [...profile.education];
                            newEducation[eduIndex] = { 
                              ...newEducation[eduIndex], 
                              achievements: [...newEducation[eduIndex].achievements, ''] 
                            };
                            setProfile({ ...profile, education: newEducation });
                          }}
                          className="btn btn-sm btn-outline"
                        >
                          <FaPlus className="w-3 h-3" />
                          Add Achievement
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-base-content">{edu.degree}</h3>
                        <div className="flex items-center gap-2 text-base-content/70 mb-2">
                          <FaGraduationCap className="w-4 h-4" />
                          <span className="font-medium">{edu.institution}</span>
                          <span>•</span>
                          <FaMapMarkerAlt className="w-4 h-4" />
                          <span>{edu.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base-content/60 mb-3">
                          <FaCalendarAlt className="w-4 h-4" />
                          <span>{edu.startDate} - {edu.endDate}</span>
                          <span>•</span>
                          <span>GPA: {edu.gpa}</span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-base-content">Achievements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {edu.achievements.map((achievement, index) => (
                              <span key={index} className="badge badge-secondary">
                                {achievement}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(isEditing || editingSection === 'education') && (
                <button 
                  onClick={() => setProfile({
                    ...profile,
                    education: [...profile.education, {
                      id: Date.now(),
                      degree: '',
                      institution: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      gpa: '',
                      achievements: ['']
                    }]
                  })}
                  className="btn btn-outline w-full hover:bg-secondary hover:text-secondary-content transition-all duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Education
                </button>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              {/* Skills Section Header */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaCode className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-base-content">Skills & Expertise</h2>
                      <p className="text-base-content/70">Showcase your technical skills and professional expertise</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editingSection === 'skills' ? (
                      <>
                        <button 
                          onClick={() => setEditingSection(null)}
                          className="btn btn-sm btn-ghost hover:bg-base-200"
                          title="Cancel"
                        >
                          <FaTimes className="w-4 h-4" />
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSectionSave('Skills')}
                          className="btn btn-sm btn-primary shadow-lg hover:shadow-xl"
                          title="Save Changes"
                        >
                          <FaSave className="w-4 h-4" />
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setEditingSection('skills')}
                        className="btn btn-sm btn-primary shadow-lg hover:shadow-xl"
                        title="Edit Skills"
                      >
                        <FaEdit className="w-4 h-4" />
                        Edit Skills
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {['Programming', 'Frontend', 'Backend', 'Cloud', 'DevOps', 'Database'].map((category) => {
                  const categorySkills = profile.skills.filter(skill => skill.category === category);
                  
                  return (
                    <div key={category} className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FaCode className="w-4 h-4 text-primary" />
                          </div>
                          {category}
                        </h3>
                        <span className="badge badge-primary badge-sm">
                          {categorySkills.length} skills
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {categorySkills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="group">
                            {(isEditing || editingSection === 'skills') ? (
                              <div className="bg-base-200 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-primary">Skill {skillIndex + 1}</h4>
                                  <button
                                    onClick={() => {
                                      const newSkills = profile.skills.filter((_, i) => i !== skillIndex);
                                      setProfile({ ...profile, skills: newSkills });
                                    }}
                                    className="btn btn-sm btn-error btn-circle"
                                    title="Delete Skill"
                                  >
                                    <FaTrash className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                  <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => {
                                      const newSkills = [...profile.skills];
                                      newSkills[skillIndex] = { ...newSkills[skillIndex], name: e.target.value };
                                      setProfile({ ...profile, skills: newSkills });
                                    }}
                                    className="input input-bordered input-sm w-full focus:ring-2 focus:ring-primary/20"
                                    placeholder="Skill Name (e.g., JavaScript, Python)"
                                  />
                                  <select
                                    value={skill.category}
                                    onChange={(e) => {
                                      const newSkills = [...profile.skills];
                                      newSkills[skillIndex] = { ...newSkills[skillIndex], category: e.target.value };
                                      setProfile({ ...profile, skills: newSkills });
                                    }}
                                    className="select select-bordered select-sm w-full focus:ring-2 focus:ring-primary/20"
                                  >
                                    <option value="Programming">Programming</option>
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Cloud">Cloud</option>
                                    <option value="DevOps">DevOps</option>
                                    <option value="Database">Database</option>
                                  </select>
                                  <select
                                    value={skill.level}
                                    onChange={(e) => {
                                      const newSkills = [...profile.skills];
                                      newSkills[skillIndex] = { ...newSkills[skillIndex], level: e.target.value };
                                      setProfile({ ...profile, skills: newSkills });
                                    }}
                                    className="select select-bordered select-sm w-full focus:ring-2 focus:ring-primary/20"
                                  >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gradient-to-r from-base-100 to-base-200/50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-semibold text-base-content text-lg">{skill.name}</span>
                                  <span className="badge badge-outline badge-sm">{skill.level}</span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-3 mb-2">
                                  <div
                                    className={`h-3 rounded-full transition-all duration-500 ${getSkillLevelColor(skill.level)}`}
                                    style={{ width: getSkillLevelWidth(skill.level) }}
                                  ></div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-base-content/60">
                                  <span>Proficiency Level</span>
                                  <span className="font-medium">{skill.level}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {categorySkills.length === 0 && (isEditing || editingSection === 'skills') && (
                          <div className="text-center py-8 text-base-content/50 bg-base-200 rounded-lg">
                            <FaCode className="w-8 h-8 mx-auto mb-2 text-base-content/30" />
                            <p className="text-sm">No skills in {category} category</p>
                            <p className="text-xs">Add skills using the form below</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {(isEditing || editingSection === 'skills') && (
                <div className="bg-gradient-to-r from-base-100 to-base-200/30 rounded-xl border border-base-300 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FaPlus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">Add New Skill</h3>
                      <p className="text-sm text-base-content/70">Add your technical skills and expertise</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="label">
                        <span className="label-text font-medium">Skill Name</span>
                      </label>
                      <input
                        type="text"
                        id="skillName"
                        placeholder="e.g., JavaScript, Python, React"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="label">
                        <span className="label-text font-medium">Category</span>
                      </label>
                      <select
                        id="skillCategory"
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select Category</option>
                        <option value="Programming">Programming</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Cloud">Cloud</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Database">Database</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="label">
                        <span className="label-text font-medium">Proficiency Level</span>
                      </label>
                      <select
                        id="skillLevel"
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        const skillName = document.getElementById('skillName').value.trim();
                        const category = document.getElementById('skillCategory').value;
                        const level = document.getElementById('skillLevel').value;
                        
                        if (skillName && category && level) {
                          setProfile({
                            ...profile,
                            skills: [...profile.skills, {
                              name: skillName,
                              category: category,
                              level: level
                            }]
                          });
                          // Clear form
                          document.getElementById('skillName').value = '';
                          document.getElementById('skillCategory').value = '';
                          document.getElementById('skillLevel').value = 'Beginner';
                        }
                      }}
                      className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <FaPlus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {/* Portfolio Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
                  <FaFileAlt className="w-6 h-6 text-primary" />
                  Portfolio & Projects
                </h2>
                <div className="flex gap-2">
                  {editingSection === 'portfolio' ? (
                    <>
                      <button 
                        onClick={() => setEditingSection(null)}
                        className="btn btn-sm btn-ghost hover:bg-base-200"
                        title="Cancel"
                      >
                        <FaTimes className="w-4 h-4" />
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSectionSave('Portfolio')}
                        className="btn btn-sm btn-primary"
                        title="Save Changes"
                      >
                        <FaSave className="w-4 h-4" />
                        Save
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditingSection('portfolio')}
                      className="btn btn-sm btn-primary"
                      title="Edit Portfolio"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit Portfolio
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.portfolio.map((project, projectIndex) => (
                  <div key={project.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body">
                      {(isEditing || editingSection === 'portfolio') ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-primary">Project {projectIndex + 1}</h3>
                            <button
                              onClick={() => {
                                const newPortfolio = profile.portfolio.filter((_, i) => i !== projectIndex);
                                setProfile({ ...profile, portfolio: newPortfolio });
                              }}
                              className="btn btn-sm btn-error"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => {
                              const newPortfolio = [...profile.portfolio];
                              newPortfolio[projectIndex] = { ...newPortfolio[projectIndex], title: e.target.value };
                              setProfile({ ...profile, portfolio: newPortfolio });
                            }}
                            className="input input-bordered w-full"
                            placeholder="Project Title"
                          />
                          <textarea
                            value={project.description}
                            onChange={(e) => {
                              const newPortfolio = [...profile.portfolio];
                              newPortfolio[projectIndex] = { ...newPortfolio[projectIndex], description: e.target.value };
                              setProfile({ ...profile, portfolio: newPortfolio });
                            }}
                            className="textarea textarea-bordered w-full"
                            placeholder="Project Description"
                            rows={3}
                          />
                          <input
                            type="url"
                            value={project.url}
                            onChange={(e) => {
                              const newPortfolio = [...profile.portfolio];
                              newPortfolio[projectIndex] = { ...newPortfolio[projectIndex], url: e.target.value };
                              setProfile({ ...profile, portfolio: newPortfolio });
                            }}
                            className="input input-bordered w-full"
                            placeholder="https://example.com or example.com"
                          />
                          <div>
                            <label className="label">
                              <span className="label-text font-medium">Technologies Used</span>
                            </label>
                            {project.technologies.map((tech, techIndex) => (
                              <div key={techIndex} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={tech}
                                  onChange={(e) => {
                                    const newPortfolio = [...profile.portfolio];
                                    const newTechnologies = [...newPortfolio[projectIndex].technologies];
                                    newTechnologies[techIndex] = e.target.value;
                                    newPortfolio[projectIndex] = { ...newPortfolio[projectIndex], technologies: newTechnologies };
                                    setProfile({ ...profile, portfolio: newPortfolio });
                                  }}
                                  className="input input-bordered flex-1"
                                  placeholder="Technology"
                                />
                                <button
                                  onClick={() => {
                                    const newPortfolio = [...profile.portfolio];
                                    const newTechnologies = newPortfolio[projectIndex].technologies.filter((_, i) => i !== techIndex);
                                    newPortfolio[projectIndex] = { ...newPortfolio[projectIndex], technologies: newTechnologies };
                                    setProfile({ ...profile, portfolio: newPortfolio });
                                  }}
                                  className="btn btn-sm btn-error"
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newPortfolio = [...profile.portfolio];
                                newPortfolio[projectIndex] = { 
                                  ...newPortfolio[projectIndex], 
                                  technologies: [...newPortfolio[projectIndex].technologies, ''] 
                                };
                                setProfile({ ...profile, portfolio: newPortfolio });
                              }}
                              className="btn btn-sm btn-outline"
                            >
                              <FaPlus className="w-3 h-3" />
                              Add Technology
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="card-title text-base-content">{project.title}</h3>
                          <p className="text-base-content/70 text-sm">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.technologies.map((tech, index) => (
                              <span key={index} className="badge badge-outline badge-sm">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="card-actions justify-end mt-4">
                            <button 
                              onClick={() => {
                                if (!project.url || project.url.trim() === '') {
                                  Swal.fire({
                                    icon: 'warning',
                                    title: 'No URL Available',
                                    text: 'Please add a project URL in edit mode to view the live project.',
                                    confirmButtonText: 'OK'
                                  });
                                  return;
                                }
                                
                                // Clean and validate URL format
                                let cleanUrl = project.url.trim();
                                
                                // Add protocol if missing
                                if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
                                  cleanUrl = 'https://' + cleanUrl;
                                }
                                
                                // Validate URL format
                                try {
                                  new URL(cleanUrl);
                                  window.open(cleanUrl, '_blank', 'noopener,noreferrer');
                                } catch (error) {
                                  Swal.fire({
                                    icon: 'error',
                                    title: 'Invalid URL',
                                    text: `The URL "${project.url}" is not valid. Please check the format and try again.`,
                                    confirmButtonText: 'OK'
                                  });
                                }
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              <FaGlobe className="w-4 h-4" />
                              View Project
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {(isEditing || editingSection === 'portfolio') && (
                <button 
                  onClick={() => setProfile({
                    ...profile,
                    portfolio: [...profile.portfolio, {
                      id: Date.now(),
                      title: '',
                      description: '',
                      url: '',
                      technologies: ['']
                    }]
                  })}
                  className="btn btn-outline w-full hover:bg-accent hover:text-accent-content transition-all duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Project
                </button>
              )}
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              {/* Certifications Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
                  <FaAward className="w-6 h-6 text-primary" />
                  Certifications & Licenses
                </h2>
                <div className="flex gap-2">
                  {editingSection === 'certifications' ? (
                    <>
                      <button 
                        onClick={() => setEditingSection(null)}
                        className="btn btn-sm btn-ghost hover:bg-base-200"
                        title="Cancel"
                      >
                        <FaTimes className="w-4 h-4" />
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSectionSave('Certifications')}
                        className="btn btn-sm btn-primary"
                        title="Save Changes"
                      >
                        <FaSave className="w-4 h-4" />
                        Save
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditingSection('certifications')}
                      className="btn btn-sm btn-primary"
                      title="Edit Certifications"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit Certifications
                    </button>
                  )}
                </div>
              </div>

              {profile.certifications.map((cert, certIndex) => (
                <div key={cert.id} className="p-4 bg-base-200 rounded-lg">
                  {(isEditing || editingSection === 'certifications') ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-primary">Certification {certIndex + 1}</h3>
                        <button
                          onClick={() => {
                            const newCertifications = profile.certifications.filter((_, i) => i !== certIndex);
                            setProfile({ ...profile, certifications: newCertifications });
                          }}
                          className="btn btn-sm btn-error"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const newCertifications = [...profile.certifications];
                            newCertifications[certIndex] = { ...newCertifications[certIndex], name: e.target.value };
                            setProfile({ ...profile, certifications: newCertifications });
                          }}
                          className="input input-bordered"
                          placeholder="Certification Name"
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const newCertifications = [...profile.certifications];
                            newCertifications[certIndex] = { ...newCertifications[certIndex], issuer: e.target.value };
                            setProfile({ ...profile, certifications: newCertifications });
                          }}
                          className="input input-bordered"
                          placeholder="Issuing Organization"
                        />
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => {
                            const newCertifications = [...profile.certifications];
                            newCertifications[certIndex] = { ...newCertifications[certIndex], date: e.target.value };
                            setProfile({ ...profile, certifications: newCertifications });
                          }}
                          className="input input-bordered"
                          placeholder="Issue Date (e.g., Jan 2023)"
                        />
                        <input
                          type="text"
                          value={cert.credentialId}
                          onChange={(e) => {
                            const newCertifications = [...profile.certifications];
                            newCertifications[certIndex] = { ...newCertifications[certIndex], credentialId: e.target.value };
                            setProfile({ ...profile, certifications: newCertifications });
                          }}
                          className="input input-bordered"
                          placeholder="Credential ID"
                        />
                      </div>
                      <input
                        type="url"
                        value={cert.url}
                        onChange={(e) => {
                          const newCertifications = [...profile.certifications];
                          newCertifications[certIndex] = { ...newCertifications[certIndex], url: e.target.value };
                          setProfile({ ...profile, certifications: newCertifications });
                        }}
                        className="input input-bordered w-full"
                        placeholder="Verification URL (optional)"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FaAward className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base-content">{cert.name}</h3>
                          <p className="text-sm text-base-content/70">{cert.issuer}</p>
                          <p className="text-xs text-base-content/60">
                            Issued: {cert.date} • ID: {cert.credentialId}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {cert.url && (
                          <a href={cert.url} className="btn btn-ghost btn-sm">
                            <FaDownload className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(isEditing || editingSection === 'certifications') && (
                <button 
                  onClick={() => setProfile({
                    ...profile,
                    certifications: [...profile.certifications, {
                      id: Date.now(),
                      name: '',
                      issuer: '',
                      date: '',
                      credentialId: '',
                      url: ''
                    }]
                  })}
                  className="btn btn-outline w-full hover:bg-warning hover:text-warning-content transition-all duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Certification
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href={`/profile/${profile?.personalInfo?.email || ''}`} className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200">
            <FaEye className="w-4 h-4" />
            Preview Public Profile
          </a>
          <button className="btn btn-outline hover:bg-primary hover:text-primary-content transition-all duration-200">
            <FaShare className="w-4 h-4" />
            Share Profile
          </button>
          <a
            href={resumeUrl || profile?.resumeUrl || '#'}
            target={resumeUrl || profile?.resumeUrl ? '_blank' : undefined}
            rel="noreferrer"
            className={`btn btn-outline hover:bg-secondary hover:text-secondary-content transition-all duration-200 ${!(resumeUrl || profile?.resumeUrl) ? 'btn-disabled' : ''}`}
          >
            <FaDownload className="w-4 h-4" />
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
}
