'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { 
  FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaBriefcase, FaGraduationCap, FaCode, FaAward, FaFileAlt,
  FaLinkedin, FaGithub, FaGlobe, FaTwitter, FaRocket,
  FaCalendarAlt, FaBuilding, FaUserTie, FaLanguage, FaDownload,
  FaSpinner, FaTimesCircle, FaCheckCircle, FaEdit, FaSave
} from 'react-icons/fa';

export default function CandidateProfileViewPage() {
  const { data: session } = useSession();
  const params = useParams();
  const candidateEmail = params.email;
  
  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCandidateProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/company/candidate-profile/${candidateEmail}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setCandidate(data.candidate);
        setApplications(data.applications || []);
      } else {
        setError(data.error || 'Failed to fetch candidate profile');
      }
    } catch (err) {
      console.error('Error fetching candidate profile:', err);
      setError('Failed to fetch candidate profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (candidateEmail && session?.user?.email) {
      fetchCandidateProfile();
    }
  }, [candidateEmail, session?.user?.email]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'badge-info';
      case 'Under Review':
        return 'badge-warning';
      case 'Shortlisted':
        return 'badge-primary';
      case 'Interview Scheduled':
        return 'badge-secondary';
      case 'Accepted':
        return 'badge-success';
      case 'Rejected':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
        return <FaFileAlt className="w-3 h-3" />;
      case 'Under Review':
        return <FaSpinner className="w-3 h-3" />;
      case 'Shortlisted':
        return <FaCheckCircle className="w-3 h-3" />;
      case 'Interview Scheduled':
        return <FaCalendarAlt className="w-3 h-3" />;
      case 'Accepted':
        return <FaCheckCircle className="w-3 h-3" />;
      case 'Rejected':
        return <FaTimesCircle className="w-3 h-3" />;
      default:
        return <FaFileAlt className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Candidate Not Found</h2>
          <p className="text-base-content/70 mb-4">{error || "The candidate profile you're looking for doesn't exist."}</p>
          <Link href="/dashboard/company/applications" className="btn btn-primary">
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/company/applications" className="btn btn-ghost btn-circle">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-base-content">Candidate Profile</h1>
                <p className="text-base-content/70">View candidate information and application history</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidate Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-xl shadow-sm p-6 sticky top-8">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                  {candidate.personalInfo?.avatar ? (
                    <img 
                      src={candidate.personalInfo.avatar} 
                      alt={candidate.personalInfo.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUser className="w-16 h-16 text-primary" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-base-content">
                  {candidate.personalInfo?.name || 'Unknown Candidate'}
                </h2>
                <p className="text-primary font-semibold">
                  {candidate.personalInfo?.professionalTitle || 'Professional Title'}
                </p>
                <p className="text-base-content/70 text-sm">
                  {candidate.personalInfo?.email || candidateEmail}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-base-content flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4" />
                  Contact Information
                </h3>
                {candidate.personalInfo?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone className="w-4 h-4 text-base-content/50" />
                    <span>{candidate.personalInfo.phone}</span>
                  </div>
                )}
                {candidate.personalInfo?.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="w-4 h-4 text-base-content/50" />
                    <span>{candidate.personalInfo.location}</span>
                  </div>
                )}
                {candidate.personalInfo?.availability && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaRocket className="w-4 h-4 text-base-content/50" />
                    <span>{candidate.personalInfo.availability}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(candidate.socialLinks?.linkedin || candidate.socialLinks?.github || candidate.socialLinks?.website) && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-base-content flex items-center gap-2">
                    <FaGlobe className="w-4 h-4" />
                    Social Links
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.socialLinks?.linkedin && (
                      <a 
                        href={candidate.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <FaLinkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {candidate.socialLinks?.github && (
                      <a 
                        href={candidate.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <FaGithub className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {candidate.socialLinks?.website && (
                      <a 
                        href={candidate.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <FaGlobe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="btn btn-primary btn-sm w-full">
                  <FaEnvelope className="w-4 h-4" />
                  Send Message
                </button>
                <button className="btn btn-outline btn-sm w-full">
                  <FaDownload className="w-4 h-4" />
                  Download Resume
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {candidate.personalInfo?.bio && (
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-base-content mb-4">About</h3>
                <p className="text-base-content/80 leading-relaxed">
                  {candidate.personalInfo.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                  <FaCode className="w-5 h-5" />
                  Skills & Expertise
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidate.skills.map((skill, index) => (
                    <div key={index} className="bg-base-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-base-content">{skill.name}</span>
                        <span className="badge badge-outline badge-sm">{skill.level}</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            skill.level === 'Expert' ? 'bg-green-500' :
                            skill.level === 'Advanced' ? 'bg-blue-500' :
                            skill.level === 'Intermediate' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                          style={{
                            width: skill.level === 'Expert' ? '90%' :
                                   skill.level === 'Advanced' ? '75%' :
                                   skill.level === 'Intermediate' ? '60%' : '30%'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {candidate.experience && candidate.experience.length > 0 && (
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                  <FaBriefcase className="w-5 h-5" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {candidate.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-primary/20 pl-4">
                      <h4 className="font-semibold text-base-content">{exp.title}</h4>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-sm text-base-content/70">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                      </p>
                      {exp.location && (
                        <p className="text-sm text-base-content/60 flex items-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          {exp.location}
                        </p>
                      )}
                      {exp.description && (
                        <p className="text-sm text-base-content/80 mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {candidate.education && candidate.education.length > 0 && (
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                  <FaGraduationCap className="w-5 h-5" />
                  Education
                </h3>
                <div className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-primary/20 pl-4">
                      <h4 className="font-semibold text-base-content">{edu.degree}</h4>
                      <p className="text-primary font-medium">{edu.institution}</p>
                      <p className="text-sm text-base-content/70">
                        {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                      </p>
                      {edu.gpa && (
                        <p className="text-sm text-base-content/60">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application History */}
            {applications.length > 0 && (
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                  <FaFileAlt className="w-5 h-5" />
                  Application History
                </h3>
                <div className="space-y-3">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-base-content">{app.job?.title || 'Job Title'}</h4>
                        <p className="text-sm text-base-content/70">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`badge ${getStatusColor(app.status)} gap-1`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
