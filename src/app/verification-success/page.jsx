"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerificationSuccess() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check verification status with retry mechanism
    const checkVerificationStatus = async () => {
      try {
        const res = await fetch("/api/verification/status");
        const data = await res.json();
        
        if (data.error) {
          console.error("Error checking verification status:", data.error);
        } else {
          setVerificationStatus(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    // Check immediately
    checkVerificationStatus();

    // Also check after a delay in case webhook is still processing
    const timeoutId = setTimeout(checkVerificationStatus, 3000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verification Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Congratulations! Your {userType === 'candidate' ? 'candidate' : 'company'} profile has been successfully verified.
            You now have a verified badge that will be displayed next to your name throughout the platform.
          </p>

          {verificationStatus?.isVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">
                ✓ Your profile is now verified
              </p>
              {verificationStatus.verifiedAt && (
                <p className="text-sm text-green-600 mt-1">
                  Verified on: {new Date(verificationStatus.verifiedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Manual verification button for testing */}
          {!verificationStatus?.isVerified && userType && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                If verification status is not showing, you can manually verify for testing:
              </p>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/verification/manual-verify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userType })
                    });
                    const data = await res.json();
                    if (data.success) {
                      window.location.reload();
                    } else {
                      alert("Manual verification failed: " + data.error);
                    }
                  } catch (error) {
                    alert("Error: " + error.message);
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Manual Verify (Testing)
              </button>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
            
            <Link
              href="/profile"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
