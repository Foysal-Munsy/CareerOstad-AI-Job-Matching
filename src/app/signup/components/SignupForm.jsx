"use client"
import { registerUser } from "@/app/actions/auth/registerUser";
import SocialLogin from "@/app/login/components/SocialLogin";
import React, { useState } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from "next/navigation";
import Link from "next/link";



const SignupForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
    role: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //const { name, email, password, confirmPassword, imageUrl } = form;
    //registerUser(form)
    // const data = JSON.parse(JSON.stringify(form))
    // console.log(data)
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Passwords do not match!',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-toast-zindex'
        }
      });
      return;
    }
    try {
      const result = await registerUser(form);
      if (result?.insertedId) {
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
        }).then(() => {
          router.push("/login"); // redirect manually
        });
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          imageUrl: "",
          role:""
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Signup failed! Email may already exist.',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          customClass: {
            popup: 'swal-toast-zindex'
          }
        });
      }
    } catch (error) {
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="group">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
            />
          </div>
        </div>
        
        <div className="group">
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
            Professional Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <select
              id="userType"
              name="userType"
              value={form.userType}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Select your role</option>
              <option value="candidate">👤 I'm a Candidate - Looking for job opportunities</option>
              <option value="company">🏢 I'm a Company - Looking to hire talent</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="group">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="group">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
            />
          </div>
        </div>
        
        <div className="group">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
            />
          </div>
        </div>
      </div>
      
      <div className="group">
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
          Profile Picture URL <span className="text-gray-400 font-normal text-xs">(Optional)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            id="imageUrl"
            type="url"
            name="imageUrl"
            placeholder="https://example.com/your-photo.jpg"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
          />
        </div>
      </div>
      
      <div className="flex items-start space-x-2">
        <input type="checkbox" id="terms" className="mt-1 w-3.5 h-3.5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-1" required />
        <label htmlFor="terms" className="text-xs text-gray-600">
          I agree to the <a href="/terms" className="text-purple-600 hover:text-purple-800 font-medium">Terms of Service</a> and <a href="/privacy" className="text-purple-600 hover:text-purple-800 font-medium">Privacy Policy</a>
        </label>
      </div>
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Create Account
        </span>
      </button>
      
      <SocialLogin />
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;