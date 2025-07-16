import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const SecuritySettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastChanged, setLastChanged] = useState('2 minutes');
  useEffect(()=>{
    setLastChanged(user.passwordLastChanged)
  },[])
  const requestPasswordChange = async () => {
    const URL = import.meta.env.VITE_AUTH_SERVER_URL;
    if (!URL) {
      toast.error('Server configuration error');
      return;
    }

    const payload = {
      userId: user._id,
      email: user.email
    };

    try {
      setIsLoading(true);
      const { data } = await axios.post(`${URL}/account/password-reset-request`, payload);
      toast.success(data?.message || 'Password reset email sent successfully');
      setShowConfirmation(false);

    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Failed to request password change';
      toast.error(errorMessage);
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for the modal
  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { opacity: 0, y: 20 }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const ConfirmationModal = () => (
    <AnimatePresence>
      {showConfirmation && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6 max-w-md w-full"
            variants={modalVariants}
          >
            <h3 className="text-xl font-bold mb-4">Confirm Password Change</h3>
            <p className="text-gray-300 mb-6">
              We'll send a password reset link to: <span className="font-medium">{user?.email}</span>
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-[#333] rounded-md text-sm hover:bg-[#333] transition-colors"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={requestPasswordChange}
                disabled={isLoading}
                className="px-4 py-2 bg-[#E50000] rounded-md text-sm hover:bg-[#FF1919] transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Confirm'
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
      <div className="space-y-4">
        {/* Password Section */}
        <div className="p-4 bg-[#262626] rounded-lg border border-[#333]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-gray-400">Last changed {lastChanged}</p>
            </div>
            <motion.button
              onClick={() => setShowConfirmation(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-[#E50000] hover:bg-[#FF1919] rounded-md text-sm min-w-[160px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Change Password'
              )}
            </motion.button>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="p-4 bg-[#262626] rounded-lg border border-[#333]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">Add extra security to your account</p>
            </div>
            <motion.button
              className="px-4 py-2 border border-[#333] rounded-md text-sm hover:bg-[#333] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Enable 2FA
            </motion.button>
          </div>
        </div>
      </div>

      <ConfirmationModal />
    </div>
  );
};

export default SecuritySettings;