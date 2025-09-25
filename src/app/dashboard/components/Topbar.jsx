"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaSearch, FaBell, FaCog, FaUser, FaSignOutAlt, FaHome, FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

export default function Topbar({ onMenuClick }) {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const notifications = [
    { id: 1, title: "New job application", message: "You have a new application for Software Engineer position", time: "2 min ago", unread: true },
    { id: 2, title: "Interview scheduled", message: "Interview scheduled for tomorrow at 2:00 PM", time: "1 hour ago", unread: true },
    { id: 3, title: "Profile update", message: "Your profile has been viewed 5 times today", time: "3 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="w-full border-b border-base-300 bg-base-100/80 backdrop-blur supports-[backdrop-filter]:bg-base-100/80 sticky top-0 z-40 shadow-sm">
      <div className="px-3 sm:px-6 py-3 flex items-center justify-between">
        {/* Left Section - Menu + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            className="btn btn-ghost btn-sm btn-circle md:hidden"
            aria-label="Open menu"
            onClick={() => onMenuClick?.()}
          >
            <HiOutlineMenuAlt2 className="w-5 h-5" />
          </button>
          <div className="relative hidden sm:block">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs, candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-64 pl-10 pr-4 py-2 text-sm bg-base-100/50 border-base-300 focus:border-primary focus:bg-base-100 transition-all"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Home Link */}
          <Link 
            href="/" 
            className="btn btn-ghost btn-sm gap-2 hidden sm:flex"
            title="View Site"
          >
            <FaHome className="w-4 h-4" />
            <span className="hidden lg:inline">Home</span>
          </Link>

          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="btn btn-ghost btn-sm btn-circle"
            title="Toggle theme"
          >
            {isDarkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="btn btn-ghost btn-sm btn-circle relative"
              title="Notifications"
            >
              <FaBell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-base-300">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b border-base-200 hover:bg-base-200/50 cursor-pointer ${notification.unread ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-primary' : 'bg-base-300'}`}></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-xs text-base-content/70 mt-1">{notification.message}</p>
                          <p className="text-xs text-base-content/50 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-base-300">
                  <Link href="/dashboard/notifications" className="text-primary text-sm font-medium hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 btn btn-ghost btn-sm"
            >
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="w-8 h-8 rounded-full border border-base-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium">{session?.user?.name || "User"}</div>
                <div className="text-xs text-base-content/60 capitalize">{session?.user?.role || "user"}</div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-base-300">
                  <div className="flex items-center gap-3">
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        className="w-10 h-10 rounded-full border border-base-300"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FaUser className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-sm">{session?.user?.name || "User"}</div>
                      <div className="text-xs text-base-content/60">{session?.user?.email}</div>
                      <div className="text-xs text-primary capitalize">{session?.user?.role || "user"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <Link 
                    href={`/dashboard/${session?.user?.role || 'candidate'}/profile`}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200/50"
                  >
                    <FaUser className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link 
                    href={`/dashboard/${session?.user?.role || 'candidate'}/settings`}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200/50"
                  >
                    <FaCog className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="my-1 border-base-300" />
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200/50 w-full text-left text-error"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isNotificationOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </div>
  );
}


