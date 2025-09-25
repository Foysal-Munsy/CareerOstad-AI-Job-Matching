'use client';

import { useState } from 'react';

export default function InterviewPage() {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuestions = async () => {
    if (!role.trim()) {
      setError('Please enter a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setEvaluation(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      setError('Please provide an answer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          userAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to evaluate answer');
      }

      setEvaluation(data.evaluation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setEvaluation(null);
    }
  };

  const resetInterview = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setEvaluation(null);
    setError('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Mock Interview
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Master your interview skills with AI-powered questions, real-time feedback, and personalized coaching
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white mb-1">
                Start Your Interview
              </h2>
              <p className="text-blue-100 text-sm">
                Get personalized questions and expert feedback for your dream role
              </p>
            </div>
            <div className="p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <div>
                  <label htmlFor="role" className="block text-base font-semibold text-gray-900 mb-2">
                    What role are you interviewing for?
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Frontend Engineer, Data Scientist, Product Manager"
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && generateQuestions()}
                  />
                </div>
                
                {/* Quick Role Suggestions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setRole(suggestion)}
                      className="p-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={generateQuestions}
                  disabled={loading || !role.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating Questions...</span>
                    </div>
                  ) : (
                    'Start Interview'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(questions[currentQuestionIndex]?.difficulty)}`}>
                    {questions[currentQuestionIndex]?.difficulty}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
                </div>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white mb-3 leading-relaxed">
                  {questions[currentQuestionIndex]?.question}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {questions[currentQuestionIndex]?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-indigo-100">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">
                    Time limit: {Math.floor(questions[currentQuestionIndex]?.time_limit_seconds / 60)} minutes
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="answer" className="block text-base font-semibold text-gray-900 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      id="answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Share your thoughts and approach to this question..."
                      rows={5}
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={evaluateAnswer}
                      disabled={loading || !userAnswer.trim()}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Evaluating...</span>
                        </div>
                      ) : (
                        'Submit Answer'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Results */}
            {evaluation && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Evaluation Results
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    Detailed feedback on your performance
                  </p>
                </div>
                <div className="p-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                    <div className={`text-4xl font-bold mb-3 ${getScoreColor(evaluation.score)}`}>
                      {evaluation.score}
                    </div>
                    <div className="text-lg text-gray-600 mb-2">Overall Score</div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(evaluation.score).replace('text-', 'bg-')}`}
                        style={{ width: `${evaluation.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Detailed Breakdown</h4>
                    {[
                      { label: 'Correctness', score: evaluation.breakdown.correctness },
                      { label: 'Clarity', score: evaluation.breakdown.clarity },
                      { label: 'Problem Solving', score: evaluation.breakdown.problem_solving }
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">{item.label}:</span>
                          <span className={`font-bold text-lg ${getScoreColor(item.score)}`}>
                            {item.score}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(item.score).replace('text-', 'bg-')}`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                    <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Strengths
                    </h4>
                    <ul className="space-y-3">
                      {evaluation.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="text-green-500 mr-3 mt-1">✓</span>
                          <span className="text-sm leading-relaxed">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 border border-red-200">
                    <h4 className="text-lg font-bold text-red-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-3">
                      {evaluation.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="text-red-500 mr-3 mt-1">•</span>
                          <span className="text-sm leading-relaxed">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200 mb-6">
                  <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Suggestions
                  </h4>
                  <ul className="space-y-3">
                    {evaluation.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-3 mt-1">💡</span>
                        <span className="text-sm leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {evaluation.sample_improved_answer && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-8">
                    <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Sample Improved Answer
                    </h4>
                    <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-purple-100">
                      {evaluation.sample_improved_answer}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Next Question
                    </button>
                  ) : (
                    <div className="flex-1 text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                      <div className="text-4xl mb-3">🎉</div>
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        Interview Complete!
                      </p>
                      <p className="text-gray-600 mb-4 text-sm">
                        Great job! You&apos;ve completed all the interview questions.
                      </p>
                      <button
                        onClick={resetInterview}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Start New Interview
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mt-8 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Questions</h3>
            <p className="text-gray-600 leading-relaxed">Get personalized interview questions tailored to your specific role and experience level</p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Feedback</h3>
            <p className="text-gray-600 leading-relaxed">Receive detailed evaluation with scores, strengths, weaknesses, and improvement suggestions</p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Practice Anytime</h3>
            <p className="text-gray-600 leading-relaxed">Practice your interview skills 24/7 with unlimited questions and comprehensive feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}
