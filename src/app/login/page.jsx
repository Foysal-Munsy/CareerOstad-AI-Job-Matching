import React from 'react';
import LoginForm from './components/LoginForm';

const page = async () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
                {/* Left Side - Professional Content */}
                <div className="space-y-6 animate-fade-in-left">
                    <div className="space-y-3">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                            Welcome Back to
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                CareerOstad
                            </span>
                        </h1>
                        <p className="text-base text-gray-600 leading-relaxed">
                            Your AI-powered career companion that connects talent with opportunity. 
                            Discover your next career move with intelligent job matching and personalized guidance.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 animate-slide-up" style={{animationDelay: '0.2s'}}>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm">AI-Powered Matching</h3>
                                <p className="text-gray-600 text-xs">Smart algorithms connect you with perfect opportunities</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 animate-slide-up" style={{animationDelay: '0.4s'}}>
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm">Career Guidance</h3>
                                <p className="text-gray-600 text-xs">Expert advice to accelerate your professional growth</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 animate-slide-up" style={{animationDelay: '0.6s'}}>
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm">Network & Connect</h3>
                                <p className="text-gray-600 text-xs">Build meaningful professional relationships</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100 animate-slide-up" style={{animationDelay: '0.8s'}}>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm">Join 50,000+ Professionals</h4>
                        </div>
                        <p className="text-gray-600 text-xs">
                            Trusted by professionals worldwide to advance their careers with AI-powered insights and opportunities.
                        </p>
                    </div>
                </div>
                
                {/* Right Side - Login Form */}
                <div className="animate-fade-in-right">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
                            <p className="text-sm text-gray-600">Sign in to continue your career journey</p>
                        </div>
                        <LoginForm />
                    </div>
                </div>
            </div>
            
            {/* Background Animation Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '4s'}}></div>
            </div>
        </div>
    );
};

export default page;