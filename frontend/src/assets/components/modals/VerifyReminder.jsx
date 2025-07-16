import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { X, MailCheck } from 'lucide-react';

const VerifyReminder = ({
  onClose = () => {},
  onAccept = () => {},
  isLoading = false,
  isAcceptDisabled = false,
}) => {
  const { user, authenticated } = useAuthStore();

  useEffect(() => {
    if (user?.isVerified) {
      onClose();
    }
  }, [user?.isVerified, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#141414]/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-[#1A1A1A] rounded-lg border border-[#262626] w-full max-w-md shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#E50000]/20">
              <MailCheck className="w-5 h-5 text-[#E50000]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Verify Your Account</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-300 mb-6">
            Please verify your email address ({user?.email}) to unlock all features.
            Check your inbox for a verification link or click below to resend.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onAccept}
              disabled={isLoading || isAcceptDisabled}
              className={`flex-1 py-2 px-4 rounded-md text-white text-center font-medium transition-colors ${
                isLoading || isAcceptDisabled
                  ? 'bg-[#E50000]/50 cursor-not-allowed'
                  : 'bg-[#E50000] hover:bg-[#FF1919]'
              }`}
            >
              {isLoading ? (
                <span className="flex text-white items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Resend Verification Email'
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-md font-medium bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VerifyReminder;