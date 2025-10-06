"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedSection } from "@/components/AnimatedSection"

export default function ProfileForm() {
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState(null)
  const [progress, setProgress] = useState(0)
  const [apiProgress, setApiProgress] = useState(0)
  const progressInterval = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setAdvice(null)
    setProgress(0)
    setApiProgress(0)

    // Simulate real progress: update every 100ms until fetch completes
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        // Only increment if not finished
        if (prev < 98) return prev + 1
        return prev
      })
    }, 100)

    const formData = new FormData(e.currentTarget)
    const body = {
      name: formData.get("name"),
      role: formData.get("role"),
      skills: formData.get("skills"),
      goals: formData.get("goals"),
    }

    // Actual API call
    const res = await fetch("/api/career", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    // When API returns, set progress to 100
    setApiProgress(100)
    setProgress(100)
    clearInterval(progressInterval.current)

    const data = await res.json()
    const dataObj = data.advice ? JSON.parse(data.advice.slice(7, -3)) : null

    window.scrollTo({ top: 0, behavior: "smooth" })
    setAdvice(dataObj)
    setLoading(false)
  }

  // Reset progress when loading ends
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setProgress(0), 800)
      clearInterval(progressInterval.current)
    }
  }, [loading])

  function handleReset() {
    setAdvice(null)
    setProgress(0)
    setApiProgress(0)
  }

  // Animated "pusher" for the progress bar
  const pusherMotion = {
    initial: { x: 0 },
    animate: { x: `${progress}%` },
    transition: { type: "spring", stiffness: 120, damping: 15 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-start py-5 px-4">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-8">

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-indigo-700 mb-8"
        >
          Fill the form and unlock your career advice powered by <span className="text-indigo-500">AI</span>
        </motion.h1>

        <AnimatePresence mode="wait">
          {!advice && (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <input
                name="name"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                name="role"
                placeholder="Current Role"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                name="skills"
                placeholder="Skills (comma separated)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                name="goals"
                placeholder="Your career goals"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                {loading ? <span>Generating <span className="loading loading-ring loading-xs"></span></span> : "Get Advice"}
              </button>

              {/* Real dynamic progress bar while loading */}
              {loading && (
                <motion.div
                  className="w-full h-3 bg-indigo-200 rounded-full mt-4 overflow-hidden relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="h-full bg-indigo-600 absolute left-0 top-0 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Animated pusher */}
                  <motion.div
                    className="absolute top-0 h-3 w-6 bg-indigo-400 rounded-full shadow-lg"
                    style={{
                      left: `calc(${progress}% - 12px)`,
                      zIndex: 2,
                      border: "2px solid #6366f1"
                    }}
                    {...pusherMotion}
                  />
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {/* Advice Section */}
        <AnimatePresence mode="wait">
          {advice && (
            <motion.div
              key="advice"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="mt-10 space-y-10"
            >
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-indigo-700">
                  AI Career Advice for {advice.name}
                </h2>
                <p className="text-gray-600">
                  {advice.role} — {advice.goals}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <h3 className="font-semibold text-lg text-gray-800">Summary</h3>
                <p className="text-gray-700">{advice.advice.summary}</p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <h3 className="font-semibold text-lg text-gray-800">Detailed Guidance</h3>
                <p className="text-gray-700 leading-relaxed">{advice.advice.detailed}</p>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <h3 className="font-semibold text-lg text-gray-800">Recommended Actions</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {advice.advice.recommendedActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </AnimatedSection>

              <AnimatedSection delay={0.5}>
                <h3 className="font-semibold text-lg text-gray-800">Suggested Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {advice.advice.suggestedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.6}>
                <h3 className="font-semibold text-lg text-gray-800">Job Market Insights</h3>
                <p className="text-gray-700 italic">
                  {advice.advice.jobMarketInsights}
                </p>
              </AnimatedSection>

              {/* Show form again */}
              <div className="text-center mt-10">
                <button
                  onClick={handleReset}
                  className="cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Get New Advice
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}