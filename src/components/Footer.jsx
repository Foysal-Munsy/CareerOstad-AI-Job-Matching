import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaGooglePlay,
  FaApple,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Footer = () => (
  <footer className="bg-base-100 text-base-content pt-10 pb-6 mt-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Us */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-base-content">About Us</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:underline transition">
                About CareerOstad
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/accessibility"
                className="hover:underline transition"
              >
                Accessibility Statement
              </Link>
            </li>
            <li>
              <Link
                href="/partners/international"
                className="hover:underline transition"
              >
                International Partners
              </Link>
            </li>
            <li>
              <Link
                href="/partners/other"
                className="hover:underline transition"
              >
                Other Partners
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="hover:underline transition">
                Feedback
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        {/* Job Seekers */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-base-content">
            Job Seekers
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/register" className="hover:underline transition">
                Create Account
              </Link>
            </li>
            <li>
              <Link href="/pro" className="hover:underline transition">
                CareerOstad Pro
              </Link>
            </li>
            <li>
              <Link href="/video-cv" className="hover:underline transition">
                Video CV
              </Link>
            </li>
            <li>
              <Link href="/panel" className="hover:underline transition">
                My Panel
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:underline transition">
                List of Features
              </Link>
            </li>
            <li>
              <Link href="/counseling" className="hover:underline transition">
                Career Counseling
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:underline transition">
                Video Guides
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline transition">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        {/* Recruiter */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-base-content">
            Recruiter
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/employer/register"
                className="hover:underline transition"
              >
                Create Account
              </Link>
            </li>
            <li>
              <Link
                href="/employer/products"
                className="hover:underline transition"
              >
                Products/Service
              </Link>
            </li>
            <li>
              <Link
                href="/employer/disability"
                className="hover:underline transition"
              >
                Disability Inclusion Practice
              </Link>
            </li>
            <li>
              <Link
                href="/employer/post-job"
                className="hover:underline transition"
              >
                Post a Job
              </Link>
            </li>
            <li>
              <Link href="/employer/faq" className="hover:underline transition">
                FAQ
              </Link>
            </li>
          </ul>
          <div className="mt-4">
            <span className="block mb-2 text-sm text-neutral">
              Download Employer App
            </span>
            <div className="flex gap-2">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaGooglePlay size={32} className="hover:underline" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaApple size={32} className="hover:underline" />
              </a>
            </div>
          </div>
        </div>
        {/* Tools & Social Media */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-base-content">
            Tools & Social Media
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline transition">
                CareerOstad Android App
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline transition">
                CareerOstad iOS App
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline transition flex items-center gap-2"
              >
                <FaFacebook /> Facebook
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline transition flex items-center gap-2"
              >
                <FaGooglePlay /> Google
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline transition flex items-center gap-2"
              >
                <FaYoutube /> Youtube
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline transition flex items-center gap-2"
              >
                <FaLinkedin /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline transition flex items-center gap-2"
              >
                <FaInstagram /> Instagram
              </a>
            </li>
          </ul>
          <div className="mt-4">
            <span className="block mb-2 text-sm text-neutral">
              Download Mobile App
            </span>
            <div className="flex gap-2">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaGooglePlay size={32} className="hover:underline" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaApple size={32} className="hover:underline" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Support Section */}
      <div className="mt-8 text-center text-sm text-neutral">
        Need any support? Call to{" "}
        <span className="text-accent font-bold">
          16479, 09638666444, 01897627858
        </span>
        <br />
        Our Contact Centre is available from 9 am to 8 pm (Saturday to
        Thursday).
      </div>
      <div className="mt-2 text-center text-xs text-neutral">
        &copy; {new Date().getFullYear()} CareerOstad. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
