"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User, FileText, Search, Users, CheckCircle, Zap } from "lucide-react";

const HowItWorks = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const candidateHref = isAuthenticated
    ? "/dashboard/candidate"
    : "/login?callbackUrl=/dashboard/candidate";

  const employerHref = isAuthenticated
    ? "/dashboard/company"
    : "/login?callbackUrl=/dashboard/company";

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
          How It Works
        </h2>
        <p className="text-neutral mb-12 max-w-2xl mx-auto">
          A simple process designed to connect Candidates and Employers
          efficiently. Follow these steps to get started and accelerate your
          career or hiring journey.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Candidate Flow */}
          <div className="p-8 rounded-2xl shadow-lg bg-primary/10 border border-primary/20 transform transition hover:scale-105">
            <h3 className="text-2xl font-semibold text-primary mb-6">
              For Candidates
            </h3>
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-4">
                <User className="w-10 h-10 text-primary" />
                <p className="text-base-content font-medium">
                  Build your profile with skills, resume & goals.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-primary" />
                <p className="text-base-content font-medium">
                  Apply for jobs & get AI-powered career guidance.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-10 h-10 text-primary" />
                <p className="text-base-content font-medium">
                  Track your application status & receive notifications.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Zap className="w-10 h-10 text-primary" />
                <p className="text-base-content font-medium">
                  Get instant tips to improve your profile and interview skills.
                </p>
              </div>
            </div>
            <Link href={candidateHref} className="inline-block mt-8 px-6 py-3 bg-primary text-primary-content rounded-full font-semibold hover:bg-primary/90 transition">
              Get Started
            </Link>
          </div>

          {/* Employer Flow */}
          <div className="p-8 rounded-2xl shadow-lg bg-secondary/10 border border-secondary/20 transform transition hover:scale-105">
            <h3 className="text-2xl font-semibold text-secondary mb-6">
              For Employers
            </h3>
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-4">
                <Search className="w-10 h-10 text-secondary" />
                <p className="text-base-content font-medium">
                  Post jobs & showcase your company.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-secondary" />
                <p className="text-base-content font-medium">
                  Find the right talent & hire faster.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-10 h-10 text-secondary" />
                <p className="text-base-content font-medium">
                  Manage applications & shortlist top candidates.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Zap className="w-10 h-10 text-secondary" />
                <p className="text-base-content font-medium">
                  Receive AI recommendations for the best matches.
                </p>
              </div>
            </div>
            <Link href={employerHref} className="inline-block mt-8 px-6 py-3 bg-secondary text-secondary-content rounded-full font-semibold hover:bg-secondary/90 transition">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
