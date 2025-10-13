"use client"
import React, { useState } from "react";
import SocialLogin from "./SocialLogin";
import { signIn } from "next-auth/react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    // Autofill from localStorage if available
    React.useEffect(() => {
        const savedEmail = window.localStorage.getItem("login_email");
        const savedPassword = window.localStorage.getItem("login_password");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleCredentialLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl
            });
            if (res?.ok) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Login successful!',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'swal-toast-zindex'
                    }
                }).then(() => {
                    //setLoading(false);
                    router.push(res.url || callbackUrl);
                });
                // Save credentials if rememberMe is checked
                if (rememberMe) {
                    window.localStorage.setItem("login_email", email);
                    window.localStorage.setItem("login_password", password);
                } else {
                    window.localStorage.removeItem("login_email");
                    window.localStorage.removeItem("login_password");
                }
            } else {
                //setLoading(false);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Login failed! Check your credentials.',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'swal-toast-zindex'
                    }
                });
                setLoading(false)
            }
        } catch (error) {
            //setLoading(false);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'An error occurred. Please try again.',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                customClass: {
                    popup: 'swal-toast-zindex'
                }
            });
            setLoading(false);
        }
    };

    // Autofill from localStorage if available
    React.useEffect(() => {
        const savedEmail = window.localStorage.getItem("login_email");
        const savedPassword = window.localStorage.getItem("login_password");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    return (
        <form onSubmit={handleCredentialLogin} className="space-y-4">
            <div className="space-y-3">
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-blue-600">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <input
                            type="email"
                            name='email'
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-blue-600">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-blue-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <FaEyeSlash className="h-5 w-5 cursor-pointer" />
                            ) : (
                                <FaEye className="h-5 w-5 cursor-pointer" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1 cursor-pointer"
                        checked={rememberMe}
                        onChange={() => setRememberMe((prev) => !prev)}
                    />
                    <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            <button
                type="submit"
                name="action"
                value="credential"
                disabled={loading}
                className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {loading ? (
                        <>
                            Logging in
                            <span className="ml-1">
                                <span className="loading loading-dots loading-xs"></span>
                            </span>
                        </>
                    ) : (
                        "Sign In"
                    )}
                </span>
            </button>

            <SocialLogin />
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Don't Have Any Account?{" "}
                    <Link href="/sigup" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </form>
    );
};

export default LoginForm;