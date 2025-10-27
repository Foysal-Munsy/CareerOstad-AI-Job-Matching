"use client";
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCloseMobile = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMobileOpen(false);
      setIsTransitioning(false);
    }, 200);
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && mobileOpen) {
        handleCloseMobile();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen, handleCloseMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar variant="desktop" />
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          
          {/* Main Content with smooth transitions */}
          <main className="px-3 sm:px-6 py-6 animate-fadeIn">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Menu Overlay with animations */}
      {mobileOpen && (
        <div 
          className={`fixed inset-0 z-50 md:hidden ${
            isTransitioning ? "animate-fadeOut" : "animate-fadeIn"
          }`}
        >
          {/* Backdrop overlay with blur effect */}
          <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleCloseMobile}
          />
          
          {/* Slide-in sidebar */}
          <div 
            className={`absolute left-0 top-0 h-full w-80 bg-base-100 border-r border-base-300 shadow-2xl transform transition-transform duration-300 ease-out ${
              isTransitioning ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <Sidebar variant="mobile" onNavigate={handleCloseMobile} />
          </div>
        </div>
      )}
    </div>
  );
}


