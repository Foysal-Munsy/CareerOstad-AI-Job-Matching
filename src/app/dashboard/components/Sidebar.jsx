"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiBoxList } from "react-icons/ci";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { TbPackage } from "react-icons/tb";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsersCog, FaUserTie, FaChartLine, FaBell, FaCog, FaFileAlt, FaSearch, FaTachometerAlt, FaUsers, FaUser, FaBuilding, FaUserShield, FaBriefcase, FaTags, FaChartBar, FaHistory, FaDatabase, FaShieldAlt } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { HiOutlineDocumentText, HiOutlineUsers } from "react-icons/hi";
import { BiMessageSquareDots } from "react-icons/bi";
import { RiTeamLine } from "react-icons/ri";
import { useSession } from "next-auth/react";

const NavItem = ({ href, label, icon: Icon, onClick }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
        active ? "bg-primary/10 text-primary" : "hover:bg-base-200"
      }`}
    >
      {Icon ? <Icon className="w-5 h-5" /> : null}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar({ variant = "desktop", onNavigate }) {
  const { data: session } = useSession();
  const role = session?.user?.role || "candidate";
  const isAdmin = role === "admin";
  const isCompany = role === "company";
  const containerClass =
    variant === "mobile"
      ? "w-72 shrink-0 bg-base-100 h-full flex flex-col"
      : "w-60 shrink-0 border-r border-base-300 bg-base-100 h-screen sticky top-0 hidden md:flex flex-col";
  const itemClick = () => {
    if (variant === "mobile" && typeof onNavigate === "function") onNavigate();
  };
  return (
    <aside className={containerClass}>
      <div className="px-4 py-4 border-b border-base-300">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg shadow-lg">
            CO
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-primary">CareerOstad</h1>
            <p className="text-[10px] text-gray-500 -mt-1 font-light">AI-Powered Career Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="px-2 py-4 space-y-1 overflow-y-auto">
        <div className="text-xs uppercase px-4 mb-1 text-base-content/60">Overview</div>
        <NavItem href="/dashboard" label="Dashboard" icon={MdSpaceDashboard} onClick={itemClick} />
        <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Jobs</div>
        {isCompany && (
          <>
            <NavItem href="/dashboard/company" label="Company Home" icon={TbPackage} onClick={itemClick} />
            <NavItem href="/dashboard/company/post-job" label="Post a Job" icon={AiOutlinePlusCircle} onClick={itemClick} />
            <NavItem href="/dashboard/company/jobs" label="My Job Posts" icon={TbPackage} onClick={itemClick} />
            <NavItem href="/dashboard/company/applications" label="Applications" icon={HiOutlineDocumentText} onClick={itemClick} />
            <NavItem href="/dashboard/company/candidates" label="Candidates" icon={HiOutlineUsers} onClick={itemClick} />
            <NavItem href="/dashboard/company/search-talent" label="Search Talent" icon={FaSearch} onClick={itemClick} />
          </>
        )}
        
        {isCompany && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Analytics</div>
            <NavItem href="/dashboard/company/analytics" label="Job Analytics" icon={IoMdAnalytics} onClick={itemClick} />
            <NavItem href="/dashboard/company/performance" label="Performance" icon={FaChartLine} onClick={itemClick} />
            <NavItem href="/dashboard/company/reports" label="Reports" icon={FaFileAlt} onClick={itemClick} />
          </>
        )}
        
        {isCompany && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Team & Communication</div>
            <NavItem href="/dashboard/company/team" label="My Team" icon={RiTeamLine} onClick={itemClick} />
            <NavItem href="/dashboard/company/messages" label="Messages" icon={BiMessageSquareDots} onClick={itemClick} />
            <NavItem href="/dashboard/company/notifications" label="Notifications" icon={FaBell} onClick={itemClick} />
          </>
        )}
        
        {isCompany && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Settings</div>
            <NavItem href="/dashboard/company/profile" label="Company Profile" icon={FaUserTie} onClick={itemClick} />
            <NavItem href="/dashboard/company/settings" label="Settings" icon={FaCog} onClick={itemClick} />
          </>
        )}
        {!isCompany && !isAdmin && (
          <>
            <NavItem href="/dashboard/candidate" label="Candidate Home" icon={TbPackage} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/applications" label="My Applications" icon={HiOutlineDocumentText} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/saved" label="Saved Jobs" icon={FaSearch} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/job-search" label="Job Search" icon={FaSearch} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/recommended" label="Recommended Jobs" icon={IoMdAnalytics} onClick={itemClick} />
          </>
        )}
        
        {!isCompany && !isAdmin && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Career Development</div>
            <NavItem href="/dashboard/candidate/profile" label="My Profile" icon={FaUserTie} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/resume" label="Resume Builder" icon={FaFileAlt} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/skills" label="Skills Assessment" icon={FaChartLine} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/interview" label="Interview Prep" icon={BiMessageSquareDots} onClick={itemClick} />
          </>
        )}
        
        {!isCompany && !isAdmin && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Networking</div>
            <NavItem href="/dashboard/candidate/connections" label="My Network" icon={RiTeamLine} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/messages" label="Messages" icon={BiMessageSquareDots} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/notifications" label="Notifications" icon={FaBell} onClick={itemClick} />
          </>
        )}
        
        {!isCompany && !isAdmin && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Learning</div>
            <NavItem href="/dashboard/candidate/courses" label="Courses" icon={HiOutlineDocumentText} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/certifications" label="Certifications" icon={FaFileAlt} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/progress" label="Progress Tracking" icon={IoMdAnalytics} onClick={itemClick} />
          </>
        )}
        
        {!isCompany && !isAdmin && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Settings</div>
            <NavItem href="/dashboard/candidate/preferences" label="Job Preferences" icon={FaCog} onClick={itemClick} />
            <NavItem href="/dashboard/candidate/settings" label="Account Settings" icon={FaCog} onClick={itemClick} />
          </>
        )}
        {isAdmin && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Dashboard</div>
            <NavItem href="/dashboard/admin" label="Overview" icon={FaTachometerAlt} onClick={itemClick} />
            
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">User Management</div>
            <NavItem href="/dashboard/admin/users" label="All Users" icon={FaUsers} onClick={itemClick} />
            <NavItem href="/dashboard/admin/candidates" label="Candidates" icon={FaUser} onClick={itemClick} />
            <NavItem href="/dashboard/admin/companies" label="Companies" icon={FaBuilding} onClick={itemClick} />
            <NavItem href="/dashboard/admin/roles" label="Role Management" icon={FaUserShield} onClick={itemClick} />
            
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Job Management</div>
            <NavItem href="/dashboard/admin/jobs" label="All Jobs" icon={FaBriefcase} onClick={itemClick} />
            <NavItem href="/dashboard/admin/applications" label="Applications" icon={FaFileAlt} onClick={itemClick} />
            <NavItem href="/dashboard/admin/categories" label="Job Categories" icon={FaTags} onClick={itemClick} />
            
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">Analytics & Reports</div>
            <NavItem href="/dashboard/admin/analytics" label="Analytics" icon={FaChartBar} onClick={itemClick} />
            <NavItem href="/dashboard/admin/reports" label="Reports" icon={FaFileAlt} onClick={itemClick} />
            <NavItem href="/dashboard/admin/activity" label="Activity Logs" icon={FaHistory} onClick={itemClick} />
            
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-base-content/60">System Management</div>
            <NavItem href="/dashboard/admin/settings" label="System Settings" icon={FaCog} onClick={itemClick} />
            <NavItem href="/dashboard/admin/notifications" label="Notifications" icon={FaBell} onClick={itemClick} />
            <NavItem href="/dashboard/admin/backup" label="Data Backup" icon={FaDatabase} onClick={itemClick} />
            <NavItem href="/dashboard/admin/security" label="Security" icon={FaShieldAlt} onClick={itemClick} />
          </>
        )}
      </nav>
      
      <div className="mt-auto p-4">
        <div className="text-xs text-base-content/60">Quick Stats</div>
        <div className="mt-2 space-y-2 text-sm">
          {isAdmin ? (
            <>
              <div className="flex items-center justify-between">
                <span>Total Users</span>
                <span className="badge badge-primary badge-sm">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Jobs</span>
                <span className="badge badge-success badge-sm">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Applications</span>
                <span className="badge badge-info badge-sm">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Companies</span>
                <span className="badge badge-warning badge-sm">156</span>
              </div>
            </>
          ) : isCompany ? (
            <>
              <div className="flex items-center justify-between">
                <span>Active Jobs</span>
                <span className="badge badge-success badge-sm">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Applications</span>
                <span className="badge badge-info badge-sm">48</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Interviews</span>
                <span className="badge badge-warning badge-sm">8</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span>Applications</span>
                <span className="badge badge-info badge-sm">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Saved Jobs</span>
                <span className="badge badge-success badge-sm">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Interviews</span>
                <span className="badge badge-warning badge-sm">2</span>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}


