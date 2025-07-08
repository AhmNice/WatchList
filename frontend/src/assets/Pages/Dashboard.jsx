import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Cards/StatCard";
import WelcomeCard from "../components/Cards/WelcomeCard";
import { Film, Heart, ListVideo, Clock, Loader2 } from "lucide-react";
import PlaylistCard from "../components/Cards/PlaylistCard";
import UpdateCard from "../components/Cards/UpdateCard";
import MovieCard from "../components/Cards/MovieCard";
import { useMovieStore } from "../store/movieStore";
import { usePlaylistStore } from "../store/playlistStore";
import { useAuthStore } from "../store/authStore";

const Dashboard = () => {
   const stats = [
  {
    title: "Movies Watched",
    value: 128,
    icon: <Film className="text-[#FF4C4C]" size={28} />,
  },
  {
    title: "Favorites",
    value: 24,
    icon: <Heart className="text-[#E50000]" size={28} />,
  },
  {
    title: "Playlists",
    value: 5,
    icon: <ListVideo className="text-[#00C49F]" size={28} />,
  },
  {
    title: "Watch Time",
    value: "36h",
    icon: <Clock className="text-[#FFB400]" size={28} />,
  },
];
const { playlists, fetchAllPlaylist, loadingPlaylist } = usePlaylistStore()
const {user} = useAuthStore()
const { getAllMovie, movies, loading, success, errorMsg } = useMovieStore();
useEffect(()=>{
  document.title = "Dashboard - WatchList";
    if(movies && movies.length > 0){
      return
    }else{
      getAllMovie()
    }
    if(playlists && playlists.length > 0){
      return
    }else{
      fetchAllPlaylist()
    }
  },[])
console.log(movies)

  return (
    <section className="flex h-screen bg-[#141414] overflow-hidden">
      <div className="  h-full  flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 flex-shrink-0">
          <Header />
        </div>

        {/* Scrollable Content - flex-1 to take remaining space */}
        <div className="flex-1 w-full overflow-y-auto p-6">
          <WelcomeCard userName={user?.username} />

          {/* Stats Grid - responsive columns */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                cardTitle={stat.title}
                icon={stat.icon}
                cardText={stat.value}
              />
            ))}
          </div>

          {/* Latest from playlist - responsive columns */}


            <div className="mt-8">
            <h2 className="Manrope-SemiBold text-lg text-white">Latest From Your Playlist</h2>
            {playlists && playlists.length> 0 && (
               <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
              {playlists?.map((playlist) => (
                <UpdateCard
                  key={playlist.id}
                  playlist={playlist}
                />
              ))}
              </div>
            )}
            {loadingPlaylist && (
              <div className="col-span-4 flex justify-center py-8">
                <Loader2 className="animate-spin text-[#E50000]" size={32}/>
              </div>
            )}
          </div>


          {/* Recommendations - responsive columns */}
          <div className="mt-8">
            <h2 className="Manrope-SemiBold text-lg text-white">Recommendations</h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
              {loading ? (
                <div className="col-span-4 flex justify-center py-8">
                  <Loader2 className="animate-spin text-[#E50000]" size={32}/>
                </div>
              ) : (
                movies?.slice(0, 4).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showRating={true}
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