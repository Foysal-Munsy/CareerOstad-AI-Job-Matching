"use client"
import { registerUser } from "@/app/actions/auth/registerUser";
import SocialLogin from "@/app/login/components/SocialLogin";
import React, { useState, useRef } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineLockClosed } from "react-icons/hi";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineBriefcase } from "react-icons/hi";
import { HiOutlineUpload } from "react-icons/hi";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { HiOutlineDocumentText } from "react-icons/hi";

const SignupForm = () => {
  const imgbbApiKey = "5d5648f9ca8a568a4a4f1c8ef50bc48e";
  const imageInputRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
    role: ""
  });

  // Password validation state
  const [passwordError, setPasswordError] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [isTypingConfirm, setIsTypingConfirm] = useState(false);

  // Password validation function
  const validatePassword = (value) => {
    if (value.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Password must contain at least one special character.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setIsTypingPassword(true);
      const error = validatePassword(value);
      setPasswordError(error);
      // Also update confirm password message if confirmPassword is not empty
      if (form.confirmPassword) {
        setIsTypingConfirm(true);
        setConfirmMsg(
          value === form.confirmPassword
            ? "Passwords match!"
            : "Passwords do not match."
        );
      }
    }
    if (name === "confirmPassword") {
      setIsTypingConfirm(true);
      setConfirmMsg(
        value === form.password
          ? "Passwords match!"
          : "Passwords do not match."
      );
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, imageUrl: data.data.url }));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Image uploaded!',
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: 'swal-toast-zindex' }
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Image upload failed!',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: 'swal-toast-zindex' }
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        handleImageUpload(file);
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Please fix password errors!',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-toast-zindex'
        }
      });
      return;
    }
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
          router.push("/login");
        });
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          imageUrl: "",
          role: ""
        });
        setIsTypingPassword(false);
        setIsTypingConfirm(false);
        setPasswordError("");
        setConfirmMsg("");
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
              <HiOutlineUser className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" />
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
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
            Professional Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-1 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineBriefcase className="h-4 w-4 text-purple-400 transition-colors group-focus-within:text-purple-600" />
            </div>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-purple-50/50 hover:bg-purple-100 focus:bg-white cursor-pointer"
              style={{ appearance: "none" }}
            >
              <option value="" disabled className="my-2 text-gray-400 cursor-pointer bg-white">
                Select Your Role
              </option>
              <option
                value="candidate"
                className="cursor-pointer bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100"
                style={{ backgroundColor: "#f3e8ff", color: "#7c3aed", margin: '40px' }}
              >
                Candidate
              </option>
              <option
                value="company"
                className="cursor-pointer bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100"
                style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
              >
                Company
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <HiOutlineArrowNarrowRight className="h-4 w-4 text-purple-400" />
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
            <HiOutlineMail className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" />
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
              <HiOutlineLockClosed className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-purple-600 focus:outline-none"
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 cursor-pointer" />
              ) : (
                <FaEye className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          </div>
          {/* Password validation message */}
          {isTypingPassword && passwordError && (
            <div className="flex items-center mt-1 text-xs text-red-600">
              <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
              {passwordError}
            </div>
          )}
        </div>

        <div className="group">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineLockClosed className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-purple-600 focus:outline-none"
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="h-5 w-5 cursor-pointer" />
              ) : (
                <FaEye className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          </div>
          {/* Confirm password message */}
          {isTypingConfirm && (
            <div className={`flex items-center mt-1 text-xs ${confirmMsg === "Passwords match!" ? "text-green-600" : "text-red-600"}`}>
              {confirmMsg === "Passwords match!" ? (
                <HiOutlineCheckCircle className="mr-1 h-4 w-4" />
              ) : (
                <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
              )}
              {confirmMsg}
            </div>
          )}
        </div>
      </div>

      <div className="group">
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">
          Profile Picture <span className="text-gray-400 font-normal text-xs">(Optional)</span>
        </label>
        <div
          className="relative border-2 border-dashed border-purple-200 rounded-lg p-2 bg-purple-50 hover:bg-purple-100 transition"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onPaste={handlePaste}
        >
          <div className="flex gap-2 items-center">
            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              placeholder="Paste image URL or upload below"
              value={form.imageUrl}
              onChange={handleChange}
              className="flex-1 pl-3 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current.click()}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-purple-700 transition cursor-pointer flex items-center gap-1"
            >
              <HiOutlineUpload className="h-4 w-4" />
              Upload
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Drag & drop, paste, or upload an image.
          </p>
          {form.imageUrl && (
            <div className="mt-2">
              <img src={form.imageUrl} alt="Preview" className="h-16 rounded shadow border" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <input type="checkbox" id="terms" className="cursor-pointer mt-1 w-3.5 h-3.5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-1" required />
        <label htmlFor="terms" className="text-xs text-gray-600">
          I agree to the <a href="/terms" className="text-purple-600 hover:text-purple-800 font-medium">Terms of Service</a> and <a href="/privacy" className="text-purple-600 hover:text-purple-800 font-medium">Privacy Policy</a>
        </label>
      </div>

      <button
        type="submit"
        className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          <HiOutlineDocumentText className="w-4 h-4 mr-2" />
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