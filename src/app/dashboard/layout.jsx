"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-base-100">
      <div className="flex">
        <Sidebar variant="desktop" />
        <div className="flex-1 min-w-0">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="px-3 sm:px-6 py-6">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-base-100 border-r border-base-300 shadow-xl">
            <Sidebar variant="mobile" onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}


