import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { X } from "lucide-react"; // For close icon

const ErrorCard = ({
  message = "An error occurred",
  onDismiss,
  dismissible = false,
  className = "",
  duration = 5000
}) => {
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    if (duration && dismissible) {
      const timer = setTimeout(() => {
        setShow(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, dismissible, onDismiss]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3, type: "spring" }}
        className={`rounded-md flex flex-row-reverse items-center justify-between bg-red-100 border border-red-200 w-full max-w-md p-4 text-red-800 Manrope-SemiBold relative ${className}`}
      >
        {dismissible && (
          <button
            onClick={() => {
              setShow(false);
              onDismiss?.();
            }}
            className="  right-2 text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        )}
        <div className="pr-6">{message}</div>
      </motion.div>
    </AnimatePresence>
  );
};

ErrorCard.propTypes = {
  message: PropTypes.string,
  onDismiss: PropTypes.func,
  dismissible: PropTypes.bool,
  className: PropTypes.string,
  duration: PropTypes.number, // Auto-dismiss after milliseconds
};

export default ErrorCard;