'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FaCog,
  FaSave,
  FaUndo,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaShieldAlt,
  FaBell,
  FaKey,
  FaMagic,
  FaFlag,
  FaWifi,
  FaDatabase,
  FaUserCheck,
  FaEnvelope,
  FaCreditCard,
  FaRobot,
  FaBlog
} from 'react-icons/fa';

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchSettings();
    }
  }, [status, session?.user?.role]);

  async function fetchSettings() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load settings');
      }
      const data = await res.json();
      setSettings(data.settings || {});
    } catch (e) {
      setError('Could not fetch settings');
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      
      if (!res.ok) {
        throw new Error('Failed to save settings');
      }
      
      setSuccess('Settings saved successfully!');
      setHasChanges(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError('Could not save settings');
      console.error('Error:', e);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (confirm('Are you sure you want to reset all changes?')) {
      fetchSettings();
      setHasChanges(false);
    }
  }

  function updateSetting(category, key, value) {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  }

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return <div className="p-4">Unauthorized</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const { general = {}, jobs = {}, applications = {}, verification = {}, notifications = {}, security = {}, features = {} } = settings || {};

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="mt-1 text-base-content/70">Configure platform-wide settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="btn btn-sm btn-outline gap-2"
            disabled={!hasChanges || saving}
          >
            <FaUndo /> Reset
          </button>
          <button
            onClick={handleSave}
            className="btn btn-sm btn-primary gap-2"
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success gap-2">
          <FaCheckCircle />
          <span>{success}</span>
        </div>
      )}

      {/* General Settings */}
      <SettingsSection
        title="General Settings"
        icon={FaFlag}
        iconColor="text-primary"
      >
        <ToggleSwitch
          label="Maintenance Mode"
          value={general.maintenanceMode}
          onChange={(val) => updateSetting('general', 'maintenanceMode', val)}
          description="Disable public access during maintenance"
        />
        <ToggleSwitch
          label="Allow Registration"
          value={general.allowRegistration}
          onChange={(val) => updateSetting('general', 'allowRegistration', val)}
          description="Allow new user registrations"
        />
        <InputField
          label="Platform Name"
          value={general.platformName}
          onChange={(val) => updateSetting('general', 'platformName', val)}
          placeholder="CareerOstad"
        />
        <TextareaField
          label="Platform Description"
          value={general.platformDescription}
          onChange={(val) => updateSetting('general', 'platformDescription', val)}
          placeholder="AI-Powered Career Platform"
        />
      </SettingsSection>

      {/* Job Settings */}
      <SettingsSection
        title="Job Posting Settings"
        icon={FaBriefcase}
        iconColor="text-success"
      >
        <ToggleSwitch
          label="Allow Job Posting"
          value={jobs.allowJobPosting}
          onChange={(val) => updateSetting('jobs', 'allowJobPosting', val)}
          description="Enable job posting functionality"
        />
        <ToggleSwitch
          label="Auto Approve Jobs"
          value={jobs.autoApproveJobs}
          onChange={(val) => updateSetting('jobs', 'autoApproveJobs', val)}
          description="Automatically approve posted jobs"
        />
        <NumberField
          label="Max Jobs Per Company"
          value={jobs.maxJobsPerCompany}
          onChange={(val) => updateSetting('jobs', 'maxJobsPerCompany', val)}
          min={1}
          max={1000}
        />
        <NumberField
          label="Job Expiry Days"
          value={jobs.jobExpiryDays}
          onChange={(val) => updateSetting('jobs', 'jobExpiryDays', val)}
          min={1}
          max={365}
        />
      </SettingsSection>

      {/* Application Settings */}
      <SettingsSection
        title="Application Settings"
        icon={FaFileAlt}
        iconColor="text-info"
      >
        <ToggleSwitch
          label="Allow Applications"
          value={applications.allowApplications}
          onChange={(val) => updateSetting('applications', 'allowApplications', val)}
          description="Enable job application functionality"
        />
        <ToggleSwitch
          label="Auto Respond to Applications"
          value={applications.autoRespond}
          onChange={(val) => updateSetting('applications', 'autoRespond', val)}
          description="Automatically send acknowledgment emails"
        />
        <NumberField
          label="Max Applications Per User"
          value={applications.maxApplicationsPerUser}
          onChange={(val) => updateSetting('applications', 'maxApplicationsPerUser', val)}
          min={1}
          max={1000}
        />
        <ToggleSwitch
          label="Application Status Notifications"
          value={applications.applicationStatusNotification}
          onChange={(val) => updateSetting('applications', 'applicationStatusNotification', val)}
          description="Notify users of application status changes"
        />
      </SettingsSection>

      {/* Verification Settings */}
      <SettingsSection
        title="Verification Settings"
        icon={FaUserCheck}
        iconColor="text-warning"
      >
        <ToggleSwitch
          label="Enable Verification"
          value={verification.enableVerification}
          onChange={(val) => updateSetting('verification', 'enableVerification', val)}
          description="Enable profile verification feature"
        />
        <NumberField
          label="Candidate Verification Price (USD)"
          value={verification.candidateVerificationPrice}
          onChange={(val) => updateSetting('verification', 'candidateVerificationPrice', val)}
          min={0}
          max={1000}
        />
        <NumberField
          label="Company Verification Price (USD)"
          value={verification.companyVerificationPrice}
          onChange={(val) => updateSetting('verification', 'companyVerificationPrice', val)}
          min={0}
          max={1000}
        />
      </SettingsSection>

      {/* Notification Settings */}
      <SettingsSection
        title="Notification Settings"
        icon={FaBell}
        iconColor="text-secondary"
      >
        <ToggleSwitch
          label="Enable Email Notifications"
          value={notifications.emailEnabled}
          onChange={(val) => updateSetting('notifications', 'emailEnabled', val)}
          description="Send email notifications to users"
        />
        <ToggleSwitch
          label="Enable Push Notifications"
          value={notifications.pushEnabled}
          onChange={(val) => updateSetting('notifications', 'pushEnabled', val)}
          description="Enable browser push notifications"
        />
        <ToggleSwitch
          label="Application Notifications"
          value={notifications.applicationNotifications}
          onChange={(val) => updateSetting('notifications', 'applicationNotifications', val)}
          description="Notify about application updates"
        />
        <ToggleSwitch
          label="Job Notifications"
          value={notifications.jobNotifications}
          onChange={(val) => updateSetting('notifications', 'jobNotifications', val)}
          description="Notify about new job postings"
        />
      </SettingsSection>

      {/* Security Settings */}
      <SettingsSection
        title="Security Settings"
        icon={FaShieldAlt}
        iconColor="text-error"
      >
        <NumberField
          label="Max Login Attempts"
          value={security.maxLoginAttempts}
          onChange={(val) => updateSetting('security', 'maxLoginAttempts', val)}
          min={3}
          max={10}
        />
        <NumberField
          label="Session Timeout (hours)"
          value={security.sessionTimeout}
          onChange={(val) => updateSetting('security', 'sessionTimeout', val)}
          min={1}
          max={168}
        />
        <NumberField
          label="Minimum Password Length"
          value={security.passwordMinLength}
          onChange={(val) => updateSetting('security', 'passwordMinLength', val)}
          min={6}
          max={32}
        />
        <ToggleSwitch
          label="Enable Two-Factor Authentication"
          value={security.enableTwoFactor}
          onChange={(val) => updateSetting('security', 'enableTwoFactor', val)}
          description="Require 2FA for admin accounts"
        />
      </SettingsSection>

      {/* Feature Settings */}
      <SettingsSection
        title="Feature Toggles"
        icon={FaMagic}
        iconColor="text-accent"
      >
        <ToggleSwitch
          label="AI Job Matching"
          value={features.aiJobMatching}
          onChange={(val) => updateSetting('features', 'aiJobMatching', val)}
          description="Enable AI-powered job matching"
        />
        <ToggleSwitch
          label="AI Cover Letter Generator"
          value={features.aiCoverLetter}
          onChange={(val) => updateSetting('features', 'aiCoverLetter', val)}
          description="Enable AI cover letter generation"
        />
        <ToggleSwitch
          label="AI Resume Generator"
          value={features.aiResumeGenerator}
          onChange={(val) => updateSetting('features', 'aiResumeGenerator', val)}
          description="Enable AI resume generation"
        />
        <ToggleSwitch
          label="Career Advisor"
          value={features.careerAdvisor}
          onChange={(val) => updateSetting('features', 'careerAdvisor', val)}
          description="Enable career advice and recommendations"
        />
        <ToggleSwitch
          label="Blog System"
          value={features.blogSystem}
          onChange={(val) => updateSetting('features', 'blogSystem', val)}
          description="Enable blog and content management"
        />
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ title, icon: Icon, iconColor, children }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-300">
        <Icon className={`text-xl ${iconColor}`} />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ToggleSwitch({ label, value, onChange, description }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-sm text-base-content/60 mt-1">{description}</div>
        )}
      </div>
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="form-control py-2">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <input
        type={type}
        className="input input-bordered"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function NumberField({ label, value, onChange, min, max }) {
  return (
    <div className="form-control py-2">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <input
        type="number"
        className="input input-bordered"
        value={value || 0}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <div className="form-control py-2">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <textarea
        className="textarea textarea-bordered"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    </div>
  );
}

