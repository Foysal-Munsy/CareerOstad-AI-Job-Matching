import SignupForm from "./components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Professional Content */}
        <div className="space-y-6 animate-fade-in-left">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
              Start Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Career Journey
              </span>
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Join thousands of professionals who trust CareerOstad to unlock their potential. 
              Get AI-powered career insights, connect with opportunities, and accelerate your growth.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Smart Career Matching</h3>
                <p className="text-gray-600 text-xs">AI algorithms find opportunities that match your skills and goals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Skill Development</h3>
                <p className="text-gray-600 text-xs">Access curated learning paths to enhance your expertise</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 animate-slide-up" style={{animationDelay: '0.6s'}}>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Career Growth</h3>
                <p className="text-gray-600 text-xs">Track your progress and achieve your professional milestones</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100 animate-slide-up" style={{animationDelay: '0.8s'}}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">Free to Join, Always</h4>
            </div>
            <p className="text-gray-600 text-xs">
              Start your career transformation today with our free platform. No hidden fees, no commitments - just pure career advancement.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center animate-slide-up" style={{animationDelay: '1s'}}>
              <div className="text-xl font-bold text-purple-600">50K+</div>
              <div className="text-xs text-gray-600">Active Users</div>
            </div>
            <div className="text-center animate-slide-up" style={{animationDelay: '1.2s'}}>
              <div className="text-xl font-bold text-blue-600">10K+</div>
              <div className="text-xs text-gray-600">Job Matches</div>
            </div>
            <div className="text-center animate-slide-up" style={{animationDelay: '1.4s'}}>
              <div className="text-xl font-bold text-green-600">95%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Signup Form */}
        <div className="animate-fade-in-right">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Your Account</h2>
              <p className="text-sm text-gray-600">Join CareerOstad and unlock your potential</p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
      
      {/* Background Animation Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
}