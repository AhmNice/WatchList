import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePlaylistStore } from '../../store/playlistStore';
import { useAuthStore } from '../../store/authStore';
import { useMovieStore } from '../../store/movieStore';

const AddToPlaylistModal = ({ onClose, movieId }) => {
  const { playlists, errorMsg, addMovieToPlaylist, createPlaylist } = usePlaylistStore();
  const { user } = useAuthStore();
  const { movies } = useMovieStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState({
    playlistId: null,
    creating: false,
    global: false
  });

  const movie = movies.find(m => String(m.tmdbId) === String(movieId));

  // Fetch playlists when modal opens


  const handleAddToPlaylist = async (playlistId) => {
    if (!movie) {
      toast.error('Movie not found');
      return;
    }

    setLoading({ ...loading, playlistId, global: true });

    try {
      await addMovieToPlaylist(playlistId, user._id, { movies: [movie] });
      toast.success('Added to playlist');
      onClose();
    } catch (error) {
      console.error('Error adding to playlist:', error);
      toast.error(error.message || errorMsg || 'Failed to add to playlist');
    } finally {
      setLoading({ ...loading, playlistId: null, global: false });
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    if (!movie) {
      toast.error('Movie not found');
      return;
    }

    setLoading({ ...loading, creating: true });

    try {
      await createPlaylist({
        userId: user._id,
        title: newPlaylistName,
        movies: [movie.tmdbId]
      });
      toast.success('Playlist created');
      setNewPlaylistName('');
      setShowCreateForm(false);
      onClose();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error(error.message || errorMsg || 'Failed to create playlist');
    } finally {
      setLoading({ ...loading, creating: false });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-[#1A1A1A] rounded-lg border border-[#262626] w-full max-w-md max-h-[90vh] flex flex-col shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex justify-between items-center border-b border-[#262626] p-4'>
          <h2 className="font-bold text-lg text-white">Add to Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading.global}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {showCreateForm ? (
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-[#262626] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#E50000]"
                  placeholder="My Awesome Playlist"
                  autoFocus
                  disabled={loading.creating}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E50000] rounded-md hover:bg-[#FF1919] text-white flex items-center justify-center gap-2"
                  disabled={loading.creating}
                >
                  {loading.creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-[#262626] rounded-md hover:bg-[#333] text-white"
                  disabled={loading.creating}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {playlists?.length > 0 ? (
                <div className="space-y-2">
                  {playlists.map(playlist => (
                    <PlaylistCard
                      key={playlist._id}
                      playlist={playlist}
                      onClick={() => handleAddToPlaylist(playlist._id)}
                      hasMovie={playlist.movies.some(m => m.tmdbId === movieId)}
                      isLoading={loading.playlistId === playlist._id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  You don't have any playlists yet
                </div>
              )}

              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#262626] rounded-md hover:bg-[#333] text-white transition-colors"
                disabled={loading.global}
              >
                <Plus size={18} />
                <span>Create New Playlist</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const PlaylistCard = ({ playlist, onClick, hasMovie, isLoading }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={!isLoading ? onClick : undefined}
      className={`p-3 rounded-md cursor-pointer flex items-center justify-between transition-colors ${
        hasMovie ? 'bg-[#E50000]/10 border border-[#E50000]/30' : 'bg-[#262626] hover:bg-[#333]'
      } ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{playlist.title}</h3>
        <p className="text-sm text-gray-400">
          {playlist.movies.length} {playlist.movies.length === 1 ? 'movie' : 'movies'}
        </p>
      </div>

      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      ) : hasMovie ? (
        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-[#E50000]/20 text-[#E50000] rounded-full">
          <Check size={14} />
          Added
        </span>
      ) : null}
    </motion.div>
  );
};

export default AddToPlaylistModal;