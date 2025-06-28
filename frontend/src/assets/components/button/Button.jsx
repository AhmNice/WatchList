import React from 'react'
import { motion } from 'framer-motion'
const Button = ({bg,hoverBg, type, onclick, text, icon}) => {
  return (
    <motion.button
    whileHover={{scale:1.10}}
    whileTap={{scale: 0.98}}
    type={type}
    onClick={onclick}
    className={`cursor-pointer rounded-md flex justify-between text-md hover:${hoverBg} items-center gap-2 py-2 px-4 text-center ${bg}`}>
      {icon}
      <p className='text-white Manrope-SemiBold '>
        {text}
      </p>
    </motion.button>
  )
}

export default Button
