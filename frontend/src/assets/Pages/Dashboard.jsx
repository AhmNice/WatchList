import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
import Card from "../components/Cards/StatCard";
import WelcomeCard from "../components/Cards/WelcomeCard";
import { Film, Heart, ListVideo, Clock, Loader2 } from "lucide-react";
import PlaylistCard from "../components/Cards/PlaylistCard";
import UpdateCard from "../components/Cards/UpdateCard";
import MovieCard from "../components/Cards/MovieCard";
import { useMovieStore } from "../store/movieStore";
import { usePlaylistStore } from "../store/playlistStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useStatStore } from "../store/statStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { playlists, fetchUserPlaylists, loadingPlaylist } = usePlaylistStore();
  const { stats: userStats, fetchUserStats, loadingStats } = useStatStore();
  const { user } = useAuthStore();

  const statCards = [
    {
      title: "Movies In Playlists",
      value: userStats?.totalMoviesInPlaylists || 0,
      icon: <Film className="text-[#FF4C4C]" size={28} />,
    },
    {
      title: "Favorites",
      value: userStats?.totalFavoriteMovies || 0,
      icon: <Heart className="text-[#E50000]" size={28} />,
    },
    {
      title: "Playlists",
      value: userStats?.totalPlaylists || 0,
      icon: <ListVideo className="text-[#00C49F]" size={28} />,
    },
    {
      title: "Watch Time",
      value: `${userStats?.totalWatchTimeHours || 0}h`,
      icon: <Clock className="text-[#FFB400]" size={28} />,
    },
  ];
  const { getAllMovie, movies, loading } = useMovieStore();

  useEffect(() => {
    document.title = "Dashboard - WatchList";
    if (!movies || movies.length === 0) {
      getAllMovie();
    }

    if (user?._id) {
      if (!playlists || playlists.length === 0) {
        fetchUserPlaylists(user._id);
      }
      fetchUserStats(user._id);
    }
  }, [user?._id]);
  console.log(movies);

  return (
    <section className="flex h-screen bg-[#141414] overflow-hidden">
      <div className="  h-full  flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <div className="h-16 flex-shrink-0">
          <Header />
        </div> */}

        {/* Scrollable Content - flex-1 to take remaining space */}
        <div className="flex-1 w-full scrollbar-none overflow-y-auto p-6">
          <WelcomeCard userName={user?.username} />

          {/* Stats Grid - responsive columns */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {statCards.map((stat, index) => (
              <Card
                key={index}
                cardTitle={stat.title}
                icon={stat.icon}
                cardText={loadingStats ? "..." : stat.value}
              />
            ))}
          </div>

          {/* Latest from playlist - responsive columns */}

          <div className="mt-8">
            <h2 className="Manrope-SemiBold text-lg text-white">
              Latest From Your Playlist
            </h2>
            {playlists && playlists.length > 0 && (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                {playlists?.slice(0, 4).map((playlist) => (
                  <UpdateCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            )}
            {loadingPlaylist && (
              <div className="col-span-4 flex justify-center py-8">
                <Loader2 className="animate-spin text-[#E50000]" size={32} />
              </div>
            )}
          </div>

          {/* Recommendations - responsive columns */}
          <div className="mt-8">
            <h2 className="Manrope-SemiBold text-lg text-white">
              Recommendations
            </h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
              {loading ? (
                <div className="col-span-4 flex justify-center py-8">
                  <Loader2 className="animate-spin text-[#E50000]" size={32} />
                </div>
              ) : (
                movies?.slice(0, 4).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showRating={true}
                    onClick={() => {
                      navigate(`/discover/movie/${movie.tmdbId}`);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
