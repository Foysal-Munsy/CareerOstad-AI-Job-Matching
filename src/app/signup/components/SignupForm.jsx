"use client"
import { registerUser } from "@/app/actions/auth/registerUser";
import SocialLogin from "@/app/login/components/SocialLogin";
import React, { useState } from "react";

const SignupForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const {name, email, password, confirmPassword, imageUrl} = form;
    registerUser(form)
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // // Handle signup logic here
    // const form = e.target;
    // const name = form.name.value;
    // const email = form.email.value;
    // const password = form.password.value;
    // const password = form.password.value;
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
      <SocialLogin/>
    </form>
  );
};

export default SignupForm;