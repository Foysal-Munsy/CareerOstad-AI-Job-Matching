"use client"
import React, { useState } from "react";
import SocialLogin from "./SocialLogin";
import { signIn } from "next-auth/react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleCredentialLogin = async (e) => {
        e.preventDefault();        
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
                    router.push(res.url || callbackUrl); // redirect manually
                });
            } else {
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
        <form onSubmit={handleCredentialLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    name='email'
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
                    name="password"
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
                className="w-full bg-primary text-white py-2 rounded hover:bg-black transition font-semibold cursor-pointer"
            >
                Login
            </button>            
            <SocialLogin/>            
        </form>
    );
};

export default LoginForm;