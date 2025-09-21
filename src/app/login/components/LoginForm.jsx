"use client"
import React, { useState } from "react";
import SocialLogin from "./SocialLogin";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCredentialLogin = (e) => {
        //e.preventDefault();
        // Handle credential login logic here
    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
    };

    const handleGithubLogin = () => {
        // Handle Github login logic here
    };

    return (

        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                />
            </div>
            <button
                type="submit"
                name="action"
                value="credential"
                className="w-full bg-primary text-white py-2 rounded hover:bg-black transition font-semibold"
            >
                Login
            </button>            
            <SocialLogin/>            
        </form>
    );
};

export default LoginForm;