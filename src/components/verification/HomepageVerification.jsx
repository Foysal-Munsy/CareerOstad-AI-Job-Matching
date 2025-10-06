"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import VerificationPayment from "./VerificationPayment";

export default function HomepageVerification() {
  const { data: session, status } = useSession();
  const [selectedUserType, setSelectedUserType] = useState(null);
  
  // Get user role from session
  const userRole = session?.user?.role || 'candidate';

  // Show login prompt for unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto text-center border-2 border-blue-200 rounded-lg bg-blue-50 p-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              Get Your Profile Verified
            </h1>
            <p className="text-blue-700 mb-6 text-lg">
              Build trust and credibility by getting your profile verified. Show others that you are a legitimate professional or company.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Candidates</h3>
                <p className="text-gray-600 mb-4">Get verified as a professional candidate</p>
                <div className="text-2xl font-bold text-green-600">$20</div>
                <p className="text-sm text-gray-500">One-time payment</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Companies</h3>
                <p className="text-gray-600 mb-4">Get verified as a legitimate company</p>
                <div className="text-2xl font-bold text-blue-600">$50</div>
                <p className="text-sm text-gray-500">One-time payment</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Login to Get Verified
              </Link>
              <p className="text-sm text-blue-600">
                Don't have an account? <Link href="/signup" className="underline">Sign up here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in but hasn't selected a type, auto-select based on their role
  if (status === "authenticated" && !selectedUserType) {
    // Auto-select based on user role
    setSelectedUserType(userRole);
  }

  // If user is logged in and has selected a type, show verification
  if (status === "authenticated" && selectedUserType) {
    return <VerificationPayment userRole={selectedUserType} />;
  }

  // Show selection interface (this should rarely be reached now)
  if (status === "authenticated" && !selectedUserType) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto text-center border-2 border-blue-200 rounded-lg bg-blue-50 p-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              Get Your Profile Verified
            </h1>
            <p className="text-blue-700 mb-6 text-lg">
              Choose your verification type to get started.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setSelectedUserType('candidate')}
                className="bg-white p-6 rounded-lg border-2 border-green-200 hover:border-green-400 transition-colors duration-200 text-left"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Candidate Verification</h3>
                <p className="text-gray-600 mb-4">Get verified as a professional candidate</p>
                <div className="text-2xl font-bold text-green-600">$20</div>
                <p className="text-sm text-gray-500">One-time payment</p>
              </button>
              
              <button
                onClick={() => setSelectedUserType('company')}
                className="bg-white p-6 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors duration-200 text-left"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Company Verification</h3>
                <p className="text-gray-600 mb-4">Get verified as a legitimate company</p>
                <div className="text-2xl font-bold text-blue-600">$50</div>
                <p className="text-sm text-gray-500">One-time payment</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This should not be reached due to the logic above
  return null;
}
