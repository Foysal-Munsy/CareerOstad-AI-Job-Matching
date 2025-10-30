import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaLinkedin,
  FaGooglePlay,
  FaApple,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => (
  <footer className="bg-base-100 text-base-content pt-8 pb-6 md:pt-12 mt-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {/* About Us */}
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-3 text-base-content">About Us</h3>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <Link href="/about" className="block py-1.5 hover:underline transition">
                About CareerOstad
              </Link>
            </li>
            <li>
              <Link href="/terms" className="block py-1.5 hover:underline transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/accessibility"
                className="block py-1.5 hover:underline transition"
              >
                Accessibility Statement
              </Link>
            </li>
            
            
            <li>
              <Link href="/privacy" className="block py-1.5 hover:underline transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="block py-1.5 hover:underline transition">
                Feedback
              </Link>
            </li>
            
          </ul>
        </div>
        {/* Job Seekers */}
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-3 text-base-content">
            Job Seekers
          </h3>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <Link href="/signup" className="block py-1.5 hover:underline transition">
                Create Account
              </Link>
            </li>
            <li>
              <Link href="/getverified" className="block py-1.5 hover:underline transition">
                CareerOstad Pro
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="block py-1.5 hover:underline transition">
                My Panel
              </Link>
            </li>
            <li>
              <Link href="/features" className="block py-1.5 hover:underline transition">
                List of Features
              </Link>
            </li>
            
            <li>
              <Link href="/faq" className="block py-1.5 hover:underline transition">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        {/* Recruiter */}
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-3 text-base-content">
            Recruiter
          </h3>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <Link
                href="/signup"
                className="block py-1.5 hover:underline transition"
              >
                Create Account
              </Link>
            </li>
            
            <li>
              <Link
                href="/dashboard/company/post-job"
                className="block py-1.5 hover:underline transition"
              >
                Post a Job
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/company/search-talent"
                className="block py-1.5 hover:underline transition"
              >
                Search Talent
              </Link>
            </li>
          </ul>
          <div className="mt-4">
            <span className="block mb-2 text-sm text-neutral">
              Download Employer App
            </span>
            <div className="flex gap-3 justify-center sm:justify-start">
              <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-base-300 hover:bg-base-200 transition">
                <FaGooglePlay size={22} className="" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-base-300 hover:bg-base-200 transition">
                <FaApple size={22} className="" />
              </a>
            </div>
          </div>
        </div>
        {/* Tools & Social Media */}
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-3 text-base-content">
            Tools & Social Media
          </h3>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <a href="#" className="block py-1.5 hover:underline transition">
                CareerOstad Android App
              </a>
            </li>
            <li>
              <a href="#" className="block py-1.5 hover:underline transition">
                CareerOstad iOS App
              </a>
            </li>
           
          </ul>
          <div className="mt-4">
            <span className="block mb-2 text-sm text-neutral">
              Download Mobile App
            </span>
            <div className="flex gap-3 justify-center sm:justify-start">
              <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-base-300 hover:bg-base-200 transition">
                <FaGooglePlay size={22} className="" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-base-300 hover:bg-base-200 transition">
                <FaApple size={22} className="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Support Section */}
      <div className="mt-8 text-center text-xs sm:text-sm text-neutral leading-relaxed">
        Need any support? Call to{" "}
        <span className="text-accent font-bold break-words">
          16479, 09638666444, 01897627858
        </span>
        <br />
        Our Contact Centre is available from 9 am to 8 pm (Saturday to
        Thursday).
      </div>
      <div className="mt-2 text-center text-[11px] sm:text-xs text-neutral">
        &copy; {new Date().getFullYear()} CareerOstad. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
