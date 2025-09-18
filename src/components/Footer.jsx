import React from "react";
import Link from "next/link";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Footer = () => (
  <footer className="bg-base-200 text-gray-700 py-10">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <span className="font-bold text-primary text-lg">CareerOstad</span>
        <span className="block text-sm mt-1">&copy; {new Date().getFullYear()} All rights reserved.</span>
      </div>
      <div className="mb-4 md:mb-0 flex flex-wrap gap-4 justify-center md:justify-start">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <Link href="/jobs" className="hover:text-primary transition">Jobs</Link>
        <Link href="/candidates" className="hover:text-primary transition">Candidates</Link>
        <Link href="/companies" className="hover:text-primary transition">Companies</Link>
        <Link href="/about" className="hover:text-primary transition">About</Link>
        <Link href="/contact" className="hover:text-primary transition">Contact</Link>
        <Link href="/privacy" className="hover:text-primary transition">Privacy</Link>
        <Link href="/terms" className="hover:text-primary transition">Terms & Condition</Link>
      </div>
      <div className="flex gap-4 justify-center md:justify-end">
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
          <FaFacebook size={22} />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
          <FaLinkedin size={22} />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
          <FaWhatsapp size={22} />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
          <SiGmail size={22} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;