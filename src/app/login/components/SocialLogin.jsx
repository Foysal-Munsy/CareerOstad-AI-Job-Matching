"use client"

import React from 'react';
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useSearchParams } from "next/navigation";

const SocialLogin = () => {
    const router = useRouter();
    const session = useSession();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleSocialLogin = async (providerName) => {
        const providerInfo = {
            google: { name: 'Google', icon: '🔍', color: '#4285F4' },
            github: { name: 'GitHub', icon: '⚡', color: '#333333' }
        };
        
        const { name, icon, color } = providerInfo[providerName];
        
        const { value: role } = await Swal.fire({
            title: `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; background: ${color}; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                        ${icon}
                    </div>
                    <div>
                        <h3 style="margin: 0; color: #1f2937; font-size: 22px; font-weight: 700;">Continue with ${name}</h3>
                        <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Choose your role to get started</p>
                    </div>
                </div>
            `,
            html: `
                <div style="margin-top: 20px;">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <label class="swal-role-option" style="display: flex; align-items: center; gap: 12px; padding: 16px; border: 2px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; background: #fafbfc; position: relative; overflow: hidden;">
                            <input type="radio" name="role" value="candidate" style="margin: 0;">
                            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);">
                                <span style="color: white; font-size: 18px;">👤</span>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px; font-size: 15px;">I'm a Candidate</div>
                                <div style="font-size: 13px; color: #6b7280;">Looking for job opportunities</div>
                            </div>
                            <div class="swal-check-icon" style="opacity: 0; color: #2563eb; font-size: 18px; transition: all 0.3s ease;">✓</div>
                        </label>
                        
                        <label class="swal-role-option" style="display: flex; align-items: center; gap: 12px; padding: 16px; border: 2px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; background: #fafbfc; position: relative; overflow: hidden;">
                            <input type="radio" name="role" value="company" style="margin: 0;">
                            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(240, 147, 251, 0.3);">
                                <span style="color: white; font-size: 18px;">🏢</span>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px; font-size: 15px;">I'm a Company</div>
                                <div style="font-size: 13px; color: #6b7280;">Looking to hire talent</div>
                            </div>
                            <div class="swal-check-icon" style="opacity: 0; color: #2563eb; font-size: 18px; transition: all 0.3s ease;">✓</div>
                        </label>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 12px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 10px; border-left: 4px solid #0ea5e9;">
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #0369a1;">
                            <span style="font-size: 16px;">💡</span>
                            <span>We'll personalize your experience based on your role</span>
                        </div>
                    </div>
                </div>
            `,
            inputValidator: (value) => {
                if (!value) {
                    return 'Please select your role to continue!';
                }
            },
            confirmButtonText: `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Continue with ${name}
                </div>
            `,
            confirmButtonColor: color,
            cancelButtonText: `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Cancel
                </div>
            `,
            cancelButtonColor: '#6b7280',
            showCancelButton: true,
            width: '480px',
            padding: '28px',
            customClass: {
                popup: 'swal-advanced-professional',
                title: 'swal-advanced-title',
                confirmButton: 'swal-advanced-btn',
                cancelButton: 'swal-advanced-cancel'
            }
        });

        if (role) {
            // Pass role as a query param to backend
            Cookies.set('role', role);
            signIn(providerName, { callbackUrl, role });
        }
    };

    useEffect(() => {
        if (session?.status === "authenticated") {
            router.push(callbackUrl);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Signup successful!',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                customClass: {
                    popup: 'swal-toast-zindex'
                }
            });
        }
    }, [session?.status]);

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={() => handleSocialLogin("google")}
                    className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                    <div className="relative flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                            <FaGoogle className="text-white text-sm" />
                        </div>
                        <span className="font-semibold">Continue with Google</span>
                    </div>
                    <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
                
                <button
                    onClick={() => handleSocialLogin("github")}
                    className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/10 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                    <div className="relative flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                            <FaGithub className="text-white text-sm" />
                        </div>
                        <span className="font-semibold">Continue with GitHub</span>
                    </div>
                    <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </div>
            
            <div className="text-center">
                <p className="text-xs text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SocialLogin;