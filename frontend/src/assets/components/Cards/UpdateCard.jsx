import PropTypes from 'prop-types';
import React from 'react';
import { Play, MoreVertical, Clock } from 'lucide-react';

const UpdateCard = ({ playlist }) => {
  return (
    <div className='
      group relative
      bg-[#1A1A1A] rounded-lg
      border border-[#262626]
      overflow-hidden
      hover:border-[#E50000]
      transition-all duration-300
      cursor-pointer
      shadow-lg
      p-4
    '>
      {/* Header with title and description */}
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h1 className='text-white Manrope-Bold text-xl line-clamp-1'>
            {playlist.title}
          </h1>
          <p className='text-gray-400 Manrope-Regular text-sm mt-1 line-clamp-2'>
            {playlist.description}
          </p>
        </div>
        <button className='
          text-gray-400 hover:text-white
          p-1 rounded-full
          hover:bg-[#262626]
        '>
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Movie grid */}
      <div className='grid grid-cols-4 gap-2'>
        {playlist?.movies?.slice(0,4).map((movie, index) => (
          <div key={index} className='relative aspect-[2/3] rounded-md overflow-hidden'>
            <img
              src={movie.poster || '/default-movie.jpg'}
              alt={movie.title}
              className='w-full h-full object-cover group-hover:opacity-90'
              onError={(e) => {
                e.target.src = '/default-movie.jpg';
              }}
            />
            {/* Play overlay */}
            <div className='
              absolute inset-0
              bg-black/60
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            '>
              <Play
                size={24}
                className='text-white'
                fill='currentColor'
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer with movie count */}
      {playlist.movies?.length > 4 && (
        <div className='mt-3 text-right'>
          <p className='text-gray-400 Manrope-Regular text-sm'>
            +{playlist.movies.length - 4} more
          </p>
        </div>
      )}
    </div>
  );
};

UpdateCard.propTypes = {
  playlist: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    movies: PropTypes.arrayOf(
      PropTypes.shape({
        movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        poster: PropTypes.string,
        year:PropTypes.string,
        addedAt:PropTypes.string
      })
    ).isRequired,
  }).isRequired,
};

export default UpdateCard;