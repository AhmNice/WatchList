import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react'; // Fixed icon imports

const ForgePasswordReset = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Proceed with password reset logic
      console.log('Password reset submitted:', formData);
      // Add your API call or state management here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-[#1A1A1A] shadow-lg w-full max-w-md overflow-hidden pt-8 pb-8 rounded-xl border border-[#262626]" // Added pb-8 for bottom padding
    >
      <div className="w-full flex flex-col items-center justify-center mb-6 px-8">
        <motion.img
          src="/Vector.png"
          width="50px"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          alt="Logo"
        />
        <h2 className='Manrope-SemiBold text-2xl text-[#F1F1F3] mt-4'>
          Password Reset
        </h2>
        <p className='Manrope-Regular text-sm text-[#A0A0A0] mt-2 text-center'>
          Enter new password to reset your account password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label
              htmlFor="password"
              className="block Manrope-SemiBold text-sm font-medium text-[#F1F1F3] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-[#A0A0A0] h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`Manrope-Regular w-full bg-[#262626] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all ${
                  errors.password ? "border border-red-500" : ""
                }`}
                placeholder="Enter new password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label
              htmlFor="confirmPassword"
              className="block Manrope-SemiBold text-sm font-medium text-[#F1F1F3] mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-[#A0A0A0] h-5 w-5" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`Manrope-Regular w-full bg-[#262626] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all ${
                  errors.confirmPassword ? "border border-red-500" : ""
                }`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-2" // Added some top padding
          >
            <button
              type="submit"
              className="w-full Manrope-SemiBold bg-[#E50000] text-white py-3 px-4 rounded-lg hover:bg-[#FF1919] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E50000] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
            >
              Reset Password
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgePasswordReset;