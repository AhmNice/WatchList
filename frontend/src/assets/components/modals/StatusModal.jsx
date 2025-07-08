import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import {
  Info,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";
import Button from "../button/Button";

const StatusModal = ({
  type = 'info',
  onClose = () => {},
  onAccept = () => {},
  isLoading = false,
  isAcceptDisabled = false,
  cancelText = 'No, cancel',
  acceptText = 'Yes, continue',
  message = 'Info message',
  title = 'Title',
  showCancelButton = true,
  showAcceptButton = true,
}) => {
  const modalRef = useRef();
  const acceptButtonRef = useRef();

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    // Focus the accept button when modal opens
    if (!isLoading && acceptButtonRef.current) {
      acceptButtonRef.current.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isLoading]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const getIcon = () => {
    const iconProps = {
      size: 40,
      className: "flex-shrink-0",
      "aria-hidden": true
    };

    switch (type) {
      case "warning":
        return <AlertTriangle {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
      case "success":
        return <CheckCircle2 {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case "error":
        return <XCircle {...iconProps} className={`${iconProps.className} text-red-500`} />;
      case "alert":
        return <AlertCircle {...iconProps} className={`${iconProps.className} text-orange-500`} />;
      case "info":
      default:
        return <Info {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#141414]/80 backdrop-blur-sm z-80 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-[#1A1A1A] min-h-46 items-center rounded-lg border border-[#262626] w-full max-w-md flex flex-col sm:flex-row shadow-xl overflow-hidden"
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-[#E50000]" size={34} aria-label="Loading" />
          </div>
        ) : (
          <>
            <div className='p-4' aria-hidden="true">
              {getIcon()}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-6 gap-4">
              <h2 id="modal-title" className="text-white text-xl Manrope-SemiBold">
                {title}
              </h2>
              <p className="text-[#B3B3B3] Manrope-Regular">
                {message}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                {showCancelButton && (
                  <Button
                    text={cancelText}
                    bg=""
                    onClick={onClose}
                    className="w-full sm:w-auto border border-[#262626]"
                    hoverBg="[#262626]"
                    textClassName="text-[#B3B3B3] Manrope-Medium"
                    disabled={isLoading}
                  />
                )}
                {showAcceptButton && (
                  <Button
                    ref={acceptButtonRef}
                    text={acceptText}
                    onClick={onAccept}
                    className="w-full sm:w-auto"
                    textClassName="text-white Manrope-Medium"
                    disabled={isLoading || isAcceptDisabled}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

StatusModal.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'success', 'error', 'alert']),
  onClose: PropTypes.func,
  onAccept: PropTypes.func,
  isLoading: PropTypes.bool,
  isAcceptDisabled: PropTypes.bool,
  message: PropTypes.string,
  acceptText: PropTypes.string,
  cancelText: PropTypes.string,
  title: PropTypes.string,
  showCancelButton: PropTypes.bool,
  showAcceptButton: PropTypes.bool,
};

export default StatusModal;