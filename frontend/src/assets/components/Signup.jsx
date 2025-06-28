import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Phone,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    phoneNumber: "", // Added missing field
    password: "",
  });

  const [errors, setErrors] = useState({
    email: null,
    userName: null,
    phoneNumber: null,
    password: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev)=>({
      ...prev,
      [id]:null
    }))
  };
  const validateForm = () => {
    const newErrors = {
      email: null,
      userName: null,
      phoneNumber: null,
      password: null,
    };
    let isValid = true
    const regex = /^(?=(?:[^A-Za-z]*[A-Za-z]){4,})(?=(?:[^0-9]*[0-9]){2,})(?=(?:[^!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]){1,}).{7,}$/;
    if(!formData.email){
      newErrors.email ='Email is required'
      isValid=false
    }else if( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
      newErrors.email='Invalid email format'
      isValid=false
    }
    if(!formData.password){
      newErrors.password='Password is Required'
      isValid=false
    }else if(!regex.test(formData.password)){
      newErrors.password='password should contain at least 4 letters, 2 number and a symbol'
      isValid=false
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    }if (!formData.userName) {
      newErrors.userName = "Username is required";
      isValid = false;
    }
    setErrors(newErrors)
    return isValid
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateForm()){
      return;
    }

  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-[#1A1A1A] shadow-lg w-full max-w-md overflow-hidden pt-5 pb-0 rounded-xl border border-[#262626]"
    >
      <div className="w-full flex items-center justify-center mb-6">
        <motion.img
          src="Vector.png"
          width="35px"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </div>
      <div className="text-center mb-8">
        <h2 className="text-sm font-bold Manrope-Bold text-[#F1F1F3] ">
          Hey, Welcome Back
        </h2>
        <p className="text-[#A0A0A0] text-sm Manrope-Regular">
          Sign in with your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pl-8 pr-8">
        <div className="space-y-2">
          {/* User Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label
              htmlFor="userName"
              className="Manrope-SemiBold text-sm block font-medium text-[#F1F1F3] mb-2"
            >
              User Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-[#A0A0A0] h-5 w-5" />
              </div>
              <input
                type="text"
                id="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`Manrope-Regular w-full bg-[#262626] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all ${
                  errors.userName ? "border border-red-500" : ""
                }`}
                placeholder="Wazobia"
              />
            </div>
            {errors.userName && (
              <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
            )}
          </motion.div>

          {/* Phone Number Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label
              htmlFor="phoneNumber"
              className="Manrope-SemiBold block text-sm font-medium text-[#F1F1F3] mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="text-[#A0A0A0] h-5 w-5" />
              </div>
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`Manrope-Regular w-full bg-[#262626] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all ${
                  errors.phoneNumber ? "border border-red-500" : ""
                }`}
                placeholder="080 000 568 14"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="email"
              className="block Manrope-SemiBold text-sm font-medium text-[#F1F1F3] mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-[#A0A0A0] h-5 w-5" />{" "}
                {/* Changed from User to Mail icon */}
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`Manrope-Regular w-full bg-[#262626] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all ${
                  errors.email ? "border border-red-500" : ""
                }`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label
              htmlFor="password"
              className="block Manrope-SemiBold text-sm font-medium text-[#F1F1F3] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-2 left-0 pl-3 flex items-center top-0 pointer-events-none">
                <Lock className="text-[#A0A0A0] h-5 w-5" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`Manrope-Regular mb-2 w-full bg-[#262626] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all ${
                  errors.password ? "border border-red-500" : ""
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 -top-2 pr-3 flex items-center"
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
              disabled={loading}
              className={`Manrope-Regular cursor-pointer w-full flex items-center justify-center py-2 px-4 rounded-lg bg-[#E50000] text-white font-medium hover:bg-[#FF1919] transition-colors mt-2 ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex w-full gap-4 justify-center items-center">
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
                </span>
              ) : (
                <>
                  Sign Up <ArrowRight className="ml-2 h-5 w-5" />
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
        Already have an account?{" "}
        <a href="/login" className="text-[#E50000] hover:underline font-medium">
          Login
        </a>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
