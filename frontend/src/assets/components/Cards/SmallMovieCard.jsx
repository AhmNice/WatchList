import React from 'react'
import { motion } from 'framer-motion'
import { Play, Heart, MoreVertical, X } from 'lucide-react'

const SmallMovieCard = ({ movie, onClick, onDelete }) => {
  // console.log(movie)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group bg-[#1A1A1A] rounded-lg border border-[#262626] overflow-hidden hover:border-[#E50000] transition-all duration-300 cursor-pointer shadow-lg"
    >
      {/* Image Container with Overlay */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/default-movie.jpg'
            e.target.className = 'w-full h-full object-contain bg-[#262626] p-4'
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Quick Actions */}

      </div>

      {/* Text Content */}
      <div className="p-3">
        <h3 className="text-white Manrope-SemiBold text-sm line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex justify-between items-center mt-1">
          {/* <p className="text-gray-400 Manrope-Regular text-xs line-clamp-1">
            {movie.releaseYear || 'Unknown year'}
          </p> */}
          {movie.rating && (
            <span className="bg-[#262626] text-white text-xs px-2 py-1 rounded">
              {movie.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Top Right Action */}
      <button
      onClick={(e)=>{
        e.stopPropagation()
       onDelete && onDelete()
      }}
      className="absolute cursor-pointer top-2 right-2 p-1.5 bg-[#1A1A1A]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <X size={14} className="text-white" />
      </button>
    </motion.div>
  )
}

export default SmallMovieCard