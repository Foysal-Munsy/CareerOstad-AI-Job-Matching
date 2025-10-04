"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function JobApplicationPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Profile Check, 2: CV Upload, 3: Confirmation
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [selectedCV, setSelectedCV] = useState(null);
  const [newCV, setNewCV] = useState(null);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [jobId, setJobId] = useState(null);
  const coverLetterRef = useRef(null);
  const [showCoverLetter, setShowCoverLetter] = useState(null);

  // Await params to get the job ID
  useEffect(() => {
    const getJobId = async () => {
      const resolvedParams = await params;
      setJobId(resolvedParams.id);
    };
    getJobId();
  }, [params]);

  useEffect(() => {
    if (!session?.user?.email) {
      // This should be handled by middleware, but just in case
      router.push('/login');
      return;
    }
    
    if (jobId) {
      fetchJobAndProfile();
    }
  }, [session, jobId]);

  const fetchJobAndProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch job details
      const jobRes = await fetch(`/api/jobs/${jobId}`);
      const jobData = await jobRes.json();
      
      if (!jobRes.ok) throw new Error(jobData?.error || "Failed to fetch job");
      setJob(jobData.job);

      // Fetch user profile
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setUserProfile(profile);
        
        // Calculate profile completion percentage
        const completion = calculateProfileCompletion(profile);
        setProfileCompletion(completion);
        
        // If profile is less than 50%, show warning
        if (completion < 50) {
          setStep(1);
        } else {
          setStep(2);
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (profile) => {
    let completed = 0;
    let total = 0;

    // Personal Info (30 points)
    total += 30;
    if (profile.personalInfo?.name) completed += 5;
    if (profile.personalInfo?.email) completed += 5;
    if (profile.personalInfo?.phone) completed += 5;
    if (profile.personalInfo?.location) completed += 5;
    if (profile.personalInfo?.bio) completed += 5;
    if (profile.personalInfo?.professionalTitle) completed += 5;

    // Skills (20 points)
    total += 20;
    if (profile.skills && profile.skills.length > 0) completed += 20;

    // Experience (25 points)
    total += 25;
    if (profile.experience && profile.experience.length > 0) completed += 25;

    // Education (15 points)
    total += 15;
    if (profile.education && profile.education.length > 0) completed += 15;

    // Resume (10 points)
    total += 10;
    if (profile.resumeUrl) completed += 10;

    return Math.round((completed / total) * 100);
  };

  const handleCVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && file.type !== 'application/msword' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please upload a PDF or Word document',
          confirmButtonText: 'OK'
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please upload a file smaller than 5MB',
          confirmButtonText: 'OK'
        });
        return;
      }
      
      setNewCV(file);
    }
  };

  const generateCoverLetter = async () => {
    if (!job || !userProfile) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Job or profile information not available',
        confirmButtonText: 'OK'
      });
      return;
    }

    setGeneratingCoverLetter(true);
    
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Candidate Profile Data
          name: userProfile.personalInfo?.name || 'Candidate',
          email: userProfile.personalInfo?.email || '',
          phone: userProfile.personalInfo?.phone || '',
          location: userProfile.personalInfo?.location || '',
          bio: userProfile.personalInfo?.bio || '',
          professionalTitle: userProfile.personalInfo?.professionalTitle || '',
          experienceYears: userProfile.personalInfo?.experience || '',
          skills: userProfile.skills || [],
          experience: userProfile.experience || [],
          education: userProfile.education || [],
          certifications: userProfile.certifications || [],
          languages: userProfile.languages || [],
          portfolio: userProfile.portfolio || [],
          socialLinks: userProfile.socialLinks || {},
          resumeUrl: userProfile.resumeUrl || '',
          
          // Job Data
          jobTitle: job.title || '',
          companyName: job.companyName || '',
          jobDescription: job.overview || '',
          jobRequirements: job.requirements || '',
          preferredQualifications: job.preferredQualifications || '',
          toolsTechnologies: job.toolsTechnologies || [],
          jobLocation: job.location || '',
          workMode: job.workMode || '',
          salaryRange: job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax} ${job.salaryType}` : '',
          perksBenefits: job.perksBenefits || '',
          
          // Company Data (if available)
          companyIndustry: job.companyIndustry || '',
          companySize: job.companySize || '',
          companyAbout: job.companyAbout || '',
          companyCulture: job.companyCulture || [],
          companyTechStack: job.companyTechStack || [],
          
          // Application Date
          applicationDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        }),
      });


      const result = await response.json();

      if (response.ok && result.success && result.coverLetter) {
        setCoverLetter(result.coverLetter);
        setShowCoverLetter(result.coverLetter);
        
        // Focus the textarea so user sees and can edit immediately
        setTimeout(() => coverLetterRef.current?.focus(), 0);
        
        // Show success notification
        Swal.fire({
          icon: 'success',
          title: 'Cover Letter Generated!',
          text: 'AI has created a personalized cover letter for you. You can edit it as needed.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        // Only show error if there's actually an error
        if (result.error || !result.coverLetter) {
          Swal.fire({
            icon: 'error',
            title: 'Generation Failed',
            text: result.error || 'Failed to generate cover letter. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  const handleApply = async () => {
    if (!expectedSalary.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Salary Required',
        text: 'Please enter your expected salary',
        confirmButtonText: 'OK'
      });
      return;
    }

    setApplying(true);
    
    try {
      let resumeUrl = userProfile?.resumeUrl || '';
      
      // If new CV is uploaded, handle file upload here
      if (newCV) {
        // For now, we'll use the existing resume URL
        // In a real implementation, you'd upload the file to a storage service
        resumeUrl = userProfile?.resumeUrl || '';
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job._id,
          coverLetter: coverLetter || `I am interested in applying for the ${job.title} position at ${job.companyName}. I believe my skills and experience make me a strong candidate for this role.`,
          resumeUrl: resumeUrl,
          expectedSalary: expectedSalary
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStep(3); // Show confirmation step
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Application Failed',
          text: result.error || 'Failed to submit application. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-base-content/70 mb-4">{error || "Something went wrong."}</p>
          <Link href="/jobs" className="btn btn-primary">Back to Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Apply for Job</h1>
              <p className="text-base-content/70">{job.title} at {job.companyName}</p>
            </div>
            <Link href={`/jobs/${jobId}`} className="btn btn-outline">
              ← Back to Job
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Progress Steps */}
          <div className="mb-8">
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-center space-x-8">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-base-content/40'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    step >= 1 ? 'bg-primary text-primary-content shadow-lg' : 'bg-base-300'
                  }`}>
                    {step > 1 ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="font-bold">1</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-center">Profile Check</span>
                  <span className="text-xs text-base-content/60 mt-1">Verify your profile</span>
                </div>
                
                <div className={`flex-1 h-0.5 transition-all duration-300 ${step >= 2 ? 'bg-primary' : 'bg-base-300'}`}></div>
                
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-base-content/40'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    step >= 2 ? 'bg-primary text-primary-content shadow-lg' : 'bg-base-300'
                  }`}>
                    {step > 2 ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="font-bold">2</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-center">Application Details</span>
                  <span className="text-xs text-base-content/60 mt-1">CV & Cover Letter</span>
                </div>
                
                <div className={`flex-1 h-0.5 transition-all duration-300 ${step >= 3 ? 'bg-primary' : 'bg-base-300'}`}></div>
                
                <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-base-content/40'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    step >= 3 ? 'bg-primary text-primary-content shadow-lg' : 'bg-base-300'
                  }`}>
                    <span className="font-bold">3</span>
                  </div>
                  <span className="text-sm font-medium text-center">Review & Submit</span>
                  <span className="text-xs text-base-content/60 mt-1">Final confirmation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Profile Completion Check */}
          {step === 1 && (
            <div className="bg-base-100 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Profile Completion Check</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm font-bold">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      profileCompletion >= 80 ? 'bg-success' :
                      profileCompletion >= 60 ? 'bg-warning' :
                      'bg-error'
                    }`}
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>

              {profileCompletion < 50 ? (
                <div className="alert alert-warning mb-6">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Profile Incomplete</h3>
                    <div className="text-xs">Your profile is only {profileCompletion}% complete. Please complete your profile to apply for jobs.</div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-success mb-6">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Profile Complete</h3>
                    <div className="text-xs">Your profile is {profileCompletion}% complete. You can proceed with the application.</div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {profileCompletion >= 50 ? (
                  <button 
                    onClick={() => setStep(2)}
                    className="btn btn-primary"
                  >
                    Continue to Application
                  </button>
                ) : (
                  <Link href="/dashboard/candidate/profile" className="btn btn-primary">
                    Complete Profile
                  </Link>
                )}
                <Link href={`/jobs/${jobId}`} className="btn btn-outline">
                  Cancel
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Application Details */}
          {step === 2 && (
            <div className="bg-base-100 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Application Details</h2>
                  <p className="text-sm text-base-content/70">Complete your application with CV and cover letter</p>
                </div>
              </div>
              
              {/* User Profile Display */}
              <div className="mb-6 p-4 bg-base-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img src={userProfile?.personalInfo?.avatar || '/placeholder-avatar.png'} alt="Profile" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{userProfile?.personalInfo?.name}</h3>
                    <p className="text-sm text-base-content/70">{userProfile?.personalInfo?.email}</p>
                    <p className="text-sm text-base-content/70">{userProfile?.personalInfo?.phone}</p>
                  </div>
                  <Link href="/dashboard/candidate/profile" className="btn btn-outline btn-sm">
                    Edit Profile
                  </Link>
                </div>
              </div>

              {/* CV Options */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">Choose Your CV:</h3>
                
                {/* Existing CV Option */}
                {userProfile?.resumeUrl && (
                  <div className="border border-base-300 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="cvOption" 
                        value="existing"
                        checked={selectedCV === 'existing'}
                        onChange={() => setSelectedCV('existing')}
                        className="radio radio-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Use Existing CV</div>
                        <div className="text-sm text-base-content/70">
                          {userProfile.resumeUrl.split('/').pop()}
                        </div>
                      </div>
                    </label>
                  </div>
                )}

                {/* Upload New CV Option */}
                <div className="border border-base-300 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="cvOption" 
                      value="new"
                      checked={selectedCV === 'new'}
                      onChange={() => setSelectedCV('new')}
                      className="radio radio-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Upload New CV</div>
                      <div className="text-sm text-base-content/70">
                        Upload a PDF or Word document (Max 5MB)
                      </div>
                      {selectedCV === 'new' && (
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                          className="file-input file-input-bordered file-input-sm mt-2"
                        />
                      )}
                    </div>
                  </label>
                </div>

                {/* No CV Option */}
                <div className="border border-base-300 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="cvOption" 
                      value="none"
                      checked={selectedCV === 'none'}
                      onChange={() => setSelectedCV('none')}
                      className="radio radio-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium">No CV Required</div>
                      <div className="text-sm text-base-content/70">
                        Your profile information will be used for the application
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Expected Salary */}
              <div className="mb-6">
                <label className="label">
                  <span className="label-text font-medium">Expected Salary (Monthly) *</span>
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 50000"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Enhanced Cover Letter Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Cover Letter</span>
                    </label>
                    <p className="text-xs text-base-content/60 mt-1">Optional but recommended</p>
                  </div>
                  <button
                    type="button"
                    onClick={generateCoverLetter}
                    disabled={generatingCoverLetter || !job || !userProfile}
                    className={`btn btn-sm transition-all duration-200 ${
                      generatingCoverLetter 
                        ? 'btn-primary btn-disabled' 
                        : 'btn-primary hover:btn-primary/90'
                    }`}
                  >
                    {generatingCoverLetter ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        <span className="ml-2">AI Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span>Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="relative">
                  <textarea 
                    placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position, or let AI create a personalized one for you..."
                    value={showCoverLetter || coverLetter}
                    onChange={(e) => {
                      setCoverLetter(e.target.value);
                      setShowCoverLetter(e.target.value);
                    }}
                    ref={coverLetterRef}
                    className="textarea textarea-bordered w-full h-40 resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  {coverLetter && (
                    <div className="absolute bottom-2 right-2 text-xs text-base-content/40">
                      {coverLetter.length} characters
                    </div>
                  )}
                </div>
                
                <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs text-base-content/70">
                      <strong>Pro Tip:</strong> AI can generate a personalized cover letter based on this job description and your profile. 
                      Click "Generate with AI" to create a professional, tailored cover letter in seconds.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-between pt-4 border-t border-base-300">
                <button 
                  onClick={() => setStep(1)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="btn btn-primary flex items-center gap-2"
                  disabled={!expectedSalary.trim()}
                >
                  Review Application
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-base-100 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Review & Submit Application</h2>
                  <p className="text-sm text-base-content/70">Review your details before submitting</p>
                </div>
              </div>
              
              {/* Job Application Limit Display */}
              <div className="mb-6 p-4 bg-base-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Job Application Limit:</span>
                  <span className="text-sm text-base-content/70">0/75 Monthly</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button className="btn btn-sm btn-primary">Add More Limit</button>
                  <span className="text-xs text-base-content/60">* Upgrade to 
                  CareerOstad PRO</span>
                </div>
              </div>

              {/* Job Details */}
              <div className="mb-6 p-4 border border-base-300 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="text-primary font-semibold">{job.companyName}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">KIC</span>
                  </div>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="mb-6 p-4 border border-base-300 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img src={userProfile?.personalInfo?.avatar || '/placeholder-avatar.png'} alt="Profile" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{userProfile?.personalInfo?.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{userProfile?.personalInfo?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{userProfile?.personalInfo?.phone}</span>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm">Edit</button>
                </div>
              </div>

              {/* Expected Salary Display */}
              <div className="mb-6">
                <label className="label">
                  <span className="label-text font-medium">Your Expected Salary (Monthly) *</span>
                </label>
                <div className="text-lg font-semibold text-primary">
                  {expectedSalary ? `৳${parseInt(expectedSalary).toLocaleString()}` : 'Not specified'}
                </div>
              </div>

              {/* Warning Message */}
              <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-warning mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-warning mb-1">Please read before apply *</h4>
                    <p className="text-sm text-base-content/80">
                      CareerOstad will not be responsible for any financial transactions or fraud by the company after applying through the website. The company only connects companies and job seekers.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <input type="checkbox" className="checkbox checkbox-sm" defaultChecked />
                      <span className="text-sm">I have read the above warning message.</span>
                      <button className="btn btn-xs btn-outline">বাংলায় দেখুন</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex gap-3 justify-between pt-4 border-t border-base-300">
                <button 
                  onClick={() => setStep(2)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to Edit
                </button>
                <button 
                  onClick={handleApply}
                  className={`btn flex items-center gap-2 transition-all duration-200 ${
                    applying 
                      ? 'btn-success btn-disabled' 
                      : 'btn-success hover:btn-success/90'
                  }`}
                  disabled={applying}
                >
                  {applying ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
