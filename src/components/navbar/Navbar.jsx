"use client";
import React, { useState, useRef } from "react";
import { CiMenuFries } from "react-icons/ci";
import SidePanel from "./SidePanel";
import Link from "next/link";
import Search from "./Search";
import Logo from "./Logo";
import { signOut, useSession } from "next-auth/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useClickAway } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Professional Navbar Component
 * Features: Responsive design, active state highlighting, profile drawer, and smooth animations
 */
const Navbar = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profileDrawerRef = useRef(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Close drawer when clicking outside
  useClickAway(profileDrawerRef, () => setDrawerOpen(false));

  // Navigation links configuration
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/learning", label: "Learning" },
    { href: "/explore-careers", label: "Explore Careers" },
    { href: "/career-advice", label: "Advice" },
    { href: "/blogs", label: "Blogs" },
    { href: "/interview", label: "Mock Interview" },
  ];

  /**
   * Checks if a navigation link is active
   * Uses startsWith matching for nested routes
   */
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Handle logout
  const handleLogout = () => {
    setDrawerOpen(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="py-3 font-semibold container mx-auto flex justify-between items-center px-3 sm:px-0">
        <Link
          href="/"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-end"
        >
          <Logo />
        </Link>

        <div className="hidden sm:block">
          <Search />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:block">
          <nav aria-label="Main navigation">
            <ul className="flex gap-5 xl:gap-8 text-[15px] text-gray-700 font-medium">
              {navLinks.map(({ href, label }) => {
                const active = isActive(href);

                return (
                  <li key={href} className="relative">
                    <Link href={href} legacyBehavior>
                      <motion.div
                        className={`relative inline-block px-1 py-1 transition-colors duration-150 ${
                          active
                            ? "text-primary"
                            : "text-gray-700 hover:text-primary"
                        }`}
                        onClick={() => window.scrollTo(0, 0)}
                        whileHover="hover"
                        initial="rest"
                        animate={active ? "hover" : "rest"}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className="relative z-10">{label}</span>

                        {/* Active indicator underline */}
                        <motion.span
                          className="absolute -bottom-1 left-1/2 h-[2px] bg-primary rounded-full"
                          variants={{
                            rest: {
                              width: 6,
                              left: "50%",
                              opacity: 0.95,
                              transition: { duration: 0.18 },
                            },
                            hover: {
                              width: "100%",
                              left: 0,
                              opacity: 1,
                              transition: { duration: 0.32, ease: "easeOut" },
                            },
                          }}
                        />
                      </motion.div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Authentication Status */}
        {status === "loading" ? (
          <div
            className="hidden md:flex items-center gap-3 mx-3"
            aria-live="polite"
          >
            <span
              className="loading loading-dots loading-xs text-primary"
              aria-label="Loading"
            ></span>
          </div>
        ) : status === "authenticated" ? (
          <div className="hidden md:flex items-center gap-3 mx-3 relative">
            <div ref={profileDrawerRef} className="relative">
              <button
                className="cursor-pointer flex items-center relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-all"
                onClick={() => setDrawerOpen((prev) => !prev)}
                aria-label="Toggle profile menu"
                aria-expanded={drawerOpen}
                aria-haspopup="true"
              >
                <motion.img
                  src={session?.user?.image || "/placeholder-avatar.png"}
                  alt={`${session?.user?.name || "User"} profile picture`}
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
                <motion.div
                  animate={{ rotate: drawerOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {drawerOpen ? (
                    <FaChevronUp className="absolute -bottom-0 -right-1 text-primary bg-white rounded-full p-0.5 shadow w-4 h-4" />
                  ) : (
                    <FaChevronDown className="absolute -bottom-0 -right-1 text-primary bg-white rounded-full p-0.5 shadow w-4 h-4" />
                  )}
                </motion.div>
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {drawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                  >
                    {/* Profile Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                      <img
                        src={session?.user?.image || "/placeholder-avatar.png"}
                        alt={`${session?.user?.name || "User"} avatar`}
                        className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-primary text-base truncate">
                          {session?.user?.name || "User"}
                        </div>
                        <div className="text-xs text-gray-500 font-medium capitalize">
                          {session?.user?.role || "Role"}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {session?.user?.email}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link href="/dashboard" legacyBehavior>
                        <a
                          className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-purple-50 transition rounded-lg"
                          onClick={() => setDrawerOpen(false)}
                        >
                          Dashboard
                        </a>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="cursor-pointer block w-full text-left px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition rounded-lg"
                      >
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3 mx-3">
            <Link href="/login" legacyBehavior>
              <a className="inline-flex items-center gap-2 cursor-pointer text-sm border py-1.5 px-4 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Login
              </a>
            </Link>
            <Link href="/signup" legacyBehavior>
              <a className="inline-flex items-center gap-2 cursor-pointer text-sm border py-1.5 px-4 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Signup
              </a>
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setSideMenu(!sideMenu)}
            className="cursor-pointer p-1.5 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Toggle navigation menu"
            aria-expanded={sideMenu}
          >
            <CiMenuFries className="w-5 h-5" />
          </button>
        </div>

        <SidePanel sideMenu={sideMenu} setSideMenu={setSideMenu} />
      </div>
    </nav>
  );
};

export default Navbar;
