"use client";

export default function AccessibilityPage() {
    return (
        <main className="min-h-screen">
            <header
                className="w-full"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-content)" }}
            >
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Accessibility Statement</h1>
                    <p className="mt-3 max-w-2xl text-lg opacity-90">
                        We are committed to ensuring accessibility for all users, regardless of ability.
                    </p>
                </div>
            </header>

            <section className="bg-white" style={{ backgroundColor: "var(--color-base-100)", color: "var(--color-base-content)" }}>
                <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Our Commitment</h2>
                        <p className="text-slate-700">
                            CareerOstad strives to make our website and services usable by everyone. We aim to follow
                            recognized accessibility standards such as the Web Content Accessibility Guidelines (WCAG) 2.1.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Measures We Take</h2>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Use of semantic HTML for structure and meaning</li>
                            <li>Keyboard navigable components and visible focus styles</li>
                            <li>Color contrast aligned with accessibility best practices</li>
                            <li>ARIA attributes where appropriate to enhance screen reader support</li>
                            <li>Continuous improvements based on user feedback</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Compatibility and Limitations</h2>
                        <p className="text-slate-700">
                            We aim to support modern browsers and assistive technologies. Some older browsers or
                            unsupported extensions may impact the experience.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Feedback and Support</h2>
                        <p className="text-slate-700">
                            Your experience matters. If you encounter accessibility barriers on our site, please let us know so we can improve.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="mailto:tanimkhalifa55@gmail.com"
                                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold shadow-sm btn-professional"
                                style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-secondary-content)" }}
                            >
                                Contact Support
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75zm3 0a.75.75 0 00-.75.75v.443l6.75 3.857 6.75-3.857V7.5a.75.75 0 00-.75-.75h-12z" />
                                    <path d="M20.25 9.26l-6.36 3.635a3.75 3.75 0 01-3.78 0L3.75 9.26v7.99c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V9.26z" />
                                </svg>
                            </a>
                            <a
                                href="mailto:tanimkhalifa55@gmail.com"
                                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold shadow-sm"
                                style={{ border: "1px solid var(--color-base-200)" }}
                            >
                                Email Us
                            </a>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Ongoing Improvements</h2>
                        <p className="text-slate-700">
                            Accessibility is a journey. We review features regularly and prioritize accessible design in
                            new updates across our platform.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}


