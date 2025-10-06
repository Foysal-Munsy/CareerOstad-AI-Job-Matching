"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import VerificationCheckout from "./VerificationCheckout";
import Link from "next/link";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function VerificationPayment({ userRole = 'candidate' }) {
  const { data: session, status } = useSession();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set amount based on user type
  const amount = userRole === 'candidate' ? 20 : 50;
  const userType = userRole === 'candidate' ? 'candidate' : 'company';

  useEffect(() => {
    // Only check verification status if user is logged in
    if (status === "authenticated" && session?.user?.email) {
      fetch("/api/verification/status")
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error checking verification status:", data.error);
          } else {
            setVerificationStatus(data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
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

  // Show login prompt for unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-md mx-auto text-center border-2 border-blue-200 rounded-lg bg-blue-50 p-6">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-blue-800 mb-2">
              Get Verified
            </h1>
            <p className="text-blue-700 mb-4">
              Please log in to get your profile verified and build trust with other users.
            </p>
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

  // If user is already verified, show success message
  if (verificationStatus?.isVerified) {
    return (
      <div className="container mx-auto p-6 text-center border-2 border-green-200 rounded-lg bg-green-50">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Verified!</h1>
          <p className="text-green-700">
            Your {userType} profile is verified. You now have a verified badge that will be displayed next to your name.
          </p>
          {verificationStatus.verifiedAt && (
            <p className="text-sm text-green-600 mt-2">
              Verified on: {new Date(verificationStatus.verifiedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto text-center border-2 border-blue-200 rounded-lg bg-blue-50 p-6">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-800 mb-2">
            Get Verified as a {userType === 'candidate' ? 'Candidate' : 'Company'}
          </h1>
          <p className="text-blue-700 mb-4">
            Build trust and credibility by getting your profile verified. 
            {userType === 'candidate' 
              ? ' Show employers that you are a verified professional.' 
              : ' Show candidates that you are a legitimate company.'
            }
          </p>
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <p className="text-lg font-semibold text-gray-800">
              Verification Fee: <span className="text-blue-600">${amount}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              One-time payment for lifetime verification
            </p>
          </div>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd",
          }}
        >
          <VerificationCheckout userType={userType} amount={amount} />
        </Elements>
      </div>
    </div>
  );
}
