import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
// import Header from '../components/Header';
import { useAuthStore } from "../store/authStore";
import { usePlaylistStore } from "../store/playlistStore";
import PlaylistCard from "../components/Cards/PlaylistCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { Plus, Search } from "lucide-react";
import Button from "../components/button/Button";
import JoinPlaylistModal from "../components/modals/JoinPlaylistModal";
import PlaylistDetailsModal from "../components/modals/PlaylistDetailsModal";

const SharedPlaylistPage = () => {
  const {
    fetchUserPlaylists,
    playlists,
    loadingPlaylist,
    allPlaylist,
    fetchAllPlaylist,
  } = usePlaylistStore();
  useEffect(() => {
    document.title = "Shared Playlist - WatchList";
  }, []);
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [previewing, setPreviewing] = useState(false);

  const handleViewing = (playlist) => {
    setViewing(playlist);
    setPreviewing((prev) => !prev);
  };
  const handleShowModal = () => {
    setShowModal((prev) => !prev);
  };
  const handleModalClose = () => {
    setShowModal((prev) => !prev);
    setSearchQuery("");
  };
  useEffect(() => {
    fetchAllPlaylist();
  }, [fetchAllPlaylist]);

  const sharedPlaylist = useMemo(
    () =>
      allPlaylist.filter((playlist) =>
        playlist.sharedWith?.includes(user?._id),
      ),
    [playlists, user?._id],
  );

  const filteredPlaylist = useMemo(
    () =>
      sharedPlaylist.filter(
        (playlist) =>
          playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.movies?.some((movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ) ||
          playlist.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [sharedPlaylist, searchQuery],
  );

  const handleJoinPlaylist = () => {
    handleShowModal();
    console.log("Join playlist clicked");
  };

  return (
    <section className="flex h-screen bg-[#141414] overflow-hidden">
      {showModal && (
        <JoinPlaylistModal isOpen={showModal} onClose={handleModalClose} />
      )}
      {previewing && <PlaylistDetailsModal playlist={viewing} />}
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <div className="h-16 flex-shrink-0">
          <Header />
        </div> */}

        <div className="flex-1 w-full text-white scrollbar-none overflow-y-auto p-6">
          <div className="mb-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  Playlists shared with you
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {filteredPlaylist.length}{" "}
                  {filteredPlaylist.length === 1 ? "playlist" : "playlists"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search playlists..."
                    className="w-full bg-[#282828] rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50000] text-sm"
                  />
                </div>

                <Button
                  icon={<Plus size={18} />}
                  text={"Join playlist"}
                  iconPosition="right"
                  onClick={handleJoinPlaylist}
                  className="whitespace-nowrap"
                />
              </div>
            </div>

            {loadingPlaylist ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <SkeletonLoader key={index} className="h-64 rounded-lg" />
                ))}
              </div>
            ) : filteredPlaylist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaylist.map((playlist) => (
                  <PlaylistCard
                    key={playlist._id}
                    playlist={playlist}
                    onClick={() => {
                      handleViewing(playlist);
                    }}
                    onOptionClick={""}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title={
                  searchQuery
                    ? "No matching playlists found"
                    : "No shared playlists"
                }
                description={
                  searchQuery
                    ? "Try adjusting your search query"
                    : "When someone shares a playlist with you, it will appear here"
                }
                icon={<Search size={48} className="text-gray-500" />}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SharedPlaylistPage;

const EmptyState = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md">{description}</p>
    </div>
  );
};
