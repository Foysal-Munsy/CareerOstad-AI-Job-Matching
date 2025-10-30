"use client";

import { useState } from "react";

const faqs = [
    {
        q: "What is CareerOstad?",
        a: "CareerOstad is an AI-powered platform that matches candidates to jobs, helps companies hire smarter, and provides learning tools for continuous growth.",
    },
    {
        q: "How does AI job matching work?",
        a: "We analyze your profile, skills, and preferences against job requirements to generate relevant matches and explainable score signals where available.",
    },
    {
        q: "Is my data secure?",
        a: "Yes. We follow industry best practices for security and privacy. See our Privacy Policy for details on data handling and controls.",
    },
    {
        q: "Can I generate resumes and cover letters?",
        a: "Yes. You can generate AI-assisted resumes and cover letters, then review and edit before using them in applications.",
    },
    {
        q: "Do you offer courses and certificates?",
        a: "You can enroll in courses, track progress, and earn certificates upon completion to showcase your achievements.",
    },
    {
        q: "How can companies use CareerOstad?",
        a: "Companies can post jobs, view recommended candidates, evaluate applications with AI insights, and manage hiring from a unified dashboard.",
    },
    {
        q: "Who do I contact for support?",
        a: "Email us at tanimkhalifa55@gmail.com or use the Feedback page to share details so we can assist quickly.",
    },
];

function FAQItem({ item, index }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="rounded-xl border"
            style={{ borderColor: "var(--color-base-200)", backgroundColor: "var(--color-base-300)" }}
        >
            <button
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-none focus:ring-2"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls={`faq-panel-${index}`}
            >
                <span className="font-semibold" style={{ color: "var(--color-base-content)" }}>
                    {item.q}
                </span>
                <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: "var(--color-base-200)" }}
                    aria-hidden
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        {open ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        )}
                    </svg>
                </span>
            </button>
            <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-header-${index}`}
                className={`px-5 transition-all ${open ? "py-0 pb-4 max-h-[400px]" : "max-h-0 overflow-hidden"}`}
                style={{ color: "var(--color-base-content)" }}
            >
                <p className="text-slate-700 mt-1">{item.a}</p>
            </div>
        </div>
    );
}

export default function FAQPage() {
    return (
        <main className="min-h-screen">
            <header
                className="w-full"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-content)" }}
            >
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h1>
                    <p className="mt-3 text-lg opacity-90">
                        Find quick answers about AI matching, privacy, courses, jobs, and company tools.
                    </p>
                </div>
            </header>

            <section className="bg-white" style={{ backgroundColor: "var(--color-base-100)", color: "var(--color-base-content)" }}>
                <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
                    {faqs.map((item, i) => (
                        <FAQItem key={item.q} item={item} index={i} />
                    ))}

                    <div className="mt-10 rounded-xl p-6"
                        style={{ backgroundColor: "var(--color-base-300)", border: "1px solid var(--color-base-200)" }}
                    >
                        <h2 className="text-xl font-semibold">Still need help?</h2>
                        <p className="mt-2 text-slate-700">Reach out and we’ll get back to you.</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <a
                                href="mailto:tanimkhalifa55@gmail.com"
                                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold btn-professional"
                                style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-secondary-content)" }}
                            >
                                Contact Support
                            </a>
                            <a
                                href="/feedback"
                                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold"
                                style={{ border: "1px solid var(--color-base-200)" }}
                            >
                                Send Feedback
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}


