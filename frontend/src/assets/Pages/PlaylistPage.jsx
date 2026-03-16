import React, { useEffect, useState, useCallback } from "react";
// import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { usePlaylistStore } from "../store/playlistStore";
import PlaylistCard from "../components/Cards/PlaylistCard";
import { useAuthStore } from "../store/authStore";
import Button from "../components/button/Button";
import { Loader2, Plus } from "lucide-react";
import PlaylistModal from "../components/modals/PlaylistModal";
import StatusModal from "../components/modals/StatusModal";
import PlaylistDetailsModal from "../components/modals/PlaylistDetailsModal";
import toast from "react-hot-toast";
import PlaylistShareModal from "../components/modals/PlaylistShareModal ";
import PlaylistEditModal from "../components/modals/PlaylistEditModal ";

const PlaylistPage = () => {
  const {
    fetchUserPlaylists,
    playlists,
    deletePlaylist,
    removeMovieFromPlaylist,
    loadingPlaylist,
  } = usePlaylistStore();

  const { user } = useAuthStore();

  // State declarations
  const [modalOpen, setModalOpen] = useState(false);
  const [sharingPlaylist, setSharingPlaylist] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(false);
  const [playlistDetailsModal, setPlaylistDetailsModal] = useState(false);
  const [playlistView, setPlaylistView] = useState(null);
  const [movieToRemove, setMovieToRemove] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showOption, setShowOption] = useState(null);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sharing, setSharing] = useState(null);

  // Fetch playlists on mount or when user changes
  useEffect(() => {
    if (user?._id) {
      fetchUserPlaylists(user._id);
    }
  }, [user, fetchUserPlaylists]);

  // Set document title
  useEffect(() => {
    document.title = "WatchList - Playlist";
  }, []);

  // Modal handlers
  const handleModalClose = useCallback(() => {
    setModalOpen((prev) => !prev);
  }, []);

  const handlePlaylistDetailsModal = useCallback(() => {
    if (playlistView) {
      setPlaylistDetailsModal((prev) => !prev);
    }
  }, [playlistView]);

  const handlePlaylistDeletePick = useCallback((playlist) => {
    setPlaylistToDelete(playlist);
  }, []);

  const handlePick = useCallback((movie) => {
    setMovieToRemove(movie);
  }, []);

  // Playlist operations
  const deleteThisPlaylist = useCallback(
    async (playlist) => {
      if (!playlist?._id || !user?._id) return;

      setDeletingPlaylist(true);
      try {
        await deletePlaylist(playlist._id, user._id);
        toast.success("Playlist deleted successfully");
        await fetchUserPlaylists(user._id);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete playlist",
        );
        console.error("Delete playlist error:", error);
      } finally {
        setDeletingPlaylist(false);
        setPlaylistToDelete(null);
      }
    },
    [deletePlaylist, fetchUserPlaylists, user],
  );

  const handleRemoveMovieFromPlaylist = useCallback(async () => {
    if (!playlistView?._id || !movieToRemove?.tmdbId || !user?._id) return;

    setDeleting(true);
    try {
      await removeMovieFromPlaylist(
        playlistView._id,
        movieToRemove.tmdbId,
        user._id,
      );
      setPlaylistView((prev) => ({
        ...prev,
        movies: prev.movies.filter((m) => m.tmdbId !== movieToRemove.tmdbId),
      }));
      toast.success("Movie removed from playlist");
    } catch (error) {
      toast.error("Failed to remove movie from playlist");
      console.error("Remove movie error:", error);
    } finally {
      setDeleting(false);
      setMovieToRemove(null);
    }
  }, [playlistView, movieToRemove, user, removeMovieFromPlaylist]);

  // Share and edit handlers
  const handleShare = useCallback((playlist) => {
    setSharing(playlist);
    setSharingPlaylist(true);
  }, []);

  const handleCloseShare = useCallback(() => {
    setSharingPlaylist(false);
    setSharing(null);
  }, []);

  const handlePlaylistEdit = useCallback((playlist) => {
    setEditing(playlist);
    setEditingPlaylist(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingPlaylist(false);
    setEditing(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    handleCloseEdit();
    if (user?._id) {
      fetchUserPlaylists(user._id);
    }
  }, [handleCloseEdit, fetchUserPlaylists, user]);

  return (
    <section className="w-full h-screen flex bg-[#141414] overflow-auto">
      {/* Modals */}
      {editingPlaylist && (
        <PlaylistEditModal
          playlist={editing}
          isOpen={editingPlaylist}
          onClose={handleCloseEdit}
          onSave={handleEditSuccess}
        />
      )}

      {sharingPlaylist && (
        <PlaylistShareModal
          playlist={sharing}
          isOpen={sharingPlaylist}
          onClose={handleCloseShare}
        />
      )}

      {modalOpen && (
        <PlaylistModal
          onClose={handleModalClose}
          onSuccess={() => {
            handleModalClose();
            if (user?._id) {
              fetchUserPlaylists(user._id);
            }
          }}
        />
      )}

      {playlistToDelete && (
        <StatusModal
          title={`Delete ${playlistToDelete.title}`}
          message={`Are you sure you want to delete "${playlistToDelete.title}"? This action cannot be undone.`}
          type="warning"
          isLoading={deletingPlaylist}
          onAccept={() => deleteThisPlaylist(playlistToDelete)}
          onClose={() => setPlaylistToDelete(null)}
        />
      )}

      {playlistView && playlistDetailsModal && (
        <PlaylistDetailsModal
          playlist={playlistView}
          onClose={handlePlaylistDetailsModal}
          handlePick={handlePick}
        />
      )}

      {movieToRemove && (
        <StatusModal
          title="Remove Movie"
          message={`Are you sure you want to remove "${movieToRemove.title}" from this playlist?`}
          type="warning"
          isLoading={deleting}
          onAccept={handleRemoveMovieFromPlaylist}
          onClose={() => setMovieToRemove(null)}
        />
      )}

      {/* Main Content */}
      <Sidebar />

      <div className="flex-1 min-h-full flex flex-col overflow-auto">
        {/* <Header /> */}
        <div className="overflow-y-auto p-6 scrollbar-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="Manrope-SemiBold text-2xl text-white">
              Your Playlists
            </h2>
            <Button
              text="Add Playlist"
              icon={<Plus size={20} className="text-white" />}
              iconPosition="right"
              onClick={handleModalClose}
              className="px-4 py-2"
            />
          </div>

          {loadingPlaylist ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-[#E50000]" size={32} />
            </div>
          ) : Array.isArray(playlists) && playlists.length > 0 ? (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {playlists.map((playlist, index) => (
                <PlaylistCard
                  key={playlist._id}
                  playlist={playlist}
                  showOption={showOption === index}
                  onClick={() => {
                    setPlaylistView(playlist);
                    setPlaylistDetailsModal(true);
                  }}
                  onDelete={() => handlePlaylistDeletePick(playlist)}
                  optionClick={(e) => {
                    e.stopPropagation();
                    setShowOption(showOption === index ? null : index);
                  }}
                  onEdit={() => handlePlaylistEdit(playlist)}
                  onShare={() => handleShare(playlist)}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center py-16">
              <img
                src="/no-data.svg"
                className="w-40 opacity-80 mb-4"
                alt="No playlists found"
              />
              <p className="text-white text-lg Manrope-Regular mb-4">
                No playlists found
              </p>
              <Button
                text="Create Your First Playlist"
                onClick={handleModalClose}
                className="px-4 py-2 bg-[#E50000] hover:bg-[#FF1919]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlaylistPage;
