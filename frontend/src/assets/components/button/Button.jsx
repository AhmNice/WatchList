import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types'

const Button = ({
  bg = 'bg-[#E50000]',
  hoverBg = 'bg-[#FF1919]',
  disabled = false,
  type = 'button',
  onClick,
  text,
  icon,
  className = '',
  isLoading = false,
  textClassName = '',
  iconPosition = 'left', // 'left' or 'right'
}) => {
  // Handle disabled state styles
  const disabledStyles = disabled
    ? 'opacity-60 cursor-not-allowed'
    : '';

  // Handle loading state
  const loadingStyles = isLoading
    ? 'cursor-wait'
    : '';

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative
        rounded-md
        flex
        cursor-pointer
        items-center
        justify-center
        gap-2
        py-2
        px-4
        text-center
        transition-all
        duration-200
        ${bg}
        ${!disabled && !isLoading ? `hover:${hoverBg}` : ''}
        ${disabledStyles}
        ${loadingStyles}
        ${className}
      `}
      aria-busy={isLoading}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      )}

      {/* Content (hidden when loading) */}
      <div className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {iconPosition === 'left' && icon}
        <span className={`text-white Manrope-SemiBold ${textClassName}`}>
          {text}
        </span>
        {iconPosition === 'right' && icon}
      </div>
    </motion.button>
  );
};

Button.propTypes = {
  bg: PropTypes.string,
  hoverBg: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
  icon: PropTypes.node,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  textClassName: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

export default Button;