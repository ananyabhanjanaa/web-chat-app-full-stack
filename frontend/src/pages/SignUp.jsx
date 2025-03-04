import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";
import gsap from "gsap";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            formRef.current,
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
        );
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) {
            toast.error("All fields are required");
            return;
        }

        toast.loading("Signing up...");
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firstName, lastName, email, password }),
                }
            );
            const json = await response.json();
            toast.dismiss();
            if (json.token) {
                toast.success("Signup successful!");
                navigate("/signin");
            } else {
                toast.error(json.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-[url('./assets/signup.webp')] text-gray-800 py-10 relative overflow-hidden">
            {/* Background image without overlay colors */}
            <div className="absolute w-full h-full bg-[url('./assets/signup.webp')] bg-cover bg-center"></div>

            <div
                ref={formRef}
                className="p-6 w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] max-w-lg border border-gray-300 bg-white bg-opacity-90 rounded-3xl shadow-2xl backdrop-blur-lg relative z-10"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Create an Account</h2>
                <form className="flex flex-col" onSubmit={handleSignup}>
                    <input
                        className="my-2 py-3 px-5 rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        className="my-2 py-3 px-5 rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        className="my-2 py-3 px-5 rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative">
                        <input
                            className="my-2 py-3 px-5 w-full rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            type={isShow ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            onClick={() => setIsShow(!isShow)}
                            className="cursor-pointer absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                        >
                            {isShow ? <PiEyeClosedLight size={22} /> : <PiEye size={22} />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full font-semibold py-3 mt-4 text-lg bg-gray-700 hover:bg-gray-800 text-white rounded-full transition-all shadow-md"
                    >
                        Sign Up
                    </button>

                    <div className="flex justify-between mt-4 text-sm">
                        <Link to="/signin" className="text-gray-600 hover:text-gray-800 transition-all">
                            Already have an account? Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
