import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Clock, Share2, Trash2 } from "lucide-react";
import SmallMovieCard from "../Cards/SmallMovieCard";

const PlaylistDetailsModal = ({ playlist, onClose, handlePick }) => {
  const [localMovies, setLocalMovies] = useState([]);

  useEffect(() => {
    if (playlist?.movies) setLocalMovies(playlist.movies);
  }, [playlist.movies]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#141414]/80 backdrop-blur-sm z-50 flex justify-center items-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-[#1A1A1A] rounded-lg border border-[#262626] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 p-6 border-b border-[#262626]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl Manrope-Bold text-white">
              {playlist?.title || "Untitled Playlist"}
            </h2>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Share2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="Manrope-Regular text-[#A6A6A6] line-clamp-2">
              {playlist?.description || "No description provided"}
            </p>
            <div className="flex items-center gap-2 text-[#A6A6A6] text-sm">
              <Clock size={16} />
              <span>{localMovies.length} movies</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 scrollbar-none">
          {localMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {localMovies.map((movie) => (
                <SmallMovieCard
                  key={movie.tmdbId}
                  movie={movie}
                  onDelete={() => handlePick(movie)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <p className="Manrope-Medium text-[#A6A6A6] mb-4">
                This playlist is empty
              </p>
              <button className="text-[#E50000] Manrope-SemiBold hover:underline">
                Add movies
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262626] flex justify-between items-center">
          <button className="flex items-center gap-2 text-[#E50000] Manrope-SemiBold hover:bg-[#262626] px-3 py-2 rounded-md">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlaylistDetailsModal;
