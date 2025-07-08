import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  cardTitle = 'Card Title',
  cardText = 'Card Text',
  icon,
  className = '',
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        bg-[#1A1A1A] shadow-lg
        w-full max-w-md
        p-5 rounded-xl
        border border-[#262626]
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:border-[#E50000]' : ''}
        ${className}
      `}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="p-2 rounded-lg bg-[#262626] text-[#E50000]">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className='text-[#A0A0A0] Manrope-Medium text-sm uppercase tracking-wider'>
            {cardTitle}
          </h3>
          <h2 className='text-white Manrope-Bold text-2xl mt-1'>
            {cardText}
          </h2>
        </div>
      </div>
    </motion.div>
  );
};

Card.propTypes = {
  cardTitle: PropTypes.string,
  cardText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  icon: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func
};

Card.defaultProps = {
  cardTitle: 'Card Title',
  cardText: 'Card Text',
  icon: null,
  className: '',
  onClick: null
};

export default Card;