import React, { useEffect, useState } from "react";
import Header from "../components/Header";
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

const PlaylistPage = () => {
  const { fetchAllPlaylist, playlists, resetPlaylist, deletePlaylist,removeMovieFromPlaylist, loadingPlaylist } = usePlaylistStore();
  const { user } = useAuthStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [playlistDetailsModal, setPlaylistDetailsModal] = useState(false);
  const [playlistView, setPlaylistView] = useState(null);
  const [movieToRemove, setMovieToRemove] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showOption, setShowOption] = useState(null);
  const [playlistToDelete, setPlaylistToDelete ] = useState(null)
  const [deletingPlaylist, setDeletingPlaylist ] = useState(false)
  useEffect(() => {
    if (user?._id) fetchAllPlaylist(user._id);
  }, [user]);

  const handleModalClose = () => setModalOpen((prev) => !prev);

  const handlePlaylistDetailsModal = () => {
    if (playlistView) setPlaylistDetailsModal((prev) => !prev);
  };
  const handlePlaylistDeletePick =(playlist)=>{
    setPlaylistToDelete(playlist)
  }
  const handlePick = (movie) => setMovieToRemove(movie);
  const deleteThisPlaylist = async(playlist)=> {
    const playlistId = playlist._id;
    const userId = user._id;
      setDeletingPlaylist(true)

    try {
      await deletePlaylist(playlistId, userId)
      toast.success('Playlist Deleted')
      setDeletingPlaylist(false)
      setPlaylistToDelete(null)
      await fetchAllPlaylist(user._id, true)
    } catch (error) {
      console.log(error.message)
    }finally{
      setDeletingPlaylist(false)
    }
  }
  const handleRemoveMovieFromPlaylist = async () => {
    const userId = user._id;
    const playlistId = playlistView._id;
    const movieId = movieToRemove.tmdbId;

    if (!playlistId || !movieId || !userId) return;

    setDeleting(true);
    try {
      await removeMovieFromPlaylist(playlistId, movieId, userId);
      setPlaylistView((prev) => ({
        ...prev,
        movies: prev.movies.filter((m) => m.tmdbId !== movieToRemove.tmdbId),
      }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setDeleting(false);
      setMovieToRemove(null);
    }
  };

  useEffect(() => {
    document.title = 'WatchList - Playlist';
  }, []);

  return (
    <section className="w-full h-screen flex bg-[#141414] overflow-auto">
      {modalOpen && <PlaylistModal onClose={handleModalClose} />}
      {playlistToDelete && (
        <StatusModal
        title={`Delete ${playlistToDelete.title}`}
        message={`Are sure you want to delete ${playlistToDelete.title}? This action can not be reversed`}
        type="warning"
        isLoading={deletingPlaylist}
       onAccept={() => deleteThisPlaylist(playlistToDelete)}
        onClose={()=> setPlaylistToDelete(null)}
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
          message={`Are you sure you want to remove ${movieToRemove.title} from this playlist?`}
          type="warning"
          isLoading={deleting}
          onAccept={handleRemoveMovieFromPlaylist}
          onClose={() => setMovieToRemove(null)}
        />
      )}

      <Sidebar />

      <div className="flex-1 min-h-full flex flex-col overflow-auto">
        <Header />
        <div className="overflow-y-auto p-6 scrollbar-none">
          <div className="flex justify-between items-center">
            <h2 className="Manrope-SemiBold text-md text-white">All Playlist</h2>
            <Button
              text="Add Playlist"
              icon={<Plus size={24} className="text-white" />}
              iconPosition="right"
              onClick={handleModalClose}
            />
          </div>

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {loadingPlaylist ? (
              <Loader2 className="animate-spin text-[#E50000]" size={24} />
            ) : (
              Array.isArray(playlists) &&
              playlists.map((playlist, index) => (
                <PlaylistCard
                  key={playlist._id}
                  playlist={playlist}
                  showOption={showOption === index}
                  onClick={() => {
                    setPlaylistView(playlist);
                    handlePlaylistDetailsModal();
                  }}
                onDelete={() => handlePlaylistDeletePick(playlist)}
                  optionClick={(e) => {
                    e.stopPropagation();
                    setShowOption(showOption === index ? null : index);
                  }}
                />
              ))
            )}
          </div>

          {Array.isArray(playlists) && playlists.length === 0 && !loadingPlaylist && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <img src="/no-data.svg" className="w-24 opacity-80" alt="no-data svg" />
              <p className="text-white text-lg Manrope-Regular">No Playlists Found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlaylistPage;
