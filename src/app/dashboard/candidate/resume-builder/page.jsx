'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaPlus, FaTrash, FaDownload, FaCopy, FaPrint, FaEdit, FaSave, FaEye, FaEyeSlash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function ProfessionalResumeBuilder() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    // Personal
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    location: '',
    professionalTitle: '',
    bio: '',
    experienceYears: '',
    linkedin: '',
    github: '',
    website: '',
    profilePicture: '',

    // Education
    education: [
      { degree: '', institution: '', department: '', startYear: '', endYear: '', result: '', description: '' },
    ],

    // Work Experience
    work: [
      { title: '', company: '', location: '', startDate: '', endDate: '', present: false, responsibilities: '' },
    ],

    // Skills
    techSkills: [],
    softSkills: [],
    languages: [{ name: '', level: '' }],

    // Projects
    projects: [{ title: '', description: '', tools: '', link: '' }],

    // Certifications
    certifications: [{ name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' }],

    // Achievements
    achievements: [{ title: '', description: '', year: '' }],

    // Volunteer
    volunteer: [{ organization: '', role: '', description: '', duration: '' }],

    // References
    references: [{ name: '', position: '', company: '', email: '', phone: '' }],

    // Targeting
    targetRole: '',
    targetCompany: '',
    jobDescription: '',

    // Customization
    templateStyle: 'Modern',
    accentColor: '#2563eb',
    fontFamily: 'Inter',
    downloadFormat: 'pdf',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resume, setResume] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    education: true,
    work: true,
    skills: true,
    projects: true,
    certifications: true,
    achievements: true,
    volunteer: true,
    references: false,
    customization: true
  });
  const [activeTab, setActiveTab] = useState('form');

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.name || form.email) {
        localStorage.setItem('resume-builder-draft', JSON.stringify(form));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [form]);

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem('resume-builder-draft');
    if (draft) {
      setForm(JSON.parse(draft));
      toast.success('Draft loaded successfully!');
    }
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const updateNested = (section, index, field) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => {
      const copy = { ...f };
      const arr = [...copy[section]];
      arr[index] = { ...arr[index], [field]: value };
      copy[section] = arr;
      return copy;
    });
  };

  const addItem = (section, emptyItem) => () => {
    setForm((f) => ({ ...f, [section]: [...f[section], emptyItem] }));
    toast.success('Item added successfully');
  };

  const removeItem = (section, index) => () => {
    setForm((f) => ({ ...f, [section]: f[section].filter((_, i) => i !== index) }));
    toast.success('Item removed');
  };

  const addChip = (section, value) => {
    const v = value.trim();
    if (!v) return;
    setForm((f) => ({ ...f, [section]: Array.from(new Set([...(f[section] || []), v])) }));
    toast.success('Skill added');
  };

  const removeChip = (section, chip) => {
    setForm((f) => ({ ...f, [section]: (f[section] || []).filter((c) => c !== chip) }));
    toast.success('Skill removed');
  };

  const onUploadPicture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, profilePicture: reader.result }));
      toast.success('Profile picture uploaded');
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!form.email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    if (!form.professionalTitle.trim()) {
      toast.error('Please enter your professional title');
      return false;
    }
    if (form.education.length === 0 || !form.education.some(ed => ed.degree && ed.institution)) {
      toast.error('Please add at least one education entry');
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setResume('');
    
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        bio: form.bio,
        professionalTitle: form.professionalTitle,
        experienceYears: form.experienceYears,
        socialLinks: { linkedin: form.linkedin, github: form.github, website: form.website },
        profilePicture: form.profilePicture,

        education: form.education,
        experience: form.work,
        techSkills: form.techSkills,
        softSkills: form.softSkills,
        languages: form.languages,
        projects: form.projects,
        certifications: form.certifications,
        achievements: form.achievements,
        volunteer: form.volunteer,
        references: form.references,

        targetRole: form.targetRole,
        targetCompany: form.targetCompany,
        jobDescription: form.jobDescription,

        style: {
          templateStyle: form.templateStyle,
          accentColor: form.accentColor,
          fontFamily: form.fontFamily,
        },
      };

      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate resume');
      
      setResume(data.resume);
      toast.success('Resume generated successfully!');
    } catch (e) {
      setError(e.message);
      toast.error('Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Personal info (weight: 30%)
    const personalFields = ['name', 'email', 'professionalTitle', 'bio', 'phone', 'location'];
    personalFields.forEach(field => {
      total++;
      if (form[field]?.trim()) completed++;
    });

    // Education (weight: 25%)
    if (form.education.some(ed => ed.degree && ed.institution)) completed++;
    total++;

    // Work experience (weight: 20%) - Optional for freshers
    if (form.work.some(w => w.title && w.company)) completed++;
    total++;

    // Skills (weight: 20%)
    if (form.techSkills.length > 0 || form.softSkills.length > 0) completed++;
    total++;

    // Projects (weight: 15%)
    if (form.projects.some(p => p.title)) completed++;
    total++;

    // Additional sections (weight: 10%)
    const additionalSections = ['certifications', 'achievements', 'languages'];
    additionalSections.forEach(section => {
      if (form[section].some(item => item.name || item.title)) completed++;
      total++;
    });

    return Math.round((completed / total) * 100);
  };

  // Unused export functions - keeping for future use
  // const downloadMarkdown = () => {
  //   if (!resume) {
  //     toast.error('Please generate resume first');
  //     return;
  //   }
  //   const blob = new Blob([resume], { type: 'text/markdown;charset=utf-8' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `${form.name.replace(/\s+/g, '_')}_resume.md`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  //   toast.success('Markdown resume downloaded!');
  // };

  // const copyMarkdown = async () => {
  //   if (!resume) {
  //     toast.error('Please generate resume first');
  //     return;
  //   }
  //   await navigator.clipboard.writeText(resume);
  //   toast.success('Resume copied to clipboard!');
  // };

  // const printPDF = () => {
  //   if (!resume) {
  //     toast.error('Please generate resume first');
  //     return;
  //   }
  //   window.print();
  // };

  // const downloadWord = () => {
  //   const html = buildStyledHTML(false);
  //   const blob = new Blob([html], { type: 'application/msword' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `${form.name.replace(/\s+/g, '_')}_resume.doc`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  //   toast.success('Word document downloaded!');
  // };

  const exportStyledPDF = () => {
    const html = buildStyledHTML(false);
    const w = window.open('', '_blank');
    if (!w) {
      toast.error('Please allow popups for PDF export');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const buildStyledHTML = (inlinePreview = false) => {
    const color = form.accentColor || '#2563eb';
    const font = form.fontFamily || 'Inter, Arial, sans-serif';
    
    const section = (title, content) => content ? `
      <section class="section">
        <h2 class="section-title">${title}</h2>
        ${content}
      </section>
    ` : '';

    const list = (items) => Array.isArray(items) && items.length ? `
      <ul class="skill-list">
        ${items.map(i => `<li>${i}</li>`).join('')}
      </ul>
    ` : '';

    const techSkills = list(form.techSkills);
    const softSkills = list(form.softSkills);
    const languages = list((form.languages || []).filter(l => l.name || l.level).map(l => 
      `${l.name || ''}${l.level ? ` – ${l.level}` : ''}`
    ));

    const education = (form.education || []).filter(e => e.degree || e.institution).map(e => `
      <div class="item">
        <div class="item-head">
          <div class="item-title">${e.degree || ''}${e.department ? `, ${e.department}` : ''}</div>
          <div class="item-meta">${e.startYear || ''}${e.endYear ? ` - ${e.endYear}` : ''}</div>
        </div>
        <div class="item-sub">${e.institution || ''}</div>
        ${e.result ? `<div class="item-sub">CGPA/Result: ${e.result}</div>` : ''}
        ${e.description ? `<div class="item-desc">${e.description}</div>` : ''}
      </div>
    `).join('');

    const work = (form.work || []).filter(w => w.title || w.company).map(w => `
      <div class="item">
        <div class="item-head">
          <div class="item-title">${w.title || ''} • ${w.company || ''}</div>
          <div class="item-meta">${w.startDate || ''}${w.present ? ' - Present' : (w.endDate ? ` - ${w.endDate}` : '')}</div>
        </div>
        ${w.location ? `<div class="item-sub">${w.location}</div>` : ''}
        ${w.responsibilities ? `<div class="item-desc">${w.responsibilities.replace(/\n/g, '<br/>')}</div>` : ''}
      </div>
    `).join('');

    const projects = (form.projects || []).filter(p => p.title || p.description).map(p => `
      <div class="item">
        <div class="item-head">
          <div class="item-title">${p.title || ''}</div>
          ${p.link ? `<div class="item-meta"><a href="${p.link}">${p.link}</a></div>` : ''}
        </div>
        ${p.tools ? `<div class="item-sub">Tools: ${p.tools}</div>` : ''}
        ${p.description ? `<div class="item-desc">${p.description}</div>` : ''}
      </div>
    `).join('');

    const certifications = (form.certifications || []).filter(c => c.name).map(c => `
      <div class="item">
        <div class="item-head">
          <div class="item-title">${c.name}</div>
          <div class="item-meta">${c.issueDate || ''}</div>
        </div>
        ${c.issuer ? `<div class="item-sub">${c.issuer}</div>` : ''}
        ${c.credentialId ? `<div class="item-sub">Credential ID: ${c.credentialId}</div>` : ''}
        ${c.credentialUrl ? `<div class="item-sub"><a href="${c.credentialUrl}">${c.credentialUrl}</a></div>` : ''}
      </div>
    `).join('');

    const achievements = (form.achievements || []).filter(a => a.title).map(a => `
      <div class="item">
        <div class="item-head">
          <div class="item-title">${a.title}</div>
          <div class="item-meta">${a.year || ''}</div>
        </div>
        ${a.description ? `<div class="item-desc">${a.description}</div>` : ''}
      </div>
    `).join('');

    const volunteer = (form.volunteer || []).filter(v => v.organization || v.role).map(v => `
      <div class="item">
        <div class="item-head">
          <div class="item-title">${v.role || ''} • ${v.organization || ''}</div>
          <div class="item-meta">${v.duration || ''}</div>
        </div>
        ${v.description ? `<div class="item-desc">${v.description}</div>` : ''}
      </div>
    `).join('');

    const references = (form.references || []).filter(r => r.name).map(r => `
      <div class="item">
        <div class="item-head">
          <div class="item-title">${r.name}</div>
          <div class="item-meta">${r.position || ''}${r.company ? `, ${r.company}` : ''}</div>
        </div>
        <div class="item-sub">${r.email || ''}${r.phone ? ` • ${r.phone}` : ''}</div>
      </div>
    `).join('');

    const links = [
      form.linkedin ? `<a href="${form.linkedin}">LinkedIn</a>` : '',
      form.github ? `<a href="${form.github}">GitHub</a>` : '',
      form.website ? `<a href="${form.website}">Website</a>` : '',
      form.email ? `<a href="mailto:${form.email}">${form.email}</a>` : '',
      form.phone ? `<span>${form.phone}</span>` : '',
      form.location ? `<span>${form.location}</span>` : '',
    ].filter(Boolean).join(' • ');

    const styles = `
      <style>
        @page { 
          size: A4; 
          margin: 0;
          @top-center { content: ""; }
          @bottom-center { content: ""; }
          @top-left { content: ""; }
          @top-right { content: ""; }
          @bottom-left { content: ""; }
          @bottom-right { content: ""; }
        }
        .resume-scope { 
          font-family: ${font}; 
          color: #111827; 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
          line-height: 1.4;
        }
        .resume-scope .resume { 
          max-width: 800px; 
          margin: 0 auto;
          padding: 30px 20px;
          min-height: 100vh;
        }
        .resume-scope .header { 
          display: flex; 
          align-items: center; 
          gap: 25px; 
          border-bottom: 3px solid ${color}; 
          padding: 20px 0 25px 0;
          margin-bottom: 30px;
        }
        .resume-scope .avatar { 
          width: 100px; 
          height: 100px; 
          border-radius: 9999px; 
          object-fit: cover; 
          border: 4px solid ${color};
          flex-shrink: 0;
        }
        .resume-scope .name { 
          font-size: 32px; 
          font-weight: 700; 
          line-height: 1.1;
          color: ${color};
          margin-bottom: 8px;
        }
        .resume-scope .title { 
          font-size: 20px; 
          color: #374151;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .resume-scope .contact { 
          font-size: 15px; 
          color: #6b7280;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          line-height: 1.6;
        }
        .resume-scope .section { 
          margin-top: 28px;
          page-break-inside: avoid;
        }
        .resume-scope .section-title { 
          font-size: 18px; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          color: ${color}; 
          border-bottom: 2px solid ${color}; 
          padding-bottom: 10px;
          margin-bottom: 18px;
        }
        .resume-scope .item { 
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .resume-scope .item-head { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          gap: 16px; 
          margin-bottom: 6px;
        }
        .resume-scope .item-title { 
          font-weight: 600;
          font-size: 17px;
          color: #111827;
          line-height: 1.3;
        }
        .resume-scope .item-meta { 
          font-size: 15px; 
          color: #6b7280; 
          white-space: nowrap;
          font-weight: 500;
        }
        .resume-scope .item-sub { 
          font-size: 15px; 
          color: #374151; 
          margin-bottom: 4px;
          font-style: italic;
          font-weight: 500;
        }
        .resume-scope .item-desc { 
          font-size: 15px; 
          color: #4b5563; 
          margin-top: 8px;
          line-height: 1.6;
        }
        .resume-scope .skill-list { 
          margin: 12px 0 0 20px;
          columns: 2;
          column-gap: 30px;
        }
        .resume-scope .skill-list li { 
          font-size: 15px; 
          margin: 6px 0;
          break-inside: avoid;
          font-weight: 500;
        }
        .resume-scope a { 
          color: ${color}; 
          text-decoration: none;
          font-weight: 500;
        }
        .resume-scope a:hover {
          text-decoration: underline;
        }
        @media print {
          @page { 
            margin: 15mm;
            size: A4;
          }
          .resume-scope .resume { 
            padding: 0;
            max-width: none;
          }
          .resume-scope { 
            font-size: 12px;
          }
          .resume-scope .header {
            padding: 15px 0 20px 0;
            margin-bottom: 25px;
          }
          .resume-scope .name {
            font-size: 28px;
          }
          .resume-scope .title {
            font-size: 18px;
          }
          .resume-scope .avatar {
            width: 80px;
            height: 80px;
          }
        }
      </style>
    `;

    const body = `
      <div class="resume-scope">
        <div class="resume">
          <div class="header">
            ${form.profilePicture ? `<img class="avatar" src="${form.profilePicture}" alt="${form.name}" />` : ''}
            <div style="flex: 1;">
              <div class="name">${form.name || 'Your Name'}</div>
              <div class="title">${form.professionalTitle || 'Professional Title'}</div>
              <div class="contact">${links}</div>
            </div>
          </div>
          
          ${form.bio ? section('Professional Summary', `<div class="item-desc">${form.bio}</div>`) : ''}
          
          ${section('Skills', `
            ${techSkills ? `<div class="item"><div class="item-title">Technical Skills</div>${techSkills}</div>` : ''}
            ${softSkills ? `<div class="item"><div class="item-title">Soft Skills</div>${softSkills}</div>` : ''}
            ${languages ? `<div class="item"><div class="item-title">Languages</div>${languages}</div>` : ''}
          `)}
          
          ${work ? section('Work Experience', work) : ''}
          ${projects ? section('Projects', projects) : ''}
          ${education ? section('Education', education) : ''}
          ${certifications ? section('Certifications', certifications) : ''}
          ${achievements ? section('Achievements', achievements) : ''}
          ${volunteer ? section('Volunteer Experience', volunteer) : ''}
          ${references ? section('References', references) : ''}
        </div>
      </div>
    `;

    if (inlinePreview) return `${styles}${body}`;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${form.name} - Resume</title>${styles}</head><body>${body}</body></html>`;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearForm = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setForm({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        location: '',
        professionalTitle: '',
        bio: '',
        experienceYears: '',
        linkedin: '',
        github: '',
        website: '',
        profilePicture: '',
        education: [{ degree: '', institution: '', department: '', startYear: '', endYear: '', result: '', description: '' }],
        work: [{ title: '', company: '', location: '', startDate: '', endDate: '', present: false, responsibilities: '' }],
        techSkills: [],
        softSkills: [],
        languages: [{ name: '', level: '' }],
        projects: [{ title: '', description: '', tools: '', link: '' }],
        certifications: [{ name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' }],
        achievements: [{ title: '', description: '', year: '' }],
        volunteer: [{ organization: '', role: '', description: '', duration: '' }],
        references: [{ name: '', position: '', company: '', email: '', phone: '' }],
        targetRole: '',
        targetCompany: '',
        jobDescription: '',
        templateStyle: 'Modern',
        accentColor: '#2563eb',
        fontFamily: 'Inter',
        downloadFormat: 'pdf',
      });
      localStorage.removeItem('resume-builder-draft');
      toast.success('Form cleared successfully!');
    }
  };

  const SectionHeader = ({ title, section }) => (
    <div 
      className="flex items-center justify-between cursor-pointer p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-lg font-semibold flex items-center gap-2">
        {title}
        <span className="text-sm font-normal text-base-content/70">
          ({calculateSectionCount(section)})
        </span>
      </h3>
      <span className="text-lg">
        {expandedSections[section] ? <FaChevronUp /> : <FaChevronDown />}
      </span>
    </div>
  );

  const calculateSectionCount = (section) => {
    switch (section) {
      case 'personal':
        return ['name', 'email', 'professionalTitle', 'bio'].filter(field => form[field]?.trim()).length;
      case 'education':
        return form.education.filter(ed => ed.degree || ed.institution).length;
      case 'work':
        return form.work.filter(w => w.title || w.company).length;
      case 'skills':
        return form.techSkills.length + form.softSkills.length + form.languages.filter(l => l.name).length;
      case 'projects':
        return form.projects.filter(p => p.title).length;
      case 'certifications':
        return form.certifications.filter(c => c.name).length;
      case 'achievements':
        return form.achievements.filter(a => a.title).length;
      case 'volunteer':
        return form.volunteer.filter(v => v.organization).length;
      case 'references':
        return form.references.filter(r => r.name).length;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Professional Resume Builder
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume with AI-powered optimization
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-base-200 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold">Profile Completion</span>
            <span className="text-sm font-bold text-primary">{calculateCompletion()}%</span>
          </div>
          <progress 
            className="progress progress-primary w-full h-3" 
            value={calculateCompletion()} 
            max="100"
          ></progress>
          <div className="flex justify-between text-xs text-base-content/60 mt-2">
            <span>Complete all sections for best results</span>
            <span>{calculateCompletion() >= 80 ? 'Ready to generate!' : 'Keep going!'}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar - Form Sections */}
          <div className="xl:col-span-3 space-y-6">
            {/* Navigation Tabs */}
            <div className="tabs tabs-boxed bg-base-200 p-1">
              <button 
                className={`tab tab-lg flex-1 ${activeTab === 'form' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                <FaEdit className="mr-2" />
                Build Resume
              </button>
              <button 
                className={`tab tab-lg flex-1 ${activeTab === 'preview' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <FaEye className="mr-2" />
                Preview
              </button>
            </div>

            {activeTab === 'form' && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
                  <SectionHeader title="Personal Information" section="personal" />
                  {expandedSections.personal && (
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">Full Name *</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="John Doe" 
                            value={form.name} 
                            onChange={update('name')} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">Email *</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="john@example.com" 
                            value={form.email} 
                            onChange={update('email')} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">Professional Title *</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="Senior Software Engineer" 
                            value={form.professionalTitle} 
                            onChange={update('professionalTitle')} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">Phone</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="+1 (555) 123-4567" 
                            value={form.phone} 
                            onChange={update('phone')} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">Location</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="City, Country" 
                            value={form.location} 
                            onChange={update('location')} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">Years of Experience</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="5+" 
                            value={form.experienceYears} 
                            onChange={update('experienceYears')} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">LinkedIn</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="https://linkedin.com/in/username" 
                            value={form.linkedin} 
                            onChange={update('linkedin')} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">GitHub</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="https://github.com/username" 
                            value={form.github} 
                            onChange={update('github')} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">Portfolio</span>
                          </label>
                          <input 
                            className="input input-bordered w-full" 
                            placeholder="https://yourwebsite.com" 
                            value={form.website} 
                            onChange={update('website')} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-2 space-y-2">
                          <label className="label">
                            <span className="label-text font-semibold">Professional Summary *</span>
                          </label>
                          <textarea 
                            className="textarea textarea-bordered w-full h-32" 
                            placeholder="Experienced software engineer with 5+ years in web development..." 
                            value={form.bio} 
                            onChange={update('bio')} 
                          />
                          <div className="text-xs text-base-content/60">
                            {form.bio.length}/500 characters
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="label">
                              <span className="label-text font-semibold">Profile Picture</span>
                            </label>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="file-input file-input-bordered w-full" 
                              onChange={onUploadPicture} 
                            />
                          </div>
                          {form.profilePicture && (
                            <div className="text-center">
                              <img 
                                src={form.profilePicture} 
                                alt="Profile" 
                                className="h-24 w-24 rounded-full object-cover mx-auto border-2 border-primary"
                              />
                              <button 
                                className="btn btn-ghost btn-xs mt-2 text-error"
                                onClick={() => setForm(f => ({ ...f, profilePicture: '' }))}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Work Experience */}
                <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
                  <SectionHeader title="Work Experience (Optional)" section="work" />
                  {expandedSections.work && (
                    <div className="p-6 space-y-6">
                      {form.work.map((w, i) => (
                        <div key={i} className="p-4 border border-base-300 rounded-lg space-y-4 bg-base-200/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text font-semibold">Job Title</span>
                              </label>
                              <input 
                                className="input input-bordered w-full" 
                                placeholder="Senior Developer" 
                                value={w.title} 
                                onChange={updateNested('work', i, 'title')} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text font-semibold">Company</span>
                              </label>
                              <input 
                                className="input input-bordered w-full" 
                                placeholder="Tech Company Inc." 
                                value={w.company} 
                                onChange={updateNested('work', i, 'company')} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text font-semibold">Location</span>
                              </label>
                              <input 
                                className="input input-bordered w-full" 
                                placeholder="Remote / City, Country" 
                                value={w.location} 
                                onChange={updateNested('work', i, 'location')} 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <label className="label">
                                  <span className="label-text font-semibold">Start Date</span>
                                </label>
                                <input 
                                  className="input input-bordered w-full" 
                                  placeholder="Jan 2020" 
                                  value={w.startDate} 
                                  onChange={updateNested('work', i, 'startDate')} 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="label">
                                  <span className="label-text font-semibold">End Date</span>
                                </label>
                                <input 
                                  className="input input-bordered w-full" 
                                  placeholder="Present" 
                                  value={w.endDate} 
                                  onChange={updateNested('work', i, 'endDate')}
                                  disabled={w.present}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <label className="label cursor-pointer justify-start gap-3">
                            <input 
                              type="checkbox" 
                              className="checkbox checkbox-primary" 
                              checked={w.present} 
                              onChange={updateNested('work', i, 'present')} 
                            />
                            <span className="label-text font-medium">I currently work here</span>
                          </label>

                          <div className="space-y-2">
                            <label className="label">
                              <span className="label-text font-semibold">Responsibilities & Achievements</span>
                            </label>
                            <textarea 
                              className="textarea textarea-bordered w-full h-24" 
                              placeholder="• Led a team of 5 developers...
• Improved application performance by 40%...
• Implemented new features using React and Node.js..." 
                              value={w.responsibilities} 
                              onChange={updateNested('work', i, 'responsibilities')} 
                            />
                            <div className="text-xs text-base-content/60">
                              Use bullet points for better readability
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button 
                              className="btn btn-ghost btn-sm text-error" 
                              onClick={removeItem('work', i)}
                            >
                              <FaTrash className="mr-2" />
                              Remove Experience
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        className="btn btn-outline btn-primary w-full" 
                        onClick={addItem('work', { title: '', company: '', location: '', startDate: '', endDate: '', present: false, responsibilities: '' })}
                      >
                        <FaPlus className="mr-2" />
                        Add Work Experience
                      </button>
                    </div>
                  )}
                </div>

                {/* Education */}
                <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
                  <SectionHeader title="Education" section="education" />
                  {expandedSections.education && (
                    <div className="p-6 space-y-6">
                      {form.education.map((ed, i) => (
                        <div key={i} className="p-4 border border-base-300 rounded-lg space-y-4 bg-base-200/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text font-semibold">Degree *</span>
                              </label>
                              <input 
                                className="input input-bordered w-full" 
                                placeholder="Bachelor of Science in Computer Science" 
                                value={ed.degree} 
                                onChange={updateNested('education', i, 'degree')} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text font-semibold">Institution *</span>
                              </label>
                              <input 
                                className="input input-bordered w-full" 
                                placeholder="University Name" 
                                value={ed.institution} 
                                onChange={updateNested('education', i, 'institution')} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text font-semibold">Department / Major</span>
                              </label>
                              <input 
                                className="input input-bordered w-full" 
                                placeholder="Computer Science" 
                                value={ed.department} 
                                onChange={updateNested('education', i, 'department')} 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <label className="label">
                                  <span className="label-text font-semibold">Start Year</span>
                                </label>
                                <input 
                                  className="input input-bordered w-full" 
                                  placeholder="2018" 
                                  value={ed.startYear} 
                                  onChange={updateNested('education', i, 'startYear')} 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="label">
                                  <span className="label-text font-semibold">End Year</span>
                                </label>
                                <input 
                                  className="input input-bordered w-full" 
                                  placeholder="2022" 
                                  value={ed.endYear} 
                                  onChange={updateNested('education', i, 'endYear')} 
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text font-semibold">CGPA / Result</span>
                              </label>
                              <input 
                                className="input input-bordered w-full" 
                                placeholder="3.8/4.0 or First Class" 
                                value={ed.result} 
                                onChange={updateNested('education', i, 'result')} 
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="label">
                              <span className="label-text font-semibold">Description</span>
                            </label>
                            <textarea 
                              className="textarea textarea-bordered w-full h-20" 
                              placeholder="Relevant coursework, achievements, honors..." 
                              value={ed.description} 
                              onChange={updateNested('education', i, 'description')} 
                            />
                          </div>

                          <div className="flex justify-end">
                            <button 
                              className="btn btn-ghost btn-sm text-error" 
                              onClick={removeItem('education', i)}
                            >
                              <FaTrash className="mr-2" />
                              Remove Education
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        className="btn btn-outline btn-primary w-full" 
                        onClick={addItem('education', { degree: '', institution: '', department: '', startYear: '', endYear: '', result: '', description: '' })}
                      >
                        <FaPlus className="mr-2" />
                        Add Education
                      </button>
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
                  <SectionHeader title="Skills" section="skills" />
                  {expandedSections.skills && (
                    <div className="p-6 space-y-6">
                      {/* Technical Skills */}
                      <div className="space-y-4">
                        <label className="label">
                          <span className="label-text font-semibold text-lg">Technical Skills</span>
                        </label>
                        <div className="flex gap-2">
                          <input 
                            id="tech-skill-input" 
                            className="input input-bordered flex-1" 
                            placeholder="e.g., JavaScript, React, Node.js, Python" 
                          />
                          <button 
                            className="btn btn-primary" 
                            onClick={() => { 
                              const el = document.getElementById('tech-skill-input'); 
                              addChip('techSkills', el.value); 
                              el.value = ''; 
                            }}
                          >
                            Add Skill
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(form.techSkills || []).map((s) => (
                            <span key={s} className="badge badge-primary badge-lg gap-2 py-3 px-4">
                              {s}
                              <button 
                                onClick={() => removeChip('techSkills', s)} 
                                className="ml-1 hover:text-error transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Soft Skills */}
                      <div className="space-y-4">
                        <label className="label">
                          <span className="label-text font-semibold text-lg">Soft Skills</span>
                        </label>
                        <div className="flex gap-2">
                          <input 
                            id="soft-skill-input" 
                            className="input input-bordered flex-1" 
                            placeholder="e.g., Leadership, Communication, Problem Solving" 
                          />
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => { 
                              const el = document.getElementById('soft-skill-input'); 
                              addChip('softSkills', el.value); 
                              el.value = ''; 
                            }}
                          >
                            Add Skill
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(form.softSkills || []).map((s) => (
                            <span key={s} className="badge badge-secondary badge-lg gap-2 py-3 px-4">
                              {s}
                              <button 
                                onClick={() => removeChip('softSkills', s)} 
                                className="ml-1 hover:text-error transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="space-y-4">
                        <label className="label">
                          <span className="label-text font-semibold text-lg">Languages</span>
                        </label>
                        {form.languages.map((lng, i) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-base-300 rounded-lg bg-base-200/50">
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Language</span>
                              </label>
                              <input 
                                className="input input-bordered w-full" 
                                placeholder="English" 
                                value={lng.name} 
                                onChange={updateNested('languages', i, 'name')} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Proficiency Level</span>
                              </label>
                              <select 
                                className="select select-bordered w-full" 
                                value={lng.level} 
                                onChange={updateNested('languages', i, 'level')}
                              >
                                <option value="">Select Level</option>
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                              </select>
                            </div>
                            <div className="flex items-end">
                              <button 
                                className="btn btn-ghost btn-sm text-error" 
                                onClick={removeItem('languages', i)}
                              >
                                <FaTrash className="mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        <button 
                          className="btn btn-outline w-full" 
                          onClick={addItem('languages', { name: '', level: '' })}
                        >
                          <FaPlus className="mr-2" />
                          Add Language
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Projects */}
                  <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
                    <SectionHeader title="Projects" section="projects" />
                    {expandedSections.projects && (
                      <div className="p-6 space-y-4">
                        {form.projects.map((p, i) => (
                          <div key={i} className="p-4 border border-base-300 rounded-lg space-y-3 bg-base-200/50">
                            <input 
                              className="input input-bordered w-full" 
                              placeholder="Project Title" 
                              value={p.title} 
                              onChange={updateNested('projects', i, 'title')} 
                            />
                            <textarea 
                              className="textarea textarea-bordered w-full" 
                              rows={2} 
                              placeholder="Project description and your contributions..." 
                              value={p.description} 
                              onChange={updateNested('projects', i, 'description')} 
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input 
                                className="input input-bordered" 
                                placeholder="Technologies Used" 
                                value={p.tools} 
                                onChange={updateNested('projects', i, 'tools')} 
                              />
                              <input 
                                className="input input-bordered" 
                                placeholder="Project URL" 
                                value={p.link} 
                                onChange={updateNested('projects', i, 'link')} 
                              />
                            </div>
                            <button 
                              className="btn btn-ghost btn-sm text-error w-full" 
                              onClick={removeItem('projects', i)}
                            >
                              <FaTrash className="mr-2" />
                              Remove Project
                            </button>
                          </div>
                        ))}
                        <button 
                          className="btn btn-outline w-full" 
                          onClick={addItem('projects', { title: '', description: '', tools: '', link: '' })}
                        >
                          <FaPlus className="mr-2" />
                          Add Project
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
                    <SectionHeader title="Certifications" section="certifications" />
                    {expandedSections.certifications && (
                      <div className="p-6 space-y-4">
                        {form.certifications.map((c, i) => (
                          <div key={i} className="p-4 border border-base-300 rounded-lg space-y-3 bg-base-200/50">
                            <div className="grid grid-cols-1 gap-3">
                              <input 
                                className="input input-bordered" 
                                placeholder="Certificate Name" 
                                value={c.name} 
                                onChange={updateNested('certifications', i, 'name')} 
                              />
                              <input 
                                className="input input-bordered" 
                                placeholder="Issuing Organization" 
                                value={c.issuer} 
                                onChange={updateNested('certifications', i, 'issuer')} 
                              />
                              <input 
                                className="input input-bordered" 
                                placeholder="Issue Date" 
                                value={c.issueDate} 
                                onChange={updateNested('certifications', i, 'issueDate')} 
                              />
                              <input 
                                className="input input-bordered" 
                                placeholder="Credential ID" 
                                value={c.credentialId} 
                                onChange={updateNested('certifications', i, 'credentialId')} 
                              />
                              <input 
                                className="input input-bordered" 
                                placeholder="Credential URL" 
                                value={c.credentialUrl} 
                                onChange={updateNested('certifications', i, 'credentialUrl')} 
                              />
                            </div>
                            <button 
                              className="btn btn-ghost btn-sm text-error w-full" 
                              onClick={removeItem('certifications', i)}
                            >
                              <FaTrash className="mr-2" />
                              Remove Certification
                            </button>
                          </div>
                        ))}
                        <button 
                          className="btn btn-outline w-full" 
                          onClick={addItem('certifications', { name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' })}
                        >
                          <FaPlus className="mr-2" />
                          Add Certification
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-base-200 rounded-xl p-6 space-y-4">
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button 
                      className={`btn btn-primary btn-lg ${loading ? 'btn-disabled' : ''}`} 
                      onClick={handleGenerate} 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Generate Resume
                        </>
                      )}
                    </button>
                    
                    <button 
                      className="btn btn-secondary btn-lg" 
                      onClick={exportStyledPDF}
                    >
                      <FaDownload className="mr-2" />
                      Export Styled PDF
                    </button>

                    <button 
                      className="btn btn-outline btn-error" 
                      onClick={clearForm}
                    >
                      <FaTrash className="mr-2" />
                      Clear All
                    </button>
                  </div>

                  {error && (
                    <div className="alert alert-error">
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Resume Preview</h3>
                  <div className="space-y-6">
                    {/* Markdown Preview */}
                    <div className="space-y-3">
                      <label className="label">
                        <span className="label-text font-semibold">AI Generated Markdown</span>
                      </label>
                      <div className="border border-base-300 rounded-lg p-4 bg-base-200/50">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {resume || 'Generate your resume to see the markdown preview here...'}
                        </pre>
                      </div>
                    </div>

                    {/* Styled Preview */}
                    <div className="space-y-3">
                      <label className="label">
                        <span className="label-text font-semibold">Styled Preview</span>
                      </label>
                      <div className="border border-base-300 rounded-lg overflow-hidden bg-white">
                        <div 
                          className="p-4 max-h-[600px] overflow-auto"
                          dangerouslySetInnerHTML={{ __html: buildStyledHTML(true) }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Work Experiences</span>
                  <span className="badge badge-primary">{form.work.filter(w => w.title && w.company).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Education Entries</span>
                  <span className="badge badge-secondary">{form.education.filter(ed => ed.degree && ed.institution).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Technical Skills</span>
                  <span className="badge badge-accent">{form.techSkills.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Projects</span>
                  <span className="badge badge-info">{form.projects.filter(p => p.title).length}</span>
                </div>
              </div>
            </div>

            {/* Customization */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
              <SectionHeader title="Customization" section="customization" />
              {expandedSections.customization && (
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="label">
                      <span className="label-text font-semibold">Template Style</span>
                    </label>
                    <select 
                      className="select select-bordered w-full" 
                      value={form.templateStyle} 
                      onChange={update('templateStyle')}
                    >
                      <option>Modern</option>
                      <option>Minimal</option>
                      <option>Creative</option>
                      <option>Professional</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="label">
                      <span className="label-text font-semibold">Accent Color</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        className="input input-bordered w-16 h-10 p-1" 
                        value={form.accentColor} 
                        onChange={update('accentColor')} 
                      />
                      <span className="text-sm">{form.accentColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="label">
                      <span className="label-text font-semibold">Font Family</span>
                    </label>
                    <select 
                      className="select select-bordered w-full" 
                      value={form.fontFamily} 
                      onChange={update('fontFamily')}
                    >
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                      <option>Lato</option>
                      <option>Georgia</option>
                      <option>Arial</option>
                    </select>
                  </div>

                  <div className="divider"></div>

                  {/* Job Targeting */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Job Targeting</h4>
                    <div className="space-y-2">
                      <input 
                        className="input input-bordered w-full" 
                        placeholder="Target Role" 
                        value={form.targetRole} 
                        onChange={update('targetRole')} 
                      />
                      <input 
                        className="input input-bordered w-full" 
                        placeholder="Target Company" 
                        value={form.targetCompany} 
                        onChange={update('targetCompany')} 
                      />
                      <textarea 
                        className="textarea textarea-bordered w-full" 
                        rows={3} 
                        placeholder="Paste job description for AI optimization..." 
                        value={form.jobDescription} 
                        onChange={update('jobDescription')} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Pro Tips</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="badge badge-primary badge-sm mt-1">1</div>
                  <span>Use action verbs and quantify achievements</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="badge badge-primary badge-sm mt-1">2</div>
                  <span>Keep professional summary under 4-5 lines</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="badge badge-primary badge-sm mt-1">3</div>
                  <span>Include relevant keywords from job description</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="badge badge-primary badge-sm mt-1">4</div>
                  <span>Use consistent formatting and bullet points</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="badge badge-primary badge-sm mt-1">5</div>
                  <span>Proofread for spelling and grammar errors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}