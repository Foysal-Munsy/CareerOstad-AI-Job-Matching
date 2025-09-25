"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  FaBriefcase, 
  FaChartLine, 
  FaBell, 
  FaUser, 
  FaFileAlt, 
  FaSearch, 
  FaCalendarAlt,
  FaStar,
  FaBuilding,
  FaMapMarkerAlt,
  FaClock,
  FaEye,
  FaDownload,
  FaEdit,
  FaPlus,
  FaGraduationCap,
  FaCertificate,
  FaUsers,
  FaComments,
  FaArrowUp,
  FaCheckCircle
} from "react-icons/fa";
import { 
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineAcademicCap
} from "react-icons/hi";

export default function CandidateDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const stats = {
    profileViews: 45,
    applications: 12,
    interviews: 3,
    jobMatches: 8
  };

  const recentJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 hours ago",
      match: 95,
      applied: false,
      featured: true
    },
    {
      id: 2,
      title: "React Developer",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary: "$90k - $120k",
      posted: "1 day ago",
      match: 88,
      applied: true,
      featured: false
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "Digital Solutions",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100k - $130k",
      posted: "3 days ago",
      match: 92,
      applied: false,
      featured: true
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Senior Frontend Developer",
      date: "Tomorrow, 2:00 PM",
      type: "Video Call",
      status: "Confirmed"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "React Developer",
      date: "Friday, 10:00 AM",
      type: "On-site",
      status: "Pending"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Profile Completion",
      description: "Complete your profile to increase visibility",
      progress: 75,
      icon: FaUser,
      color: "text-blue-500"
    },
    {
      id: 2,
      title: "Skills Assessment",
      description: "Take skills test to get better matches",
      progress: 40,
      icon: FaGraduationCap,
      color: "text-green-500"
    },
    {
      id: 3,
      title: "Resume Optimization",
      description: "Optimize your resume for better results",
      progress: 60,
      icon: FaFileAlt,
      color: "text-purple-500"
    }
  ];

  const quickActions = [
    {
      title: "Search Jobs",
      description: "Find your next opportunity",
      icon: FaSearch,
      href: "/dashboard/candidate/job-search",
      color: "bg-blue-500"
    },
    {
      title: "Update Profile",
      description: "Keep your profile fresh",
      icon: FaEdit,
      href: "/dashboard/candidate/profile",
      color: "bg-green-500"
    },
    {
      title: "Build Resume",
      description: "Create a standout resume",
      icon: FaFileAlt,
      href: "/dashboard/candidate/resume-builder",
      color: "bg-purple-500"
    },
    {
      title: "Interview Prep",
      description: "Prepare for interviews",
      icon: FaGraduationCap,
      href: "/dashboard/candidate/interview-prep",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}! 👋
            </h1>
            <p className="text-base-content/70 mt-2 text-lg">
              Ready to take the next step in your career journey?
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="text-right">
              <div className="text-sm text-base-content/60">Profile Strength</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 bg-base-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Profile Views</p>
              <p className="text-2xl font-bold text-primary">{stats.profileViews}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FaEye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <FaArrowUp className="w-3 h-3" />
            +12% from last week
          </p>
        </div>

        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Applications</p>
              <p className="text-2xl font-bold text-primary">{stats.applications}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FaFileAlt className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <FaArrowUp className="w-3 h-3" />
            +3 this week
          </p>
        </div>

        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Interviews</p>
              <p className="text-2xl font-bold text-primary">{stats.interviews}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <FaCalendarAlt className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
            <FaBell className="w-3 h-3" />
            2 upcoming
          </p>
        </div>

        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Job Matches</p>
              <p className="text-2xl font-bold text-primary">{stats.jobMatches}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <HiOutlineSparkles className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <FaArrowUp className="w-3 h-3" />
            +5 new matches
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Recommendations */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <HiOutlineSparkles className="w-5 h-5 text-primary" />
                  Recommended Jobs
                </h2>
                <Link href="/dashboard/candidate/job-search" className="text-primary hover:underline text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${job.featured ? 'border-primary/30 bg-primary/5' : 'border-base-300'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        {job.featured && (
                          <span className="bg-primary text-primary-content text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FaStar className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          {job.match}% Match
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-base-content/70 mb-2">
                        <span className="flex items-center gap-1">
                          <FaBuilding className="w-4 h-4" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="w-4 h-4" />
                          {job.posted}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-base-content/70">{job.type}</span>
                        <span className="text-green-600 font-medium">{job.salary}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {job.applied ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <FaCheckCircle className="w-4 h-4" />
                          Applied
                        </span>
                      ) : (
                        <button className="btn btn-primary btn-sm">
                          Apply Now
                        </button>
                      )}
                      <button className="btn btn-ghost btn-sm">
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-primary" />
                Upcoming Interviews
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-4 bg-base-50 rounded-lg border border-base-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{interview.position}</h3>
                      <p className="text-sm text-base-content/70">{interview.company}</p>
                      <p className="text-sm text-base-content/60">{interview.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-base-content/70">{interview.type}</span>
                      <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                        interview.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {interview.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HiOutlineLightningBolt className="w-5 h-5 text-primary" />
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-base-content/60">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HiOutlineAcademicCap className="w-5 h-5 text-primary" />
                Your Progress
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-base-content/60">{achievement.description}</p>
                    </div>
                    <span className="text-sm font-medium">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips & Insights */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <FaBell className="w-5 h-5 text-primary" />
              Career Tip
            </h3>
            <p className="text-sm text-base-content/80">
              "Complete your skills assessment to get 40% more job matches and increase your profile visibility by 60%."
            </p>
            <button className="btn btn-primary btn-sm mt-3">
              Take Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


