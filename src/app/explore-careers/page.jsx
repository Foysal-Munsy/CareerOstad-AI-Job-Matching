"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function ExploreCareersPage() {
  const [currentStep, setCurrentStep] = useState("quiz");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapCareer, setRoadmapCareer] = useState(null);

  // Fetch quiz questions on component mount
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await fetch('/api/career-quiz');
        const result = await response.json();
        
        if (result.success && result.data.questions) {
          setQuizQuestions(result.data.questions);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Quiz Loading Issue",
            text: "Using fallback questions. Some AI features may be limited.",
            timer: 3000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        Swal.fire({
          icon: "error",
          title: "Connection Error",
          text: "Unable to load quiz questions. Please refresh the page.",
          confirmButtonText: "OK"
        });
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuizQuestions();
  }, []);


  const careerLibrary = [
    { name: "Technology", icon: "💻", jobs: "15,000+", color: "bg-blue-500" },
    { name: "Healthcare", icon: "🏥", jobs: "12,000+", color: "bg-red-500" },
    { name: "Business", icon: "💼", jobs: "11,800+", color: "bg-green-500" },
    { name: "Finance", icon: "💰", jobs: "8,500+", color: "bg-yellow-500" },
    { name: "Design", icon: "🎨", jobs: "6,500+", color: "bg-purple-500" },
    { name: "Education", icon: "📚", jobs: "7,200+", color: "bg-indigo-500" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Developer at Google",
      text: "CareerOstad's AI guidance helped me transition from marketing to tech. The personalized roadmap was exactly what I needed!",
      avatar: "👩‍💻",
    },
    {
      name: "Michael Rodriguez",
      role: "UX Designer at Meta",
      text: "The career quiz pinpointed my passion for design. I followed their learning path and landed my dream job!",
      avatar: "👨‍🎨",
    },
    {
      name: "Emma Thompson",
      role: "Data Analyst at Microsoft",
      text: "I was lost after college. CareerOstad showed me the best paths for my skills and goals. Game changer!",
      avatar: "👩‍💼",
    },
  ];

  const handleQuizAnswer = (questionId, value) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: value });
  };

  const handleSubmitQuiz = async () => {
    setIsLoading(true);
    
    // Show loading alert
    Swal.fire({
      title: "Analyzing Your Responses",
      html: "Our AI is finding the perfect career matches for you...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const response = await fetch('/api/career-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: quizAnswers,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data.recommendations) {
        Swal.close();
        setRecommendations(result.data.recommendations);
        setCurrentStep("results");
        
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Career Recommendations Ready!",
          text: `We found ${result.data.recommendations.length} perfect career matches for you!`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.close();
        console.error("Failed to get recommendations:", result);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to get recommendations. Please try again."
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Error fetching recommendations:", error);
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Unable to connect to our AI service. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgress = () => {
    if (!quizQuestions.length) return 0;
    return (Object.keys(quizAnswers).length / quizQuestions.length) * 100;
  };

  const handleGenerateRoadmap = async (career) => {
    setIsGeneratingRoadmap(true);
    setRoadmapCareer(career);
    
    // Show loading alert
    Swal.fire({
      title: "Generating Your Roadmap",
      html: `Creating a personalized ${career.title} career roadmap for you...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const response = await fetch('/api/career-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          careerTitle: career.title,
          category: career.category,
          skills: career.skills.join(", "),
          goals: career.description,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        Swal.close();
        setRoadmap(result.data);
        setSelectedCareer(career);
        
        // Show success
        Swal.fire({
          icon: "success",
          title: "Roadmap Generated!",
          text: `Your personalized ${career.title} roadmap is ready!`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.close();
        console.error("Failed to generate roadmap:", result);
        Swal.fire({
          icon: "error",
          title: "Generation Failed",
          text: "Unable to generate roadmap. Please try again."
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Error generating roadmap:", error);
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Unable to connect to our AI service. Please try again later."
      });
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Explore Career Paths with{" "}
              <span className="text-blue-600">AI Guidance</span>
            </h1>
            <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover your ideal career with personalized AI-powered recommendations based on your skills, interests, and goals.
            </p>
            <button
              onClick={() => setCurrentStep("quiz")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-medium shadow hover:shadow-lg transition-all duration-300"
            >
              Start Career Assessment →
            </button>
          </motion.div>
        </div>
      </section>

      {/* AI Career Quiz */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 px-4 bg-white"
          >
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Responses</h3>
              <p className="text-sm text-gray-600">Our AI is finding the perfect career matches for you...</p>
            </div>
          </motion.div>
        )}

        {currentStep === "quiz" && !isLoading && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-10 px-4 bg-white"
          >
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-white to-blue-50/30 rounded-lg shadow-sm border p-6">
              {isLoadingQuestions ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-sm text-gray-600">Loading AI Career Assessment Questions...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Career Assessment</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgress()}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Question {Object.keys(quizAnswers).length + 1} of {quizQuestions.length}
                    </p>
                  </div>

              <div className="space-y-4">
                {quizQuestions.map((question, qIndex) => {
                  if (Object.keys(quizAnswers).length === qIndex) {
                    return (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {question.options.map((option, oIndex) => (
                            <button
                              key={oIndex}
                              onClick={() => handleQuizAnswer(question.id, option.value)}
                              className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-sm"
                            >
                              {option.text}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </div>
              
              {/* Reset Quiz Button - Show when quiz is in progress */}
              {Object.keys(quizAnswers).length > 0 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: "Reset Quiz?",
                        text: "Are you sure you want to start over? Your answers will be lost.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, reset it!",
                        cancelButtonText: "Cancel"
                      });
                      
                      if (result.isConfirmed) {
                        setQuizAnswers({});
                        setRecommendations([]);
                        setCurrentStep("quiz");
                        Swal.fire({
                          icon: "info",
                          title: "Quiz Reset",
                          text: "You can start answering from the beginning.",
                          timer: 1500,
                          showConfirmButton: false
                        });
                      }
                    }}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Reset Quiz
                  </button>
                </div>
              )}

              {Object.keys(quizAnswers).length === quizQuestions.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-center"
                >
                  <button
                    onClick={handleSubmitQuiz}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-all duration-300"
                  >
                    Get AI Recommendations →
                  </button>
                </motion.div>
              )}
                </>
              )}
            </div>
          </motion.section>
        )}

        {/* AI Recommendation Results */}
        {currentStep === "results" && (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-10 px-4 bg-gradient-to-b from-blue-50/50 to-white"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Career Recommendations
                </h2>
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setRecommendations([]);
                    setCurrentStep("quiz");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Retake Quiz →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((career, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedCareer(career)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{career.icon}</span>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {career.match}% Match
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{career.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{career.description}</p>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-xs text-gray-700">
                        <span className="font-medium mr-2">Salary:</span>
                        <span>{career.salary}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-700">
                        <span className="font-medium mr-2">Growth:</span>
                        <span className="text-green-600">{career.growth}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {career.skills.slice(0, 3).map((skill, sIndex) => (
                        <span
                          key={sIndex}
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Career Library */}
      <section className="py-10 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Explore All Career Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {careerLibrary.map((career, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center cursor-pointer hover:bg-white hover:shadow transition-all duration-300"
              >
                <div className={`w-12 h-12 ${career.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-2xl`}>
                  {career.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{career.name}</h3>
                <p className="text-xs text-gray-600">{career.jobs}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Roadmap Generator */}
      <section className="py-10 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Get Your Personalized Career Roadmap</h2>
          <p className="text-sm mb-6 text-gray-600">
            Generate a custom skill-building path with recommended courses, tools, and learning platforms
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold mb-1 text-sm text-gray-900">Learning Paths</h3>
              <p className="text-xs text-gray-600">Step-by-step skill progression</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🛠️</div>
              <h3 className="font-semibold mb-1 text-sm text-gray-900">Tools & Resources</h3>
              <p className="text-xs text-gray-600">Essential tools for your career</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="font-semibold mb-1 text-sm text-gray-900">Platforms</h3>
              <p className="text-xs text-gray-600">Best courses and certifications</p>
            </div>
          </div>
          <button 
            onClick={async () => {
              if (recommendations.length > 0) {
                // Show the first recommended career
                handleGenerateRoadmap(recommendations[0]);
              } else {
                // Prompt to take quiz first with sweet alert
                await Swal.fire({
                  icon: "info",
                  title: "Take the Career Assessment First",
                  html: "Complete our AI-powered quiz to get personalized career recommendations and roadmap!",
                  confirmButtonText: "Take Quiz",
                  confirmButtonColor: "#3085d6"
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={isGeneratingRoadmap}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingRoadmap ? "Generating Roadmap..." : "Generate My Roadmap →"}
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center mb-3">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Still Unsure? Get Expert Guidance</h2>
          <p className="text-sm mb-6 opacity-90">
            Chat with our AI mentor or join the CareerOstad community for personalized support
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-all duration-300">
              Chat with AI Mentor →
            </button>
            <button className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium border border-white hover:bg-blue-800 transition-all duration-300">
              Join Community →
            </button>
          </div>
        </div>
      </section>

      {/* Career Detail Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setSelectedCareer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedCareer.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedCareer.title}</h3>
                    <p className="text-sm text-gray-600">{selectedCareer.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Match</p>
                  <p className="text-lg font-bold text-blue-600">{selectedCareer.match}%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Salary</p>
                  <p className="text-sm font-bold text-green-600">{selectedCareer.salary}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Growth</p>
                  <p className="text-base font-bold text-purple-600">{selectedCareer.growth}</p>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Description</h4>
                <p className="text-sm text-gray-700">{selectedCareer.description}</p>
              </div>

              <div className="mb-5">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.skills.map((skill, sIndex) => (
                    <span
                      key={sIndex}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-5">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">Job Market Demand</h4>
                <p className="text-xs text-gray-700">{selectedCareer.demand} - This career is in high demand with excellent growth prospects.</p>
              </div>

              {/* Roadmap Display */}
              {roadmap && roadmapCareer?.title === selectedCareer.title && (
                <div className="mb-5 border-t pt-5">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Career Roadmap</h4>
                  <p className="text-xs text-gray-600 mb-4">{roadmap.overview}</p>
                  
                  {roadmap.roadmap && roadmap.roadmap.length > 0 && (
                    <div className="space-y-4">
                      {roadmap.roadmap.slice(0, 2).map((month, mIndex) => (
                        <div key={mIndex} className="border border-gray-200 rounded-lg p-3">
                          <h5 className="font-semibold text-xs text-gray-900 mb-2">
                            Month {month.month}: {month.title}
                          </h5>
                          {month.weeks && month.weeks.slice(0, 2).map((week, wIndex) => (
                            <div key={wIndex} className="mb-3 last:mb-0">
                              <p className="text-xs font-medium text-gray-700 mb-1">{week.week}: {week.focus}</p>
                              {week.tasks && week.tasks.length > 0 && (
                                <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                                  {week.tasks.slice(0, 2).map((task, tIndex) => (
                                    <li key={tIndex}>{task}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {roadmap.nextSteps && roadmap.nextSteps.length > 0 && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-900 mb-2">Next Steps:</p>
                      <ul className="list-disc list-inside text-xs text-gray-700">
                        {roadmap.nextSteps.slice(0, 3).map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button 
                  onClick={() => handleGenerateRoadmap(selectedCareer)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isGeneratingRoadmap ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Generate Roadmap
                    </>
                  )}
                </button>
                <button 
                  onClick={() => window.location.href = '/jobs'}
                  className="flex-1 bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View Jobs
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

