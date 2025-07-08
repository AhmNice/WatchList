import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-[#141414] p-4 text-center"
    >
      {/* 404 Text */}
      <motion.p
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="Manrope-Bold text-[120px] md:text-[180px] font-bold bg-gradient-to-r from-[#E50000] to-[#FF1919] bg-clip-text text-transparent"
      >
        404
      </motion.p>

      {/* Message */}
      <motion.h1
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className="Manrope-Bold text-2xl md:text-4xl text-white mb-6"
      >
        Oops! Page not found
      </motion.h1>

      <motion.p
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 Manrope-Regular text-lg mb-8 max-w-md"
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-lg bg-[#E50000] hover:bg-[#FF1919] px-6 py-3 text-white Manrope-SemiBold transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        Go back
      </motion.button>

      {/* Optional: Home Link */}
      <motion.button
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/')}
        className="mt-4 text-gray-400 hover:text-white Manrope-Medium transition-colors duration-200"
      >
        Or return to homepage
      </motion.button>
    </motion.div>
  );
};

export default NotFound;