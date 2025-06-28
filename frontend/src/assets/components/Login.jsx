import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });

  const { login, loading, success, errorMsg, authenticated } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      email: null,
      password: null,
    };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (success && authenticated) {
      toast.success("Welcome back, redirecting");
      navigate("/index");
    }
  }, [success, authenticated, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-[#1A1A1A] shadow-lg w-full max-w-md overflow-hidden pt-8 pb-0  rounded-xl border border-[#262626]"
    >
      <div className="w-full flex items-center justify-center mb-6">
        <motion.img
          src="Vector.png"
          width="50px"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold Manrope-Bold text-[#F1F1F3] mb-2">
          Hey, Welcome Back
        </h2>
        <p className="text-[#A0A0A0] Manrope-Regular">
          Sign in with your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pl-8 pr-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label
              htmlFor="email"
              className="block Manrope-SemiBold text-sm font-medium text-[#F1F1F3] mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-[#A0A0A0] h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`Manrope-Regular w-full bg-[#262626] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all ${
                  errors.email ? "border border-red-500" : ""
                }`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </motion.div>

          {/* Password Input - Add error display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="password"
              className="Manrope-SemiBold block text-sm font-medium text-[#F1F1F3] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-[#A0A0A0] h-5 w-5" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`Manrope-Regular w-full bg-[#262626] text-white pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all ${
                  errors.password ? "border border-red-500" : ""
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-[#A0A0A0] hover:text-white h-5 w-5" />
                ) : (
                  <Eye className="text-[#A0A0A0] hover:text-white h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
            <div className="flex justify-end mt-2">
              <a
                href="#"
                className="Manrope-Regular text-sm text-[#A0A0A0] hover:text-[#E50000] transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className={`Manrope-Regular cursor-pointer w-full flex items-center justify-center py-3 px-4 rounded-lg bg-[#E50000] text-white font-medium hover:bg-[#FF1919] transition-colors ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="w-full flex gap-4 justify-center items-center">
                  <Loader2 className="animate-spin" size={24} />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="Manrope-Regular p-3 bg-[#262626] mt-6 text-center text-sm text-[#A0A0A0]"
      >
        Don't have an account?{" "}
        <a href="/signup" className="text-[#E50000] hover:underline font-medium">
          Sign up
        </a>
      </motion.div>
    </motion.div>
  );
};

export default Login;
