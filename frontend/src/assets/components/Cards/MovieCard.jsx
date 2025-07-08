import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Play, Clock, Calendar, Star, Heart, MoreVertical, Plus } from "lucide-react";
import { motion } from "framer-motion";

const MovieCard = ({
  movie = {
    title: "Movie Title",
    poster: "/default-movie.jpg",
    releaseYear: new Date().getFullYear().toString(),
    runtime: 120,
    vote: 7.5,
  },
  showRating = false,
  showMenu = false,
  onAddToPlaylist,
  onWatchLater,
  onOptionClick,
  showOption=false,
  onClick = () => { },
}) => {
  // Format runtime from minutes to "Xhrs Ymins"
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}hrs ` : ""}${mins}mins`;
  };
  console.log(movie.releaseYear)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionRef = useRef(null)
  const options = [
    {
      type: 'Add to Playlist',
      icon: <Plus size={14} className="text-[#B3B3B3]" />,
      action: () => {
        setIsOptionsOpen(false);
        onAddToPlaylist?.();
      }
    },
    {
      type: 'Watch Later',
      icon: <Heart size={14} className="text-[#B3B3B3]" />,
      action: () => {
        setIsOptionsOpen(false);
        onWatchLater?.();
      }
    },
  ]
  const handleOptionClick = (e) => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);

    onOptionClick?.();
  }
  useEffect(()=>{
    const handleClickOutside =(event)=>{
      if(optionRef.current && !optionRef.current.contains(event.target)){
        setIsOptionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return()=>{
      document.removeEventListener('mousedown', handleClickOutside);
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, type: "spring" }}
      onClick={onClick}
      className="
        group relative
        bg-[#1A1A1A] rounded-lg
        border border-[#262626]
        hover:border-[#E50000]
        transition-all duration-300
        cursor-pointer
        shadow-lg
        h-full
      "
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie?.poster}
          alt={movie?.title || "Movie poster"}
          className="w-full h-full object-cover rounded-t-md transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/default-movie.jpg";
          }}
        />

        {/* Play Button Overlay */}
        <div className="
          absolute inset-0
          bg-black/50
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        ">
          {/* <div className="
            p-3 rounded-full
            bg-[#E50000] text-white
            hover:scale-110
            transition-transform duration-200
          ">
            <Play size={20} fill="currentColor" />
          </div> */}
        </div>

        {/* Rating Badge */}
        {showRating && (
          <div className="
            absolute top-2 left-2
            bg-[#1A1A1A]/90
            px-2 py-1 rounded-full
            flex items-center
            text-yellow-400
          ">
            <Star size={14} className="fill-current mr-1" />
            <span className="text-xs font-bold">
              {movie?.vote ? parseFloat(movie.vote).toFixed(1) : "N/A"}
            </span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-3 flex flex-col h-[30%]">
        <div className="flex justify-between items-start">
          <h3 className="text-white Manrope-Bold text-md line-clamp-2">
            {movie?.title || "Untitled Movie"}
          </h3>
          {showMenu && (
            <div className=" relative ml-2" ref={optionRef}>
              <button
                className="
                text-gray-400 hover:text-white
                p-1 rounded-full
                hover:bg-[#262626]
                ml-2
              "
              type="button"
                onClick={
                  handleOptionClick
                }
              >
                <MoreVertical size={18} />
              </button>

              {isOptionsOpen && showOption && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute flex flex-col right-0 top-8 w-40 bg-[#262626] shadow-lg rounded-md overflow-hidden z-50 border border-[#404040]"
                >

                  {options.map((option, index) => (
                    <div key={`option-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        option.action();
                      }}
                      className="w-full flex items-center justify-between p-2 hover:bg-[#404040] text-[#E0E0E0] Manrope-Medium text-sm cursor-pointer transition-colors duration-150"
                      role="button"
                      onKeyDown={(e) => e.key === 'Enter' && option.action()}
                    >
                      <span>{option.type}</span>
                      <span className="text-gray-400">
                        {React.cloneElement(option.icon)}
                      </span>
                    </div>
                  ))}

                </motion.div>
              )}
            </div>

          )}


        </div>

        <div className="flex justify-between mt-2 text-gray-400 text-xs">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{movie?.releaseYear || "N/A"}</span>
          </div>

          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatRuntime(movie?.runtime)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
    poster: PropTypes.string,
    releaseYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    runtime: PropTypes.number,
    vote: PropTypes.number,
  }),
  showRating: PropTypes.bool,
  showMenu: PropTypes.bool,
  onAddToPlaylist: PropTypes.func,
  onWatchLater: PropTypes.func,
  onOptionClick: PropTypes.func,
  showOption: PropTypes.bool,
  onClick: PropTypes.func,
};

MovieCard.defaultProps = {
  movie: {
    title: "Movie Title",
    poster: "/default-movie.jpg",
    releaseYear: new Date().getFullYear().toString(),
    runtime: 120,
    vote: 7.5,
  },
  showRating: false,
  showMenu: false,
  showOption:false,
  onAddToPlaylist: () => { },
  onWatchLater: () => { },
  onOptionClick: () => { },
  onClick: () => { },
};

export default MovieCard;