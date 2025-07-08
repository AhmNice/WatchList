import React, { useEffect, useRef, useState } from 'react';
import { Play, MoreVertical, Trash2, ExternalLink, Edit, Eye, EyeIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const PlaylistCard = ({
  playlist,
  onClick,
  onOptionClick,
  showOptions = true,
  onEdit,
  onDelete,
  onShare
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  const options = [
    {
      type: 'Edit',
      icon: <Edit size={14} className="text-[#B3B3B3]" />,
      action: () => {
        setIsMenuOpen(false);
        onEdit?.();
      }
    },
    {
      type: 'Delete',
      icon: <Trash2 size={14} className="text-[#B3B3B3]" />,
      action: () => {
        setIsMenuOpen(false);
        onDelete?.();
      }
    },
    {
      type: 'Share',
      icon: <ExternalLink size={14} className="text-[#B3B3B3]" />,
      action: () => {
        setIsMenuOpen(false);
        onShare?.();
      }
    }
  ];

  const handleOptionClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    onOptionClick?.();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="
        group relative
        bg-[#1A1A1A] rounded-lg
        border border-[#262626]
        hover:border-[#E50000]
        transition-all duration-300
        cursor-pointer
        shadow-lg
        h-full
        hover:z-60
      "
    >
      {/* Playlist Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={playlist.imageUrl}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/default-playlist.jpg';
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
          <button
            className="
              p-3 rounded-full
              bg-[#E50000] text-white
              hover:scale-110
              transition-transform duration-200
              shadow-lg
            "
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <EyeIcon size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3
              className="text-white Manrope-Bold text-lg truncate"
              title={playlist.title}
            >
              {playlist.title}
            </h3>
            {playlist.description && (
              <p
                className="text-gray-400 Manrope-Regular text-sm mt-1 line-clamp-2"
                title={playlist.description}
              >
                {playlist.description}
              </p>
            )}
          </div>

          {showOptions && (
            <div className="relative ml-2" ref={menuRef}>
              <button
                className="
                  text-gray-400 hover:text-white
                  p-1 rounded-full
                  hover:bg-[#262626]
                  transition-colors
                "
                onClick={handleOptionClick}
                aria-label="Playlist options"
              >
                <MoreVertical size={18} />
              </button>

              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-8 w-40 bg-[#262626] shadow-lg rounded-md overflow-hidden z-50 border border-[#404040]"
                >
                  {options.map((option, index) => (
                    <div
                      key={`option-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        option.action();
                      }}
                      className="w-full flex items-center justify-between p-2 hover:bg-[#404040] text-[#E0E0E0] Manrope-Medium text-sm cursor-pointer transition-colors duration-150"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && option.action()}
                    >
                      <span>{option.type}</span>
                      <span className="text-[#B3B3B3]">
                        {React.cloneElement(option.icon, { size: 16 })}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>{playlist.movies?.length || 0} movies</span>
          </div>
          {playlist.duration && (
            <div className="flex items-center space-x-1">
              <span>{playlist.duration}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

PlaylistCard.propTypes = {
  playlist: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    movies: PropTypes.array,
    imageUrl: PropTypes.string,
    duration: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
  onOptionClick: PropTypes.func,
  showOptions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onShare: PropTypes.func,
};

PlaylistCard.defaultProps = {
  onClick: () => {},
  onOptionClick: () => {},
  showOptions: true,
  onEdit: null,
  onDelete: null,
  onShare: null,
  playlist: {
    title: 'My Playlist',
    description: 'Curated collection of favorites',
    movies: [],
    imageUrl: '/default-playlist.jpg',
    duration: '',
  }
};

export default PlaylistCard;