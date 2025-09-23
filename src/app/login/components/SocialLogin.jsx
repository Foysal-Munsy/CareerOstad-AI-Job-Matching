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
        const { value: role } = await Swal.fire({
            title: 'Select Your Role',
            input: 'radio',
            inputOptions: {
                candidate: 'Candidate',
                company: 'Company'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to choose a role!';
                }
            },
            confirmButtonText: 'Continue',
            showCancelButton: true,
            customClass: {
                popup: 'swal-toast-zindex'
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
        <div>
            <div className="my-6 flex items-center">
                <hr className="flex-grow border-t" />
                <span className="mx-2 text-gray-200">OR</span>
                <hr className="flex-grow border-t" />
            </div>
            <div className="flex flex-col gap-3">
                <div
                    onClick={() => handleSocialLogin("google")}
                    className="cursor-pointer flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition font-semibold"
                >
                    <FaGoogle /> Login with Google
                </div>
                <div
                    onClick={() => handleSocialLogin("github")}
                    className="cursor-pointer flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded hover:bg-black transition font-semibold"
                >
                    <FaGithub /> Login with Github
                </div>
            </div>
        </div>
    );
};

export default SocialLogin;