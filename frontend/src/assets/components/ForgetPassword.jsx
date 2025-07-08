import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {  Loader2, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const { loading, errorMsg, forgetPassword, success } =useAuthStore()

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted with email:', email);
      setErrors({});
      try {
          await forgetPassword(email);
          if (success) {
            toast.success('Password reset link sent to your email');
          } else {
            toast.error(errorMsg || 'Failed to send reset link');
          }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-[#1A1A1A] shadow-lg w-full max-w-md overflow-hidden pt-8 pb-0 rounded-xl border border-[#262626]"
    >
      <div className="w-full flex flex-col items-center justify-center mb-6">
        <motion.img
          src="Vector.png"
          width="50px"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          alt="Logo"
        />
        <h2 className='Manrope-SemiBold text-2xl text-[#F1F1F3] ml-4'>
          Forget Password</h2>
          <p className='Manrope-Regular text-sm text-[#A0A0A0] mt-2'>
            Enter your email to reset your password
            </p>
      </div>
      <form onSubmit={handleSubmit} className="pl-8 pr-8 pb-8">
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
                name="email"
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              disabled={!email||loading }
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full cursor-pointer disabled:cursor-not-allowed Manrope-SemiBold bg-[#E50000] disabled:bg-[#E50000]/50 disabled:text-white/10 text-white py-3 px-4 rounded-lg hover:bg-[#FF1919] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E50000] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
            >
              {loading ? <span className='flex items-center justify-center gap-2'>
                <Loader2 className='animate-spin' size={20} />
                Sending...
              </span> :'Reset Password'}
            </motion.button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgetPassword;