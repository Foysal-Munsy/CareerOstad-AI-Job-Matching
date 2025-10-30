"use client";

const features = [
    {
        title: "Authentication & Roles",
        points: [
            "Signup, Login, Forgot Password",
            "Role-based access: Candidate, Company, Admin",
            "Protected routes with middleware",
        ],
        href: "/login",
        color: "var(--color-primary)",
    },
    {
        title: "Candidate Profile",
        points: [
            "Public/Private profile",
            "Upload avatar & resume",
            "Notifications & messaging",
        ],
        href: "/dashboard/candidate/profile",
        color: "var(--color-secondary)",
    },
    {
        title: "Company Workspace",
        points: [
            "Company profile & branding",
            "Post jobs & manage applicants",
            "Company analytics",
        ],
        href: "/dashboard/company",
        color: "var(--color-accent)",
    },
    {
        title: "Jobs & Applications",
        points: [
            "Search, view, save, and apply",
            "Recommendations & detailed match score",
            "Application tracking",
        ],
        href: "/jobs",
        color: "var(--color-primary)",
    },
    {
        title: "AI Assistance",
        points: [
            "AI Resume & Cover Letter",
            "AI Interview (generate/evaluate)",
            "Career Quiz & Recommendations",
        ],
        href: "/interview",
        color: "var(--color-secondary)",
    },
    {
        title: "Learning & Certificates",
        points: [
            "Browse courses & enroll",
            "Progress tracking",
            "Certificate issuance",
        ],
        href: "/dashboard/candidate/learning",
        color: "var(--color-accent)",
    },
    {
        title: "Career Advice & Blogs",
        points: [
            "Career advice library",
            "Blogs and categories",
            "Reading experience with loading states",
        ],
        href: "/career-advice",
        color: "var(--color-primary)",
    },
    {
        title: "Messaging & Notifications",
        points: [
            "Direct messages",
            "Notifications center",
            "Realtime updates",
        ],
        href: "/dashboard/candidate/messages",
        color: "var(--color-secondary)",
    },
    {
        title: "Payments & Verification",
        points: [
            "Payment intents",
            "Verification status & webhook",
            "Verified badges",
        ],
        href: "/getverified",
        color: "var(--color-accent)",
    },
    {
        title: "Admin Dashboard",
        points: [
            "Users, roles, jobs, feature jobs",
            "Courses, blogs, categories",
            "Analytics, reports, settings",
        ],
        href: "/dashboard/admin",
        color: "var(--color-primary)",
    },
];

export default function FeaturesPage() {
    return (
        <main className="min-h-screen">
            <header
                className="w-full"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-content)" }}
            >
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Product Features</h1>
                    <p className="mt-3 max-w-3xl text-lg opacity-90">
                        All CareerOstad features at a glance. From AI matching to learning and admin controls—everything in one platform.
                    </p>
                </div>
            </header>

            <section className="bg-white" style={{ backgroundColor: "var(--color-base-100)", color: "var(--color-base-content)" }}>
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <a
                                key={f.title}
                                href={f.href}
                                className="rounded-xl p-6 card-professional focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "var(--color-base-300)",
                                    border: "1px solid var(--color-base-200)",
                                }}
                                aria-label={f.title}
                            >
                                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mb-4"
                                     style={{ backgroundColor: f.color, color: "var(--color-primary-content)" }}>
                                    {f.title}
                                </div>
                                <ul className="list-disc pl-5 text-slate-700 space-y-2">
                                    {f.points.map((p) => (
                                        <li key={p}>{p}</li>
                                    ))}
                                </ul>
                            </a>
                        ))}
                    </div>

                    <div className="mt-12 flex flex-wrap gap-3">
                        <a
                            href="/about"
                            className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold btn-professional"
                            style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-secondary-content)" }}
                        >
                            Learn more about CareerOstad
                        </a>
                        <a
                            href="/feedback"
                            className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold"
                            style={{ border: "1px solid var(--color-base-200)" }}
                        >
                            Share feedback
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}


