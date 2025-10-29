'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaArrowLeft, FaBell, FaBuilding, FaEnvelope, FaSave, FaShieldAlt } from 'react-icons/fa';

export default function CompanySettingsPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const isCompany = role === 'company' || role === 'admin';

  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notifyApplications, setNotifyApplications] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    // Prefill with user/company values when available (best-effort, non-blocking)
    if (session?.user) {
      setCompanyName(session.user.company || '');
      setContactEmail(session.user.email || '');
    }
  }, [session?.user]);

  async function onSave() {
    try {
      setSaving(true);
      // Placeholder: persist later via API
      await new Promise(r => setTimeout(r, 700));
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!isCompany) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-2xl font-bold">Restricted</h2>
          <p className="text-base-content/70 mt-1">Only company users can access Company Settings.</p>
          <Link href="/dashboard" className="btn btn-primary btn-sm mt-4">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-base-100">
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/company" className="btn btn-ghost btn-circle">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Company Settings</h1>
                <p className="text-base-content/70">Manage your company profile, notifications and security</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl p-[1px] bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
                  <FaBuilding className="w-4 h-4" /> Company Profile
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label"><span className="label-text">Company name</span></label>
                    <input value={companyName} onChange={e => setCompanyName(e.target.value)} className="input input-bordered w-full" placeholder="Company Inc." />
                  </div>
                  <div>
                    <label className="label"><span className="label-text">Contact email</span></label>
                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="input input-bordered w-full" placeholder="hr@company.com" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-[1px] bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
                  <FaBell className="w-4 h-4" /> Notifications
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="toggle toggle-primary" checked={notifyApplications} onChange={e => setNotifyApplications(e.target.checked)} />
                    <span className="text-sm">Email me when a new application is submitted</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="toggle toggle-primary" checked={notifyMessages} onChange={e => setNotifyMessages(e.target.checked)} />
                    <span className="text-sm">Email me when I receive a new message</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-[1px] bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
                  <FaShieldAlt className="w-4 h-4" /> Security
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="toggle toggle-primary" checked={twoFactor} onChange={e => setTwoFactor(e.target.checked)} />
                  <span className="text-sm">Enable two-factor authentication (2FA)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={onSave} disabled={saving} className="btn btn-primary">
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" /> Save changes
                  </>
                )}
              </button>
              {savedAt ? (
                <span className="text-xs text-base-content/70">Saved at {savedAt}</span>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl p-[1px] bg-gradient-to-br from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold mb-2">Tips</div>
                <ul className="list-disc ms-5 text-sm space-y-1 text-base-content/70">
                  <li>Keep your contact email up to date for applicant outreach.</li>
                  <li>Enable notifications to respond to candidates faster.</li>
                  <li>Turn on 2FA to protect your hiring team accounts.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl p-[1px] bg-gradient-to-br from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                  <FaEnvelope className="w-4 h-4" /> Notification email
                </div>
                <div className="text-xs text-base-content/70">
                  Emails will be sent to <span className="font-medium">{contactEmail || 'your account email'}</span>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


