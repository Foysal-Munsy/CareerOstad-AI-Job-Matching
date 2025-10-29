"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaCertificate, FaClock, FaExternalLinkAlt, FaCopy, FaDownload } from "react-icons/fa";

export default function CandidateCertificatesPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/certificates", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load certificates");
        }
        setCertificates(data.certificates || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user) fetchCertificates();
  }, [session?.user]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaCertificate className="w-6 h-6" />
            My Certificates
          </h1>
          <p className="text-base-content/60">View and verify your earned certificates.</p>
        </div>
      </div>

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : certificates.length === 0 ? (
        <div className="border border-base-300 rounded-xl p-10 text-center">
          <FaCertificate className="w-10 h-10 mx-auto text-base-content/40" />
          <h3 className="mt-3 font-semibold">No certificates yet</h3>
          <p className="text-base-content/60 text-sm mt-1">Complete a course to earn a certificate.</p>
          <Link href="/dashboard/candidate/learning" className="btn btn-primary btn-sm mt-4">
            Go to My Learning
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div key={cert._id || cert.certificateId} className="border border-base-300 rounded-xl p-5 bg-base-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FaCertificate className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cert.courseTitle}</h3>
                    <p className="text-xs text-base-content/60">{cert.issuerName || "CareerOstad"}</p>
                  </div>
                </div>
                <span className="badge badge-success">Verified</span>
              </div>

              <div className="mt-4 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">Certificate ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{cert.certificateId}</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => copyToClipboard(cert.certificateId)}>
                      <FaCopy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">Issued</span>
                  <span className="flex items-center gap-2">
                    <FaClock className="w-3 h-3" />
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Link href={cert.verificationUrl || "#"} target="_blank" className="btn btn-outline btn-sm">
                  Verify <FaExternalLinkAlt className="w-3 h-3 ml-2" />
                </Link>
                {cert.pdfUrl ? (
                  <Link href={cert.pdfUrl} target="_blank" className="btn btn-ghost btn-sm">
                    <FaDownload className="w-4 h-4" />
                    Download
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


