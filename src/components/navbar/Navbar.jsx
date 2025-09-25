"use client";
import React, { useState, useRef } from "react";
import Dropdowns from "./Dropdowns";
import { CiMenuFries } from "react-icons/ci";
import SidePanel from "./SidePanel";
import Link from "next/link";
import Search from "./Search";
import Logo from "./Logo";
import { signOut, useSession } from "next-auth/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useClickAway } from "react-use"; // Lightweight dependency for outside click

const Navbar = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profileDrawerRef = useRef(null);

  const { data: session, status } = useSession();

  // Close drawer when clicking outside using react-use
  useClickAway(profileDrawerRef, () => setDrawerOpen(false));

  return (
    <nav>
      <div className="py-2 font-bold container mx-auto flex justify-between items-center px-2 sm:px-0">
        <div>
          <Link
            href="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-end"
          >
            <Logo />
          </Link>
        </div>
        <div>
          <Search />
        </div>
        <div className="hidden lg:block">
          <ul className="flex gap-2 xl:gap-6 menu-list text-sm xl:text-[16px] text-base-content">
            <li onClick={() => window.scrollTo(0, 0)}>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="/#about">Jobs</a>
            </li>
            <Dropdowns />
            <li>
              <Link href="/advice">Advice</Link>
            </li>
          </ul>
        </div>

        {status === "authenticated" ? (
          <div className="hidden md:flex items-center gap-3 social-area mx-3 relative">
            {/* Profile Picture and Drawer */}
            <div ref={profileDrawerRef} className="flex items-center gap-2 relative">
              <button
                className="flex items-center relative focus:outline-none"
                onClick={() => setDrawerOpen((prev) => !prev)}
                aria-label="Open profile menu"
              >
                <img
                  src={session?.user?.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow transition-all duration-300"
                />
                <span>
                  {drawerOpen ? (
                    <FaChevronUp className="absolute -bottom-0 -right-1 text-primary bg-white rounded-full p-0.5 shadow w-4 h-4 transition-all duration-300" />
                  ) : (
                    <FaChevronDown className="absolute -bottom-0 -right-1 text-primary bg-white rounded-full p-0.5 shadow w-4 h-4 transition-all duration-300" />
                  )}
                </span>
              </button>
              {/* Dropdown Drawer */}
              <div
                className={`absolute right-0 top-12 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 transition-all duration-300 ${
                  drawerOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{
                  boxShadow: drawerOpen
                    ? "0 8px 24px rgba(80, 36, 255, 0.12)"
                    : "none",
                }}
              >
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <img
                    src={session?.user?.image || "/default-avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                  />
                  <div>
                    <div className="font-bold text-primary text-base">
                      {session?.user?.name || "User"}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {session?.user?.role
                        ? session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)
                        : "Role"}
                    </div>
                    <div className="text-xs text-gray-400">{session?.user?.email}</div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    href="/dashboard"
                    className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-purple-50 transition rounded-lg"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Actionable Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      signOut();
                    }}
                    className="block w-full text-left px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition rounded-lg"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3 social-area mx-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 cursor-pointer text-md border py-1 px-4 rounded-btn border-primary text-primary transition-all duration-1000 hover:bg-primary hover:text-primary-content"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 cursor-pointer text-md border py-1 px-4 rounded-btn bg-primary text-primary-content transition-all duration-1000 hover:bg-primary/90"
            >
              Signup
            </Link>
          </div>
        )}
        <div className="social-area lg:hidden">
          <button
            onClick={() => setSideMenu(!sideMenu)}
            className="p-1 rounded-sm border border-primary text-primary"
          >
            <CiMenuFries
              id="menu-icon"
              className="social-icon rounded-sm w-5 h-5"
            />
          </button>
        </div>
        <SidePanel sideMenu={sideMenu} setSideMenu={setSideMenu} />
      </div>
    </nav>
  );
};

export default Navbar;