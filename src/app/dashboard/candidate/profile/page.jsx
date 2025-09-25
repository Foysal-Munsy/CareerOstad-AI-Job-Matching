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
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

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

  const [stats] = useState({
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/candidate"
            className="btn btn-ghost btn-sm"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <FaUser className="w-6 h-6" />
              My Profile
            </h1>
            <p className="text-base-content/70">
              Manage your professional profile and showcase your skills
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary btn-sm"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <FaSave className="w-4 h-4" />
                )}
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost btn-sm"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-primary btn-sm"
            >
              <FaEdit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <div>
              <p className="text-sm text-base-content/60">Completeness</p>
              <p className="text-xl font-bold text-primary">{stats.profileCompleteness}%</p>
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
      <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {profile.personalInfo.avatar ? (
                  <img 
                    src={profile.personalInfo.avatar} 
                    alt={profile.personalInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-16 h-16 text-primary" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 btn btn-sm btn-circle bg-primary text-primary-content">
                  <FaCamera className="w-3 h-3" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profile.personalInfo.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, name: e.target.value }
                    })}
                    className="input input-bordered w-full text-2xl font-bold"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={profile.personalInfo.professionalTitle}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, professionalTitle: e.target.value }
                    })}
                    className="input input-bordered w-full text-lg"
                    placeholder="Professional Title"
                  />
                  <textarea
                    value={profile.personalInfo.bio}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, bio: e.target.value }
                    })}
                    className="textarea textarea-bordered w-full"
                    placeholder="Bio"
                    rows={3}
                  />
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
                  {profile.personalInfo.experience}
                </span>
                <span className="flex items-center gap-1">
                  <FaRocket className="w-4 h-4" />
                  {profile.personalInfo.availability}
                </span>
              </div>

              {/* Social Links */}
              <div className="mt-4">
                {isEditing ? (
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
      <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
        <div className="border-b border-base-300">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-base-content/70 hover:text-base-content hover:bg-base-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-base-content">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="w-5 h-5 text-primary" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={profile.personalInfo.email}
                          onChange={(e) => setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, email: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1"
                          placeholder="Email"
                        />
                      ) : (
                        <span className="text-base-content">{profile.personalInfo.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="w-5 h-5 text-primary" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profile.personalInfo.phone}
                          onChange={(e) => setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, phone: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1"
                          placeholder="Phone Number"
                        />
                      ) : (
                        <span className="text-base-content">{profile.personalInfo.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="w-5 h-5 text-primary" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.personalInfo.location}
                          onChange={(e) => setProfile({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, location: e.target.value }
                          })}
                          className="input input-bordered input-sm flex-1"
                          placeholder="Location"
                        />
                      ) : (
                        <span className="text-base-content">{profile.personalInfo.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-base-content">Languages</h3>
                    {isEditing && (
                      <button
                        onClick={() => setProfile({
                          ...profile,
                          languages: [...profile.languages, { name: '', proficiency: 'Beginner' }]
                        })}
                        className="btn btn-sm btn-primary"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {profile.languages.map((language, index) => (
                      <div key={index} className="flex items-center justify-between gap-3">
                        {isEditing ? (
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
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-base-content">Top Skills</h3>
                  {isEditing && (
                    <button
                      onClick={() => setProfile({
                        ...profile,
                        skills: [...profile.skills, { name: '', category: '', level: 'Beginner' }]
                      })}
                      className="btn btn-sm btn-primary"
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="p-4 bg-base-200 rounded-lg">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...profile.skills];
                              newSkills[index] = { ...newSkills[index], name: e.target.value };
                              setProfile({ ...profile, skills: newSkills });
                            }}
                            className="input input-bordered input-sm w-full"
                            placeholder="Skill Name"
                          />
                          <input
                            type="text"
                            value={skill.category}
                            onChange={(e) => {
                              const newSkills = [...profile.skills];
                              newSkills[index] = { ...newSkills[index], category: e.target.value };
                              setProfile({ ...profile, skills: newSkills });
                            }}
                            className="input input-bordered input-sm w-full"
                            placeholder="Category"
                          />
                          <select
                            value={skill.level}
                            onChange={(e) => {
                              const newSkills = [...profile.skills];
                              newSkills[index] = { ...newSkills[index], level: e.target.value };
                              setProfile({ ...profile, skills: newSkills });
                            }}
                            className="select select-bordered select-sm w-full"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                          <button
                            onClick={() => {
                              const newSkills = profile.skills.filter((_, i) => i !== index);
                              setProfile({ ...profile, skills: newSkills });
                            }}
                            className="btn btn-sm btn-error w-full"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {profile.experience.map((exp, expIndex) => (
                <div key={exp.id} className="border-l-4 border-primary pl-6 pb-6">
                  {isEditing ? (
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
              {isEditing && (
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
                  className="btn btn-outline w-full"
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
              {profile.education.map((edu, eduIndex) => (
                <div key={edu.id} className="border-l-4 border-secondary pl-6 pb-6">
                  {isEditing ? (
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
              {isEditing && (
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
                  className="btn btn-outline w-full"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Education
                </button>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Programming', 'Frontend', 'Backend', 'Cloud', 'DevOps', 'Database'].map((category) => {
                  const categorySkills = profile.skills.filter(skill => skill.category === category);
                  
                  return (
                    <div key={category} className="space-y-4">
                      <h3 className="text-lg font-bold text-base-content">{category}</h3>
                      <div className="space-y-3">
                        {categorySkills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="space-y-2">
                            {isEditing ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-md font-bold text-primary">Skill {skillIndex + 1}</h4>
                                  <button
                                    onClick={() => {
                                      const newSkills = profile.skills.filter((_, i) => i !== skillIndex);
                                      setProfile({ ...profile, skills: newSkills });
                                    }}
                                    className="btn btn-sm btn-error"
                                  >
                                    <FaTrash className="w-3 h-3" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={skill.name}
                                  onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[skillIndex] = { ...newSkills[skillIndex], name: e.target.value };
                                    setProfile({ ...profile, skills: newSkills });
                                  }}
                                  className="input input-bordered input-sm w-full"
                                  placeholder="Skill Name"
                                />
                                <input
                                  type="text"
                                  value={skill.category}
                                  onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[skillIndex] = { ...newSkills[skillIndex], category: e.target.value };
                                    setProfile({ ...profile, skills: newSkills });
                                  }}
                                  className="input input-bordered input-sm w-full"
                                  placeholder="Category"
                                />
                                <select
                                  value={skill.level}
                                  onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[skillIndex] = { ...newSkills[skillIndex], level: e.target.value };
                                    setProfile({ ...profile, skills: newSkills });
                                  }}
                                  className="select select-bordered select-sm w-full"
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Expert">Expert</option>
                                </select>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-base-content">{skill.name}</span>
                                  <span className="text-sm text-base-content/60">{skill.level}</span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                                    style={{ width: getSkillLevelWidth(skill.level) }}
                                  ></div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        {categorySkills.length === 0 && isEditing && (
                          <div className="text-center text-base-content/50 py-4">
                            No skills in {category} category
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {isEditing && (
                <div className="space-y-4">
                  <div className="divider">Add New Skill</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Skill Name"
                      className="input input-bordered"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const skillName = e.target.value.trim();
                          const category = e.target.nextElementSibling.value;
                          const level = e.target.nextElementSibling.nextElementSibling.value;
                          if (skillName && category && level) {
                            setProfile({
                              ...profile,
                              skills: [...profile.skills, {
                                name: skillName,
                                category: category,
                                level: level
                              }]
                            });
                            e.target.value = '';
                            e.target.nextElementSibling.value = '';
                            e.target.nextElementSibling.nextElementSibling.value = 'Beginner';
                          }
                        }
                      }}
                    />
                    <select
                      className="select select-bordered"
                      onChange={(e) => {
                        const skillName = e.target.previousElementSibling.value;
                        const level = e.target.nextElementSibling.value;
                        if (skillName && e.target.value && level) {
                          setProfile({
                            ...profile,
                            skills: [...profile.skills, {
                              name: skillName,
                              category: e.target.value,
                              level: level
                            }]
                          });
                          e.target.previousElementSibling.value = '';
                          e.target.value = '';
                          e.target.nextElementSibling.value = 'Beginner';
                        }
                      }}
                    >
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Cloud">Cloud</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Database">Database</option>
                    </select>
                    <select
                      className="select select-bordered"
                      onChange={(e) => {
                        const skillName = e.target.previousElementSibling.previousElementSibling.value;
                        const category = e.target.previousElementSibling.value;
                        if (skillName && category && e.target.value) {
                          setProfile({
                            ...profile,
                            skills: [...profile.skills, {
                              name: skillName,
                              category: category,
                              level: e.target.value
                            }]
                          });
                          e.target.previousElementSibling.previousElementSibling.value = '';
                          e.target.previousElementSibling.value = '';
                          e.target.value = 'Beginner';
                        }
                      }}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.portfolio.map((project, projectIndex) => (
                  <div key={project.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body">
                      {isEditing ? (
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
              {isEditing && (
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
                  className="btn btn-outline w-full"
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
              {profile.certifications.map((cert, certIndex) => (
                <div key={cert.id} className="p-4 bg-base-200 rounded-lg">
                  {isEditing ? (
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
              {isEditing && (
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
                  className="btn btn-outline w-full"
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
      <div className="flex justify-center gap-4">
        <button className="btn btn-primary">
          <FaEye className="w-4 h-4" />
          Preview Public Profile
        </button>
        <button className="btn btn-outline">
          <FaShare className="w-4 h-4" />
          Share Profile
        </button>
        <button className="btn btn-outline">
          <FaDownload className="w-4 h-4" />
          Download Resume
        </button>
      </div>
    </div>
  );
}
