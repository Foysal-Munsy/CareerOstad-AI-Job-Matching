"use client";

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <section
                className="w-full"
                style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-content)",
                }}
            >
                <div className="max-w-6xl mx-auto px-4 py-24">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        About CareerOstad
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg opacity-90">
                        CareerOstad is an AI-powered career platform helping candidates and companies
                        connect through smart job matching, skill-based recommendations, and a rich
                        learning ecosystem.
                    </p>
                </div>
            </section>

            <section className="bg-white" style={{ backgroundColor: "var(--color-base-100)", color: "var(--color-base-content)" }}>
                <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-semibold">Our Mission</h2>
                        <p className="text-base leading-relaxed text-slate-600">
                            We empower job seekers to discover roles that fit their skills and goals,
                            and enable employers to find the right talent faster using data-driven insights.
                        </p>
                        <ul className="list-disc pl-5 text-slate-700 space-y-2">
                            <li>AI-driven job and candidate matching</li>
                            <li>Personalized learning paths and career roadmaps</li>
                            <li>Tools for resumes, cover letters, and interview prep</li>
                        </ul>
                    </div>
                    <div
                        className="rounded-xl p-8 shadow-sm"
                        style={{
                            backgroundColor: "var(--color-base-300)",
                            border: "1px solid var(--color-base-200)",
                        }}
                    >
                        <h3 className="text-xl font-semibold">Why CareerOstad?</h3>
                        <p className="mt-3 text-slate-700">
                            We bring together jobs, learning, and smart insights so you spend less time searching
                            and more time growing your career or team.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <span
                                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
                                style={{
                                    backgroundColor: "var(--color-secondary)",
                                    color: "var(--color-secondary-content)",
                                }}
                            >
                                Smart Matching
                            </span>
                            <span
                                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
                                style={{
                                    backgroundColor: "var(--color-accent)",
                                    color: "var(--color-accent-content)",
                                }}
                            >
                                Skill First
                            </span>
                            <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium" style={{ backgroundColor: "var(--color-base-200)" }}>
                                Learning Paths
                            </span>
                        </div>
                        <div className="mt-8">
                            <a
                                href="/explore-careers"
                                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold shadow-sm btn-professional"
                                style={{
                                    backgroundColor: "var(--color-primary)",
                                    color: "var(--color-primary-content)",
                                }}
                            >
                                Explore Careers
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}


