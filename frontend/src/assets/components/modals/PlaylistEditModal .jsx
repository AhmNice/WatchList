import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Loader2, Lock, Unlock, X } from 'lucide-react';
import { usePlaylistStore } from '../../store/playlistStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const PlaylistEditModal = ({
  isOpen,
  onClose,
  playlist,
  onSave
}) => {
  const { loadingPlaylist, updatePlaylist } = usePlaylistStore();
  const { user } = useAuthStore();

  const [playlistDetails, setPlaylistDetails] = useState({
    title: '',
    description: '',
    shared: false  // Using 'shared' instead of 'isPrivate'
  });

  // Initialize form with playlist data
  useEffect(() => {
    if (playlist) {
      setPlaylistDetails({
        title: playlist.title || '',
        description: playlist.description || '',
        shared: playlist.shared
      });
    console.log(playlistDetails.shared)

    }
  }, [playlist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaylistDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleTogglePrivacy = () => {
    setPlaylistDetails(prev => ({
      ...prev,
      shared: !prev.shared
    }));
  };
useEffect(() => {
  console.log(playlistDetails.shared);
}, [playlistDetails.shared]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playlist?._id || !user?._id) return;

    try {
      const payload = {
        playlist_name: playlistDetails.title,
        description: playlistDetails.description,
        shared: playlistDetails.shared  // Using 'shared' in payload
      };

      await updatePlaylist(payload, user._id, playlist._id);
      toast.success('Playlist updated successfully');
      onSave?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update playlist');
      console.error('Update playlist error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-[#1A1A1A] rounded-xl border border-[#333] w-full max-w-md"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                <Edit2 size={18} />
                Edit Playlist
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={loadingPlaylist}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Name</label>
                  <input
                    type="text"
                    name="title"
                    value={playlistDetails.title}
                    onChange={handleChange}
                    className="w-full bg-[#262626] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E50000]"
                    required
                    disabled={loadingPlaylist}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Description</label>
                  <textarea
                    name="description"
                    value={playlistDetails.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-[#262626] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E50000]"
                    disabled={loadingPlaylist}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-white">
                    {playlistDetails.shared ? (
                      <Unlock size={18} className="text-[#A0A0A0]" />
                    ) : (
                      <Lock size={18} className="text-green-500" />
                    )}
                    <span className="font-medium">
                      {playlistDetails.shared ? 'Shared' : 'Private'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleTogglePrivacy}
                    disabled={loadingPlaylist}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      playlistDetails.shared ? 'bg-[#E50000]' : 'bg-green-500'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      playlistDetails.shared ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loadingPlaylist}
                  className="px-4 py-2 border border-[#333] rounded-lg hover:bg-[#262626] transition-colors disabled:opacity-50 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingPlaylist}
                  className="px-4 py-2 bg-[#E50000] flex items-center justify-center gap-2 rounded-lg hover:bg-[#FF1919] transition-colors disabled:opacity-50 min-w-[120px] text-white"
                >
                  {loadingPlaylist ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaylistEditModal;