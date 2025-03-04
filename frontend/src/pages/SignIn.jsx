import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { checkValidSignInFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";
import { motion } from "framer-motion";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [load, setLoad] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formRef = useRef(null);

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem("auth"));
        if (auth) navigate("/");
    }, []);

    const logInUser = (e) => {
        toast.loading("Signing In...");
        e.target.disabled = true;
        setLoad(true);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((json) => {
                setLoad(false);
                e.target.disabled = false;
                toast.dismiss();

                if (json.token) {
                    localStorage.setItem("token", json.token);
                    localStorage.setItem("auth", JSON.stringify(json.data));
                    dispatch(addAuth(json.data));
                    navigate("/");
                    toast.success(json?.message);
                } else {
                    toast.error(json?.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoad(false);
                toast.dismiss();
                toast.error("Error: " + error.code);
                e.target.disabled = false;
            });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Required: All Fields");
            return;
        }
        const validError = checkValidSignInFrom(email, password);
        if (validError) {
            toast.error(validError);
            return;
        }
        logInUser(e);
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen text-gray-900 py-10 overflow-hidden"
            style={{ 
                backgroundImage: 'url("/backsign.webp")',
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            {/* Sign-in Form */}
            <motion.div
                ref={formRef}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "backOut" }}
                className="p-8 w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] max-w-lg bg-white bg-opacity-90 rounded-3xl shadow-xl backdrop-blur-md relative z-10 border border-pink-300"
            >
                <h2 className="text-4xl font-extrabold text-center mb-6 text-pink-600 drop-shadow-md">💖 Welcome Back! 💖</h2>
                <form className="w-full flex flex-col">
                    {/* Email Input */}
                    <label className="text-lg font-semibold mb-1">Email Address</label>
                    <input
                        className="w-full border border-pink-400 my-2 py-3 px-5 rounded-full bg-pink-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-md transition-all"
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password Input */}
                    <label className="text-lg font-semibold mb-1">Password</label>
                    <div className="relative">
                        <input
                            className="w-full border border-pink-400 my-2 py-3 px-5 rounded-full bg-pink-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-md transition-all"
                            type={isShow ? "text" : "password"}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setIsShow(!isShow)}
                            className="absolute right-4 top-3 text-pink-500 hover:text-pink-700 transition-all"
                        >
                            {isShow ? <PiEyeClosedLight size={26} /> : <PiEye size={26} />}
                        </button>
                    </div>

                    {/* Sign In Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full font-semibold py-3 mt-4 text-lg bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex justify-center items-center gap-2"
                    >
                        {load ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    {/* Sign Up Link */}
                    <div className="flex justify-between mt-4 text-sm">
                        <Link to="/signup" className="text-pink-600 hover:text-pink-800 transition-all">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default SignIn;
