"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";

export default function Chrome({ children }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && (
        <header className="sticky top-0 transition-all duration-1000 z-[999] bg-base-200">
          <Navbar />
        </header>
      )}
      <main className="flex-grow">{children}</main>
      {!hideChrome && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
}


