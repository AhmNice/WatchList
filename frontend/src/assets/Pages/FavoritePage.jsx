import React, { useState, useEffect } from 'react';
import { Heart, HeartOff, Loader2, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MovieCard from '../components/Cards/MovieCard';
import { useFavStore } from '../store/favoriteStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { useMovieStore } from '../store/movieStore';

const FavoritePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, authenticated } = useAuthStore();
  const {
    fetchUserFav,
    removeFromFavorite,
    favorite,
    loadingFavorite,
    favErrorMsg
  } = useFavStore();
  const { movies } = useMovieStore()

  // Fetch favorites when user changes or component mounts
  useEffect(() => {
  const fetchFavorites = async () => {
    if (authenticated && user?._id) {
      try {
        const data = await fetchUserFav(user._id);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error(favErrorMsg || 'Failed to load favorites');
      }
    }
  };

  fetchFavorites();
}, [authenticated, user?._id]);

const removeMovieFromFavorite = async(userId, movieId)=>{
  const processing = toast.loading('Deleting from favorite')
  const payload={
    movieId: movieId
  }
  try {
    await removeFromFavorite(userId, movieId)
    toast.success('Movie Removed from favorite', { id: processing})
  } catch (error) {
    console.log(error.message)
    toast.error(error.message, {id:processing})
  }
}
  // Filter favorites based on search query
  console.log(favorite.movies)
const favoriteMovies = movies?.filter((movie) =>
  Array.isArray(favorite) && favorite.includes(String(movie?.tmdbId))
);

const filteredFavorites = favoriteMovies.filter((fav)=>
  fav.title.toLowerCase().includes(searchQuery.toLowerCase())
)

console.log(filteredFavorites)
  return (
    <section className="flex h-screen bg-[#141414] overflow-hidden">
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 flex-shrink-0">
          <Header />
        </div>

        <div className="flex-1 w-full scrollbar-none overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Favorites</h1>
                <p className="text-gray-400">
                  {favorite?.length} {favorite?.length === 1 ? 'movie' : 'movies'} saved
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#262626] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#E50000] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Content */}
            {loadingFavorite ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className='animate-spin text-[#E50000]' size={35} />
              </div>
            ) : favErrorMsg ? (
              <div className="text-center py-16 text-red-500">
                {favErrorMsg}
              </div>
            ) : filteredFavorites?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredFavorites.map((movie) => (
                  <div key={ movie.tmdbId} className="relative group">
                    <MovieCard movie={movie} />
                    <button
                      onClick={async() => {
                        await removeMovieFromFavorite(user._id,  movie.tmdbId)
                      }
                      }
                      className="absolute top-2 right-2 p-2 bg-[#1A1A1A]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove from favorites"
                    >
                      <HeartOff className="text-[#E50000]" size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                {searchQuery ? (
                  <>
                    <Search size={48} className="text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium text-white">No matches found</h3>
                    <p className="text-gray-400 mt-2">
                      We couldn't find any favorites matching "{searchQuery}"
                    </p>
                  </>
                ) : (
                  <>
                    <Heart size={48} className="text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium text-white">No favorites yet</h3>
                    <p className="text-gray-400 mt-2">
                      Movies you mark as favorite will appear here
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavoritePage;