"use client";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen">
            <header
                className="w-full"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-content)" }}
            >
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="mt-3 max-w-3xl text-lg opacity-90">
                        Your privacy is important to us. This policy explains what data we collect, how we use it,
                        and your choices.
                    </p>
                </div>
            </header>

            <section className="bg-white" style={{ backgroundColor: "var(--color-base-100)", color: "var(--color-base-content)" }}>
                <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Information We Collect</h2>
                        <p className="text-slate-700">
                            We may collect account information (name, email), profile details, usage data, and
                            technical data such as device and browser information. Some data is provided directly by
                            you; other data is collected automatically when you use our services.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">How We Use Your Information</h2>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Provide and improve our services and features</li>
                            <li>Personalize job matches, learning paths, and recommendations</li>
                            <li>Communicate updates, security alerts, and support responses</li>
                            <li>Analyze usage to enhance performance and reliability</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Sharing and Disclosure</h2>
                        <p className="text-slate-700">
                            We do not sell your personal information. We may share limited data with trusted
                            service providers under strict confidentiality to operate our platform, or as required by law.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Your Choices and Rights</h2>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Access, update, or delete your account information</li>
                            <li>Manage communication preferences</li>
                            <li>Request a copy of your data where applicable</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Data Security</h2>
                        <p className="text-slate-700">
                            We use administrative, technical, and physical safeguards to protect your information. No
                            method of transmission or storage is 100% secure, but we continually improve our protections.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-semibold">Contact Us</h2>
                        <p className="text-slate-700">
                            If you have questions about this policy or your data, please contact us.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="mailto:tanimkhalifa55@gmail.com"
                                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold shadow-sm btn-professional"
                                style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-secondary-content)" }}
                            >
                                Email Privacy Team
                            </a>
                        </div>
                    </div>

                    <div className="text-sm text-slate-500">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </section>
        </main>
    );
}


