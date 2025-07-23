import React, { useState } from 'react';
import { X, Copy, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlaylistStore } from '../../store/playlistStore';
import { useAuthStore } from '../../store/authStore';
const JoinPlaylistModal = ({ isOpen, onClose }) => {
  const [shareCode, setShareCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { onJoin } = usePlaylistStore()
  const { user } = useAuthStore()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!shareCode || shareCode.trim().length < 8) {
        throw new Error('Share code must be at least 8 characters');
      }
      const payload = {
        userToAdd: user._id
      }
      await onJoin(shareCode.trim(), payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to join playlist');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setShareCode(text);
    } catch (err) {
      setError('Could not access clipboard');
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 text-white z-60 flex items-center justify-center bg-black/10  backdrop-blur-sm">
      <motion.div
        initial={{ opacity:0, y:10}}
        animate={{ opacity: 1, y:0}}
        exit={{ opacity:0, y:10}}
       className="relative bg-[#282828] rounded-lg w-full max-w-md mx-4 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#383838] transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Join a Playlist</h3>
          <p className="text-gray-400 text-sm">
            Enter the share code provided by the playlist owner
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                placeholder="Paste share code here"
                className="w-full bg-[#383838] rounded-lg py-2 pl-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50000]"
                autoFocus
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Paste from clipboard"
              >
                <Copy size={18} />
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-transparent hover:bg-[#383838] transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#E50000] hover:bg-[#FF1A1A] text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                disabled={isSubmitting || !shareCode.trim()}
              >
                {isSubmitting ? (
                  <div className='flex gap-2 justify-between items-center'>
                  <Loader2 className=" animate-spin" size={24}/>
                    <span>Joining...</span>
                  </div>
                ) : (
                  <>
                    Join Playlist <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinPlaylistModal;