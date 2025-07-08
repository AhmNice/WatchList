import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Coffee } from 'lucide-react';

const WelcomeCard = ({ userName = 'User', timeOfDay = 'morning' }) => {
  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get appropriate icon
  const greetingIcon = {
    morning: <Sun className="text-yellow-400" size={24} />,
    afternoon: <Sun className="text-orange-400" size={24} />,
    evening: <Coffee className="text-indigo-400" size={24} />
  }[timeOfDay] || <Sun size={24} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r col-span-3 from-[#1A1A1A] to-[#2E2E2E] rounded-xl p-6 shadow-lg border border-[#3E3E3E]"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-[#3E3E3E]">
          {greetingIcon}
        </div>
        <div>
          <h2 className="text-xl text-[#A0A0A0] Manrope-Medium">
            {getGreeting()}, <span className="text-white">{userName}</span>
          </h2>
          <p className="text-[#E4E4E7] Manrope-Regular mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;