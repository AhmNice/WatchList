import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ForgePasswordReset = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const { changePasswordInAccount,changePasswordOutside, user, success, errorMsg, loading} = useAuthStore()

  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (success) {
      navigate('/dashboard');
    }
  }, [success, navigate]);

  useEffect(() => {
    getLocation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return "mobile";
    if (/Tablet|iPad/i.test(ua)) return "tablet";
    return "desktop";
  };

  const getLocation = async () => {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      const { city, region, country_name } = response.data;
      setLocation(`${city}, ${region}, ${country_name}`);
    } catch (err) {
      console.error('Failed to fetch location');
      setLocation('Unknown location');
    }
  };

  const submit = async () => {
    const payload = {
      userId: user?._id,
      token: token,
      deviceType: getDeviceType(),
      location: location,
      password: formData.password
    };
    setIsSubmitting(true)
    try {
      if(user?._id){
        await changePasswordInAccount(payload)
      }else{
        changePasswordOutside(payload)
      }
      toast.success(`password reset successfully, redirecting...`);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error?.response?.data?.message || 'Failed to reset password');
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
      submit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-[#1A1A1A] shadow-lg w-full max-w-md overflow-hidden pt-8 pb-8 rounded-xl border border-[#262626]"
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
            className="pt-2"
          >
            <button
              type="submit"
              disabled={  isLoading }
              className="w-full flex cursor-pointer items-center justify-center disabled:cursor-not-allowed Manrope-SemiBold disabled:bg-[#E50000]/50 disabled:text-white/50 bg-[#E50000] text-white py-3 px-4 rounded-lg hover:bg-[#FF1919] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E50000] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
            >
              {isLoading ? (<>
              <Loader2 size={14} className='text-white animate-spin'/>
                <span>'Resetting Password...'</span>
              </>) : 'Reset Password'}
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgePasswordReset;