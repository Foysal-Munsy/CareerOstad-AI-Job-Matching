"use client";

import { useState } from "react";

export default function FeedbackPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rating, setRating] = useState("5");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Feedback from ${name || "Anonymous"}`);
        const body = encodeURIComponent(
            `Name: ${name || "Anonymous"}\nEmail: ${email || "N/A"}\nRating: ${rating}/5\n\nMessage:\n${message}`
        );
        window.location.href = `mailto:tanimkhalifa55@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <main className="min-h-screen">
            <header
                className="w-full"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-content)" }}
            >
                <div className="max-w-3xl mx-auto px-4 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Feedback</h1>
                    <p className="mt-3 text-lg opacity-90">
                        We value your thoughts. Share your feedback to help us improve CareerOstad.
                    </p>
                </div>
            </header>

            <section className="bg-white" style={{ backgroundColor: "var(--color-base-100)", color: "var(--color-base-content)" }}>
                <div className="max-w-3xl mx-auto px-4 py-12">
                    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl p-6 shadow-sm"
                        style={{ backgroundColor: "var(--color-base-300)", border: "1px solid var(--color-base-200)" }}
                        aria-label="Feedback form"
                    >
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 form-input"
                                style={{ borderColor: "var(--color-base-200)" }}
                                placeholder="Your name"
                                autoComplete="name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 form-input"
                                style={{ borderColor: "var(--color-base-200)" }}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium mb-1">Rating</label>
                            <select
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full rounded-md border px-3 py-2"
                                style={{ borderColor: "var(--color-base-200)" }}
                            >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Good</option>
                                <option value="3">3 - Fair</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Bad</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 min-h-[140px] form-input"
                                style={{ borderColor: "var(--color-base-200)" }}
                                placeholder="Share your suggestions, issues, or ideas..."
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold btn-professional"
                                style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-secondary-content)" }}
                            >
                                Send Feedback
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12l3.75 3.75L18 7.5" />
                                </svg>
                            </button>
                            <a
                                href="mailto:tanimkhalifa55@gmail.com"
                                className="text-sm font-medium"
                                style={{ color: "var(--color-primary)" }}
                            >
                                Or email us directly
                            </a>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}


