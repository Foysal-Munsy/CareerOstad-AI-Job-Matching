"use client"
import { registerUser } from "@/app/actions/auth/registerUser";
import SocialLogin from "@/app/login/components/SocialLogin";
import React, { useState } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from "next/navigation";



const SignupForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, imageUrl } = form;
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
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        background: "var(--color-secondary, #f5f7fa)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
      }}
    >
      <h2 style={{ textAlign: "center", color: "var(--color-primary, #2b6cb0)" }}>
        Sign Up
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label htmlFor="name" style={{ fontWeight: 500 }}>Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label htmlFor="password" style={{ fontWeight: 500 }}>Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label htmlFor="confirmPassword" style={{ fontWeight: 500 }}>Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label htmlFor="imageUrl" style={{ fontWeight: 500 }}>Image URL</label>
        <input
          id="imageUrl"
          type="url"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          style={{
            padding: "0.7rem",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "0.8rem",
          borderRadius: "6px",
          background: "var(--color-primary, #2b6cb0)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "1rem",
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        Sign Up
      </button>
      <SocialLogin />
    </form>
  );
};

export default SignupForm;