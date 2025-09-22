import React from 'react';
import { FaGoogle, FaGithub } from "react-icons/fa";


const SocialLogin = () => {
    return (
        <div>
            <div className="my-6 flex items-center">
                <hr className="flex-grow border-t" />
                <span className="mx-2 text-gray-200">OR</span>
                <hr className="flex-grow border-t" />
            </div>
            <div className="flex flex-col gap-3">
                <button
                    //type="submit"
                    name="action"
                    value="google"
                    //onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition font-semibold"
                >
                    <FaGoogle /> Login with Google
                </button>
                <button
                    //type="submit"
                    name="action"
                    value="github"
                    //onClick={handleGithubLogin}
                    className="flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded hover:bg-black transition font-semibold"
                >
                    <FaGithub /> Login with Github
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;