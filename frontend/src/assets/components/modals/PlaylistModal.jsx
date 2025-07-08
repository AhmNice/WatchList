import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Search, Plus, Trash2, Loader2, Lock, Users } from 'lucide-react'
import { useMovieStore } from '../../store/movieStore'
import toast from 'react-hot-toast'
import { usePlaylistStore } from '../../store/playlistStore'
import { useAuthStore } from '../../store/authStore'

const PlaylistModal = ({ onClose }) => {
  const [playlistName, setPlaylistName] = useState('')
  const [description, setDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovies, setSelectedMovies] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const modalRef = useRef(null)
  const { user } = useAuthStore()
  const { movies, getAllMovie } = useMovieStore()
  const { createPlaylist, fetchAllPlaylist, loadingPlaylist } = usePlaylistStore()

  useEffect(() => {
    if (movies && movies.length > 0) {
      setSearchResults(movies)
    }
  }, [movies])

  useEffect(() => {
    if (!movies || movies.length === 0) {
      getAllMovie()
    }
  }, [])

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleAddMovie = (movie) => {
    if (!selectedMovies.some(m => m.tmdbId === movie.tmdbId)) {
      setSelectedMovies([...selectedMovies, movie])
      setSearchQuery('')
      setIsSearching(false)
    }
  }

  const handleRemoveMovie = (movieId) => {
    setSelectedMovies(selectedMovies?.filter(movie => movie.id !== movieId))
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setIsSearching(e.target.value.length > 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const playlistData = {
      userId: user._id,
      playlist_name: playlistName,
      description: description,
      isShared,
      movies: selectedMovies.map(movie => ({
        title: movie.title,
        tmdbId: movie.tmdbId,
        poster: movie.poster,
      }))
    }

    try {
      await createPlaylist(playlistData)
      toast.success(`Playlist ${isShared ? 'shared' : 'created'} successfully!`)
      resetForm()
      onClose()
    } catch (error) {
      toast.error(error.message || 'Failed to create playlist')
    }
  }

  const resetForm = () => {
    setPlaylistName('')
    setDescription('')
    setSelectedMovies([])
    setSearchQuery('')
    setIsSearching(false)
    setIsShared(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-[#141414]/80 backdrop-blur-sm z-50 flex justify-center items-center p-4'
      role='dialog'
      aria-modal='true'
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: 'spring', damping: 25 }}
        className='relative bg-[#1A1A1A] rounded-lg border border-[#262626] w-full max-w-md max-h-[90vh] flex flex-col shadow-xl'
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-[#262626]'>
          <h2 className='text-xl font-bold text-white'>Create New Playlist</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
            aria-label='Close modal'
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className='overflow-y-auto flex-1 p-6 scrollbar-none'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Playlist Name */}
            <div>
              <label htmlFor='playlist_name' className='block Manrope-SemiBold text-sm text-gray-300 mb-2'>
                Playlist Name
              </label>
              <input
                type='text'
                id='playlist_name'
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className='w-full bg-[#262626] Manrope-Regular border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#E50000]'
                required
                maxLength={50}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor='description' className='block Manrope-SemiBold text-sm text-gray-300 mb-2'>
                Description
              </label>
              <textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full bg-[#262626] Manrope-Regular border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#E50000] min-h-[80px]'
                maxLength={200}
              />
            </div>

            {/* Share Toggle */}
            <div className='flex items-center justify-between'>
              <label className='Manrope-SemiBold text-sm text-gray-300'>
                Playlist Visibility
              </label>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setIsShared(false)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${!isShared ? 'bg-[#E50000] text-white' : 'bg-[#262626] text-gray-400'}`}
                >
                  <Lock size={14} />
                  <span>Private</span>
                </button>
                <button
                  type='button'
                  onClick={() => setIsShared(true)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${isShared ? 'bg-[#E50000] text-white' : 'bg-[#262626] text-gray-400'}`}
                >
                  <Users size={14} />
                  <span>Shared</span>
                </button>
              </div>
            </div>

            {/* Movie Search */}
            <div>
              <label htmlFor='search' className='block Manrope-SemiBold text-sm text-gray-300 mb-2'>
                Search Movies
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={16} />
                <input
                  type='text'
                  id='search'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='w-full bg-[#262626] Manrope-Regular border border-[#333] rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#E50000]'
                  placeholder='Search for movies...'
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearching && (
                <div className='mt-2 bg-[#262626] rounded-md max-h-60 overflow-y-auto shadow-lg'>
                  {searchResults
                    ?.filter(movie =>
                      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(movie => (
                      <div
                        key={movie.tmdbId}
                        className='flex items-center justify-between p-3 hover:bg-[#333] cursor-pointer transition-colors'
                        onClick={() => handleAddMovie(movie)}
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-[#333] rounded overflow-hidden'>
                            {movie.poster && (
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className='w-full h-full object-cover'
                              />
                            )}
                          </div>
                          <div>
                            <p className='Manrope-Medium text-white'>{movie.title}</p>
                            <p className='Manrope-Regular text-xs text-gray-400'>{movie.year}</p>
                          </div>
                        </div>
                        <Plus size={16} className='text-gray-400' />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Selected Movies */}
            {selectedMovies.length > 0 && (
              <div>
                <h3 className='Manrope-SemiBold text-sm text-gray-300 mb-3'>
                  Selected Movies ({selectedMovies.length})
                </h3>
                <div className='grid grid-cols-2 gap-3'>
                  {selectedMovies.map(movie => (
                    <div
                      key={movie.id}
                      className='flex items-center justify-between bg-[#262626] p-3 rounded-md'
                    >
                      <div className='flex items-center gap-3 overflow-hidden'>
                        <div className='flex-shrink-0 w-8 h-8 bg-[#333] rounded overflow-hidden'>
                          {movie.poster && (
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className='w-full h-full object-cover'
                            />
                          )}
                        </div>
                        <p className='Manrope-Medium text-sm text-white truncate'>{movie.title}</p>
                      </div>
                      <button
                        type='button'
                        onClick={() => handleRemoveMovie(movie.id)}
                        className='text-gray-400 hover:text-[#E50000] transition-colors'
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer with Actions */}
        <div className='p-4 border-t border-[#262626] bg-[#1A1A1A]'>
          <div className='flex justify-end gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-300 hover:text-white transition-colors Manrope-Medium'
            >
              Cancel
            </button>
            <button
              type='submit'
              onClick={handleSubmit}
              disabled={!playlistName || loadingPlaylist}
              className={`px-4 py-2 rounded-md transition-colors Manrope-SemiBold ${playlistName
                ? 'bg-[#E50000] hover:bg-[#FF1919] text-white'
                : 'bg-[#262626] text-gray-500 cursor-not-allowed'
                }`}
            >
              {loadingPlaylist ? (
                <span className='flex items-center justify-center w-full gap-2'>
                  <Loader2 className='animate-spin' size={16} />
                  {isShared ? 'Sharing...' : 'Creating...'}
                </span>
              ) : isShared ? 'Share Playlist' : 'Create Playlist'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PlaylistModal