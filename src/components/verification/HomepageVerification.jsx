"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import VerificationPayment from "./VerificationPayment";

export default function HomepageVerification() {
  const { data: session, status } = useSession();
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Get user role from session
  const userRole = session?.user?.role || 'candidate';

  // Show login prompt for unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-blue-50 py-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Profile Verification
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Establish credibility and build trust with verified profile badges
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Candidate Card */}
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredCard('candidate')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${hoveredCard === 'candidate' ? 'opacity-100' : ''}`}></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-purple-200 transition-all duration-300">
                  {/* Badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-purple-50 border border-purple-200 rounded-full mb-6">
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">For Candidates</span>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline mb-2">
                      <span className="text-5xl font-bold text-gray-900">$20</span>
                      <span className="ml-2 text-gray-500">USD</span>
                    </div>
                    <p className="text-sm text-gray-500">One-time payment • Lifetime verification</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Verified badge on your profile</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Increased profile visibility</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Priority in search results</span>
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href="/login"
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200 text-center"
                  >
                    Verify Now
                  </Link>
                </div>
              </div>

              {/* Company Card */}
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredCard('company')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${hoveredCard === 'company' ? 'opacity-100' : ''}`}></div>
                <div className="relative bg-white rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
                  {/* Popular Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">For Companies</span>
                    </div>
                    <div className="px-3 py-1 bg-amber-100 border border-amber-200 rounded-full">
                      <span className="text-xs font-bold text-amber-700">POPULAR</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline mb-2">
                      <span className="text-5xl font-bold text-gray-900">$50</span>
                      <span className="ml-2 text-gray-500">USD</span>
                    </div>
                    <p className="text-sm text-gray-500">One-time payment • Lifetime verification</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Company profile verification</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Trusted company badge</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Enhanced candidate trust</span>
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href="/login"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200 text-center"
                  >
                    Verify Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to get verified?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of professionals and companies who have verified their profiles
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200"
                >
                  <span>Login to Continue</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Don't have an account? <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">Sign up here</Link>
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
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-blue-50 py-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Choose Verification Type
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the type of verification you need
            </p>
          </div>
        </div>

        {/* Selection Cards */}
        <div className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <button
                onClick={() => setSelectedUserType('candidate')}
                className="relative group text-left"
                onMouseEnter={() => setHoveredCard('candidate')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${hoveredCard === 'candidate' ? 'opacity-100' : ''}`}></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-purple-200 transition-all duration-300">
                  <div className="inline-flex items-center px-3 py-1 bg-purple-50 border border-purple-200 rounded-full mb-6">
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Candidate</span>
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">$20</h3>
                  <p className="text-gray-600">Get verified as a professional candidate</p>
                </div>
              </button>
              
              <button
                onClick={() => setSelectedUserType('company')}
                className="relative group text-left"
                onMouseEnter={() => setHoveredCard('company')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${hoveredCard === 'company' ? 'opacity-100' : ''}`}></div>
                <div className="relative bg-white rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Company</span>
                    </div>
                    <div className="px-3 py-1 bg-amber-100 border border-amber-200 rounded-full">
                      <span className="text-xs font-bold text-amber-700">POPULAR</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">$50</h3>
                  <p className="text-gray-600">Get verified as a legitimate company</p>
                </div>
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
