"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function JobDetailsPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [matchingData, setMatchingData] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch job");
        console.log('Job data:', data.job); // Debug log
        setJob(data.job);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchJob();
    }
  }, [id]);

  useEffect(() => {
    async function fetchSaved() {
      if (!session?.user?.email || !job?._id) return;
      try {
        const res = await fetch('/api/saved-jobs', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.success) {
          const ids = new Set((data.saved || []).map(s => s.jobId));
          setSaved(ids.has(job._id));
        }
      } catch {}
    }
    fetchSaved();
  }, [session?.user?.email, job?._id]);

  // Fetch user profile
  useEffect(() => {
    async function fetchUserProfile() {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    
    fetchUserProfile();
  }, [session?.user?.email]);

  // Fetch job matching data
  useEffect(() => {
    async function fetchMatchingData() {
      if (!session?.user?.email || !job?._id) return;
      
      setLoadingMatch(true);
      try {
        const response = await fetch('/api/jobs/detailed-match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId: job._id,
            jobDescription: job.overview,
            jobRequirements: job.requirements || '',
            jobSkills: job.toolsTechnologies || []
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Detailed matching result:', result);
          setMatchingData(result);
        }
      } catch (error) {
        console.error('Error fetching matching data:', error);
      } finally {
        setLoadingMatch(false);
      }
    }
    
    if (job) {
      fetchMatchingData();
    }
  }, [session?.user?.email, job]);

  // Fetch similar jobs
  useEffect(() => {
    async function fetchSimilarJobs() {
      if (!job?._id) return;
      
      setLoadingSimilar(true);
      try {
        const response = await fetch(`/api/jobs/recommended?category=${encodeURIComponent(job.category)}&limit=3`);
        if (response.ok) {
          const data = await response.json();
          setSimilarJobs(data.jobs || []);
        }
      } catch (error) {
        console.error('Error fetching similar jobs:', error);
      } finally {
        setLoadingSimilar(false);
      }
    }
    
    if (job) {
      fetchSimilarJobs();
    }
  }, [job]);

  const handleApply = () => {
    if (!session?.user?.email) {
      // If user is not logged in, redirect to login with callback URL
      const callbackUrl = encodeURIComponent(`/jobs/${id}/apply`);
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }
    
    // If user is logged in, navigate to apply page
    router.push(`/jobs/${id}/apply`);
  };
  const toggleSave = async () => {
    if (!session?.user?.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to save jobs',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        const res = await fetch(`/api/saved-jobs?jobId=${encodeURIComponent(job._id)}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.success) setSaved(false);
      } else {
        const res = await fetch('/api/saved-jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId: job._id }) });
        const data = await res.json();
        if (res.ok && data.success) setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  };


  const isApplicationDeadlinePassed = job?.applicationDeadline ? 
    new Date(job.applicationDeadline) < new Date() : false;

  // Function to check if user has specific skill
  const checkSkillMatch = (requiredSkill) => {
    try {
      if (!userProfile?.skills || !Array.isArray(userProfile.skills) || userProfile.skills.length === 0) {
        return false;
      }
      
      if (!requiredSkill || typeof requiredSkill !== 'string') {
        return false;
      }
      
      // Normalize both user skills and required skill for case-insensitive comparison
      const userSkills = userProfile.skills
        .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
        .map(skill => skill.trim().toLowerCase());
      
      const skillToCheck = requiredSkill.trim().toLowerCase();
      
      if (!skillToCheck) return false;
    
    // Direct match
    if (userSkills.includes(skillToCheck)) return true;
    
    // Partial match for similar technologies (case-insensitive)
    const skillVariations = {
      'javascript': ['js', 'ecmascript', 'node.js', 'nodejs', 'javascript es6', 'es6', 'jsx'],
      'react': ['reactjs', 'react.js', 'reactjs', 'react native', 'reactjs', 'reactjs'],
      'node.js': ['nodejs', 'node', 'express', 'express.js', 'expressjs', 'nodejs'],
      'express': ['express.js', 'expressjs', 'node.js', 'nodejs', 'expressjs'],
      'python': ['py', 'django', 'flask', 'python3', 'python 3', 'python3'],
      'html': ['html5', 'html 5', 'html5'],
      'css': ['css3', 'css 3', 'scss', 'sass', 'less', 'stylus', 'css3'],
      'mongodb': ['mongo', 'mongo db', 'nosql', 'no sql', 'mongodb'],
      'mysql': ['sql', 'database', 'my sql', 'postgresql', 'postgres', 'mysql'],
      'git': ['github', 'gitlab', 'bitbucket', 'version control', 'git hub', 'git lab', 'git'],
      'vs code': ['visual studio code', 'vscode', 'visual studio', 'code editor', 'editor', 'vs code'],
      'aws': ['amazon web services', 'cloud', 'amazon cloud', 'aws'],
      'docker': ['containerization', 'containers', 'docker container', 'docker'],
      'kubernetes': ['k8s', 'orchestration', 'kube', 'kubernetes'],
      'typescript': ['ts', 'type script', 'typescript'],
      'vue': ['vue.js', 'vuejs', 'vue 3', 'vue3', 'vue'],
      'angular': ['angularjs', 'angular.js', 'angular 2', 'angular2', 'angular']
    };
    
      // Check for variations (case-insensitive)
      for (const [mainSkill, variations] of Object.entries(skillVariations)) {
        const normalizedMainSkill = mainSkill.toLowerCase();
        const normalizedVariations = variations.map(v => v.toLowerCase());
        
        if (skillToCheck.includes(normalizedMainSkill) || normalizedMainSkill.includes(skillToCheck)) {
          return userSkills.some(userSkill => 
            userSkill.includes(normalizedMainSkill) || 
            normalizedVariations.some(variation => userSkill.includes(variation))
          );
        }
      }
      
      // Additional flexible matching (case-insensitive)
      const flexibleMatch = userSkills.some(userSkill => {
        // Check if any part of the required skill matches any part of user skill
        const skillParts = skillToCheck.split(/[\s\-_\.]+/);
        const userSkillParts = userSkill.split(/[\s\-_\.]+/);
        
        return skillParts.some(part => 
          part.length > 2 && userSkillParts.some(userPart => 
            userPart.includes(part) || part.includes(userPart)
          )
        );
      });
      
      return flexibleMatch;
    } catch (error) {
      console.error('Error in checkSkillMatch:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-base-content/70 mb-4">{error || "The job you're looking for doesn't exist."}</p>
          <Link href="/jobs" className="btn btn-primary">Browse All Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Breadcrumb */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="breadcrumbs text-sm">
            <ul>
              <li><Link href="/" className="text-primary hover:underline">Home</Link></li>
              <li><Link href="/jobs" className="text-primary hover:underline">Jobs</Link></li>
              <li>{job.title}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 order-1 lg:order-1">
            {/* Job Header */}
            <div className="bg-base-100 rounded-xl shadow-md p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-7 h-7 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold">{job.title}</h1>
                            {job.isFeatured && (
                              <div className="badge badge-warning badge-lg flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                Featured Job
                              </div>
                            )}
                          </div>
                          <p className="text-lg text-primary font-semibold mb-2">{job.companyName}</p>
                        </div>
                        {/* Job Matching Badge */}
                        {session?.user?.email && (
                          <div className="text-right">
                            {loadingMatch ? (
                              <div className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-xs"></span>
                                <span className="text-xs text-base-content/60">Calculating...</span>
                              </div>
                            ) : matchingData?.matchingPercentage !== undefined ? (
                              <div className="text-right">
                                <div className={`badge font-bold ${
                                  matchingData.matchingPercentage >= 80 ? 'badge-success' :
                                  matchingData.matchingPercentage >= 60 ? 'badge-warning' :
                                  'badge-error'
                                }`}>
                                  {matchingData.matchingPercentage}% Match
                                </div>
                                <div className="w-20 bg-base-300 rounded-full h-1.5 mt-1">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      matchingData.matchingPercentage >= 80 ? 'bg-success' :
                                      matchingData.matchingPercentage >= 60 ? 'bg-warning' :
                                      'bg-error'
                                    }`}
                                    style={{ width: `${matchingData.matchingPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="badge badge-primary">{job.category}</span>
                        <span className="badge badge-outline">{job.employmentType}</span>
                        <span className="badge badge-outline">{job.jobLevel}</span>
                        <span className="badge badge-outline">{job.workMode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    {job.applicationDeadline && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className={isApplicationDeadlinePassed ? "text-error" : "text-warning"}>
                          Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                          {isApplicationDeadlinePassed && " (Expired)"}
                        </span>
                      </div>
                    )}
                    {job.numberOfVacancies > 1 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        <span>{job.numberOfVacancies} positions available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Overview */}
            <div className="bg-base-100 rounded-xl shadow-md p-4">
              <h2 className="text-xl font-bold mb-3">Job Overview</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-base-content/80 leading-relaxed text-sm">
                  {job.overview}
                </p>
              </div>
            </div>

              {/* Professional Job Matching Analysis */}
              {session?.user?.email && matchingData && (
                <div className="bg-base-100 rounded-xl shadow-md p-4">
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    AI-Powered Match Analysis
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        matchingData.matchingPercentage >= 80 ? 'text-success' :
                        matchingData.matchingPercentage >= 60 ? 'text-warning' :
                        'text-error'
                      }`}>
                        {matchingData.matchingPercentage}%
                      </div>
                      <div className="text-xs text-base-content/70">Overall Match</div>
                      <div className="w-full bg-base-300 rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${
                            matchingData.matchingPercentage >= 80 ? 'bg-success' :
                            matchingData.matchingPercentage >= 60 ? 'bg-warning' :
                            'bg-error'
                          }`}
                          style={{ width: `${matchingData.matchingPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-info">
                        {matchingData.matchingPercentage >= 80 ? 'Excellent' :
                         matchingData.matchingPercentage >= 60 ? 'Good' :
                         matchingData.matchingPercentage >= 40 ? 'Fair' : 'Needs Improvement'}
                      </div>
                      <div className="text-xs text-base-content/70">Match Quality</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {matchingData.matchingPercentage >= 80 ? 'Highly Recommended' :
                         matchingData.matchingPercentage >= 60 ? 'Recommended' :
                         matchingData.matchingPercentage >= 40 ? 'Consider' : 'Not Recommended'}
                      </div>
                      <div className="text-xs text-base-content/70">Recommendation</div>
                    </div>
                  </div>
                </div>
              )}

            {/* Key Requirements */}
            <div className="bg-base-100 rounded-xl shadow-md p-4">
              <h2 className="text-xl font-bold mb-3">Key Requirements</h2>
              <div className="prose max-w-none">
                {job.requirements && job.requirements.includes('\n') ? (
                  <div className="space-y-1">
                    {job.requirements.split('\n').filter(req => req.trim()).map((requirement, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{requirement.trim()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-base-content/80 leading-relaxed text-sm">
                    {job.requirements}
                  </p>
                )}
              </div>
            </div>

            {/* Professional Skills Analysis */}
            {session?.user?.email && job.toolsTechnologies && Array.isArray(job.toolsTechnologies) && job.toolsTechnologies.length > 0 && (
              <div className="bg-base-100 rounded-xl shadow-md p-4">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Skills Analysis
                </h2>
                
                {/* AI-Powered Skills Breakdown */}
                {matchingData && (matchingData.matchingSkills || matchingData.missingSkills || matchingData.extraSkills) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Matching Skills */}
                    {matchingData.matchingSkills && matchingData.matchingSkills.length > 0 && (
                      <div className="bg-success/10 rounded-lg p-3">
                        <h3 className="font-semibold text-success mb-2 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Matching Skills ({matchingData.matchingSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {matchingData.matchingSkills.map((skill, idx) => (
                            <span key={idx} className="badge badge-success badge-xs">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Skills */}
                    {matchingData.missingSkills && matchingData.missingSkills.length > 0 && (
                      <div className="bg-error/10 rounded-lg p-3">
                        <h3 className="font-semibold text-error mb-2 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Missing Skills ({matchingData.missingSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {matchingData.missingSkills.map((skill, idx) => (
                            <span key={idx} className="badge badge-error badge-xs">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extra Skills */}
                    {matchingData.extraSkills && matchingData.extraSkills.length > 0 && (
                      <div className="bg-info/10 rounded-lg p-3">
                        <h3 className="font-semibold text-info mb-2 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Extra Skills ({matchingData.extraSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {matchingData.extraSkills.map((skill, idx) => (
                            <span key={idx} className="badge badge-info badge-xs">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Analysis Summary */}
                {matchingData && matchingData.summary && (
                  <div className="bg-base-200 rounded-lg p-3 mb-4">
                    <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      AI Analysis Summary
                    </h3>
                    <p className="text-xs text-base-content/80 leading-relaxed">
                      {matchingData.summary}
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* Preferred Qualifications */}
            {job.preferredQualifications && (
              <div className="bg-base-100 rounded-xl shadow-md p-4">
                <h2 className="text-xl font-bold mb-3">Preferred Qualifications</h2>
                <div className="prose max-w-none">
                  {job.preferredQualifications.includes('\n') ? (
                    <div className="space-y-1">
                      {job.preferredQualifications.split('\n').filter(qual => qual.trim()).map((qualification, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <svg className="w-3 h-3 text-info" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{qualification.trim()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="whitespace-pre-line text-base-content/80 leading-relaxed text-sm">
                      {job.preferredQualifications}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tools & Technologies */}
            {job.toolsTechnologies?.length > 0 && (
              <div className="bg-base-100 rounded-xl shadow-md p-4">
                <h2 className="text-xl font-bold mb-3">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {job.toolsTechnologies.map((tech, idx) => (
                    <span key={idx} className="badge badge-primary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {(job.experienceRequired || job.educationRequired || job.genderPreference || job.ageLimit) && (
              <div className="bg-base-100 rounded-xl shadow-md p-4">
                <h2 className="text-xl font-bold mb-3">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.experienceRequired && (
                    <div>
                      <h3 className="font-semibold text-sm text-base-content/80 mb-1">Experience Required</h3>
                      <p className="text-xs text-base-content/70">{job.experienceRequired}</p>
                    </div>
                  )}
                  {job.educationRequired && (
                    <div>
                      <h3 className="font-semibold text-sm text-base-content/80 mb-1">Education Required</h3>
                      <p className="text-xs text-base-content/70">{job.educationRequired}</p>
                    </div>
                  )}
                  {job.genderPreference && (
                    <div>
                      <h3 className="font-semibold text-sm text-base-content/80 mb-1">Gender Preference</h3>
                      <p className="text-xs text-base-content/70">{job.genderPreference}</p>
                    </div>
                  )}
                  {job.ageLimit && (
                    <div>
                      <h3 className="font-semibold text-sm text-base-content/80 mb-1">Age Limit</h3>
                      <p className="text-xs text-base-content/70">{job.ageLimit}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {job.tags?.length > 0 && (
              <div className="bg-base-100 rounded-xl shadow-md p-4">
                <h2 className="text-xl font-bold mb-3">Tags</h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="badge badge-outline">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info - Moved from sidebar */}
            <div className="bg-base-100 rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                About {job.companyName}
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Industry:</span>
                    <span className="badge badge-outline badge-xs">{job.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Location:</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Posted:</span>
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Type:</span>
                    <span>{job.employmentType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="font-medium">Level:</span>
                    <span>{job.jobLevel}</span>
                  </div>
                  {(job.companyWebsite || job.companyEmail) && (
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Website:</span>
                      {job.companyWebsite ? (
                        <a href={job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-primary hover:underline text-xs font-medium">
                          {job.companyWebsite}
                        </a>
                      ) : (
                        <span className="text-base-content/60 text-xs">Not provided</span>
                      )}
                    </div>
                  )}
                  {job.companyEmail && (
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="font-medium">Email:</span>
                      <a href={`mailto:${job.companyEmail}`} 
                         className="text-primary hover:underline text-xs">
                        {job.companyEmail}
                      </a>
                    </div>
                  )}
                </div>

                {/* Company Culture & Benefits */}
                <div className="border-t border-base-300 pt-3">
                  <h4 className="font-semibold mb-2 text-sm text-base-content/80">Company Highlights</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Competitive salary package</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Professional development opportunities</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Modern work environment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Flexible work arrangements</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Jobs - Moved from sidebar */}
            <div className="bg-base-100 rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Similar Jobs
              </h3>
              
              {loadingSimilar ? (
                <div className="flex items-center justify-center py-6">
                  <span className="loading loading-spinner loading-sm text-primary"></span>
                </div>
              ) : similarJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                  {similarJobs.slice(0, 3).map((similarJob) => (
                    <div key={similarJob._id} className="border border-base-300 rounded-lg p-3 hover:bg-base-200 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs line-clamp-1">{similarJob.title}</h4>
                          <p className="text-xs text-primary">{similarJob.companyName}</p>
                        </div>
                        <span className="badge badge-outline badge-xs">{similarJob.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-base-content/60 mb-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{similarJob.location}</span>
                        <span>•</span>
                        <span>{similarJob.employmentType}</span>
                      </div>
                      {similarJob.salaryMin && similarJob.salaryMax && (
                        <div className="text-xs font-semibold text-success">
                          {similarJob.salaryMin.toLocaleString()} - {similarJob.salaryMax.toLocaleString()} {similarJob.salaryType}
                        </div>
                      )}
                      <Link 
                        href={`/jobs/${similarJob._id}`} 
                        className="btn btn-outline btn-xs mt-2 w-full"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-base-content/70 mb-3">
                  No similar jobs found at the moment.
                </p>
              )}
              
              <Link href="/jobs" className="btn btn-outline btn-sm mt-3 w-full">
                Browse All Jobs
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 order-2 lg:order-2">
            {/* Apply Card */}
            <div className="bg-base-100 rounded-xl shadow-md p-4 sticky top-8">
              <div className="text-center mb-4">
                {job.salaryMin && job.salaryMax ? (
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-success">
                      {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                    </div>
                    <div className="text-xs text-base-content/70">
                      {job.salaryType} {job.isNegotiable && "(Negotiable)"}
                    </div>
                  </div>
                ) : (
                  <div className="text-lg font-bold text-base-content/70 mb-3">
                    Salary Not Specified
                  </div>
                )}

                {/* Matching Confidence for Apply Button */}
                {session?.user?.email && matchingData && (
                  <div className="mb-3 p-3 bg-base-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">Application Confidence</span>
                      <span className={`text-xs font-bold ${
                        matchingData.matchingPercentage >= 80 ? 'text-success' :
                        matchingData.matchingPercentage >= 60 ? 'text-warning' :
                        'text-error'
                      }`}>
                        {matchingData.matchingPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          matchingData.matchingPercentage >= 80 ? 'bg-success' :
                          matchingData.matchingPercentage >= 60 ? 'bg-warning' :
                          'bg-error'
                        }`}
                        style={{ width: `${matchingData.matchingPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-base-content/60 mt-1">
                      {matchingData.matchingPercentage >= 80 ? 'High chance of success' :
                       matchingData.matchingPercentage >= 60 ? 'Good chance of success' :
                       matchingData.matchingPercentage >= 40 ? 'Moderate chance' : 'Consider improving skills first'}
                    </div>
                  </div>
                )}

                {job.perksBenefits && (
                  <div className="text-left mb-3">
                    <h3 className="font-semibold mb-1 text-sm">Benefits & Perks</h3>
                    <p className="text-xs text-base-content/70 whitespace-pre-line">
                      {job.perksBenefits}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
              <button
                className={`btn w-full ${
                  isApplicationDeadlinePassed 
                    ? "btn-disabled" 
                    : "btn-primary hover:btn-primary/90"
                }`}
                onClick={handleApply}
                disabled={isApplicationDeadlinePassed}
              >
                {isApplicationDeadlinePassed ? (
                  "Application Closed"
                ) : (
                  "Apply Now"
                )}
              </button>
              <button
                className="btn btn-outline w-full btn-sm"
                onClick={toggleSave}
                disabled={saving}
              >
                {saving ? 'Working...' : (saved ? '★ Saved' : '☆ Save job')}
              </button>
              </div>

              {/* Company Contact Information */}
              {(job.companyWebsite || job.companyEmail) && (
                <div className="mt-4 pt-4 border-t border-base-300">
                  <h3 className="font-semibold mb-2 text-sm">Company Contact</h3>
                  <div className="space-y-1">
                    {job.companyWebsite && (
                      <div className="flex items-center gap-2 text-xs">
                        <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        <a href={job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-primary hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    {job.companyEmail && (
                      <div className="flex items-center gap-2 text-xs">
                        <svg className="w-3 h-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <a href={`mailto:${job.companyEmail}`} 
                           className="text-primary hover:underline">
                          Email
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {job.howToApply && (
                <div className="mt-3 text-center text-xs text-base-content/70">
                  Apply via: {job.howToApply}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-base-300">
                <h3 className="font-semibold mb-2 text-sm">Share this job</h3>
                <div className="flex gap-2">
                  <button
                    className="btn btn-outline btn-xs flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      Swal.fire({
                        icon: "success",
                        title: "Copied!",
                        text: "Job link copied to clipboard",
                        timer: 2000,
                        showConfirmButton: false
                      });
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Jobs Section */}
            {job.isFeatured && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md p-4 border border-yellow-200">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-yellow-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Featured Job Benefits
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Priority visibility to employers</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Enhanced job matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Fast-track application process</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
