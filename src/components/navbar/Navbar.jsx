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
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; // App router

const Navbar = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profileDrawerRef = useRef(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useClickAway(profileDrawerRef, () => setDrawerOpen(false));

  // nav links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/career-advice", label: "Advice" },
    { href: "/blogs", label: "Blogs" },
  ];

  // choose matching strategy:
  const matchExact = (href) => href === pathname;
  const matchStartsWith = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // pick one:
  const isMatch = (href) => matchStartsWith(href); // or matchExact(href)

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="py-3 font-semibold container mx-auto flex justify-between items-center px-3 sm:px-0">
        <Link href="/" onClick={() => window.scrollTo(0, 0)} className="flex items-end">
          <Logo />
        </Link>

        <div className="hidden md:block">
          <Search />
        </div>

        <div className="hidden lg:block">
          <ul className="flex gap-2 xl:gap-6 menu-list text-sm xl:text-[16px] text-base-content">
            <li onClick={() => window.scrollTo(0, 0)}>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/jobs">Jobs</Link>
            </li>
            {/* <Dropdowns /> */}
            <li>
              <Link href="/advice">Advice</Link>
            </li>
            <li>
              <Link href="/getverified" className="bg-gradient-to-r from-primary to-secondary text-primary-content px-2 py-1">Get Verified</Link>
            </li>
            {/* Dashboard link removed for cleaner public navbar */}
          </ul>
        </div>

        {/* AUTH / profile area (unchanged except minor polish) */}
        {status === "loading" ? (
          <div className="hidden md:flex items-center gap-3 mx-3">
            <span className="loading loading-dots loading-xs text-primary"></span>
          </div>
        ) : status === "authenticated" ? (
          <div className="hidden md:flex items-center gap-3 mx-3 relative">
            <div ref={profileDrawerRef} className="relative">
              <button
                className="cursor-pointer flex items-center relative focus:outline-none"
                onClick={() => setDrawerOpen((prev) => !prev)}
                aria-label="Open profile menu"
              >
                <motion.img
                  src={session?.user?.image || "/placeholder-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
                {drawerOpen ? (
                  <FaChevronUp className="absolute -bottom-0 -right-1 text-primary bg-white rounded-full p-0.5 shadow w-4 h-4 transition-all duration-300" />
                ) : (
                  <FaChevronDown className="absolute -bottom-0 -right-1 text-primary bg-white rounded-full p-0.5 shadow w-4 h-4 transition-all duration-300" />
                )}
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={drawerOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`absolute right-0 top-12 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 ${
                  drawerOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <img
                    src={session?.user?.image || "/placeholder-avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                  />
                  <div>
                    <div className="font-bold text-primary text-base">{session?.user?.name || "User"}</div>
                    <div className="text-xs text-gray-500 font-medium">
                      {session?.user?.role ? session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1) : "Role"}
                    </div>
                    <div className="text-xs text-gray-400">{session?.user?.email}</div>
                  </div>
                </div>
                <div className="py-2">
                  <Link href="/dashboard" legacyBehavior>
                    <a className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-purple-50 transition rounded-lg" onClick={() => setDrawerOpen(false)}>Dashboard</a>
                  </Link>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      signOut();
                    }}
                    className="cursor-pointer block w-full text-left px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition rounded-lg"
                  >
                    Log Out
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3 mx-3">
            <Link href="/login" legacyBehavior>
              <a className="inline-flex items-center gap-2 cursor-pointer text-sm border py-1.5 px-4 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">Login</a>
            </Link>
            <Link href="/signup" legacyBehavior>
              <a className="inline-flex items-center gap-2 cursor-pointer text-sm border py-1.5 px-4 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300">Signup</a>
            </Link>
          </div>
        )}

        <div className="lg:hidden">
          <button onClick={() => setSideMenu(!sideMenu)} className="cursor-pointer p-1.5 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-all">
            <CiMenuFries className="w-5 h-5" />
          </button>
        </div>

        <SidePanel sideMenu={sideMenu} setSideMenu={setSideMenu} />
      </div>
    </nav>
  );
};

export default Navbar;
