import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Heart, HeartOff, Loader2, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MovieCard from "../components/Cards/MovieCard";
import { useFavStore } from "../store/favoriteStore";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { useMovieStore } from "../store/movieStore";
import { useNavigate } from "react-router-dom";

const FavoritePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Store hooks
  const { user, authenticated } = useAuthStore();
  const {
    fetchUserFav,
    removeFromFavorite,
    favorite,
    loadingFavorite,
    favErrorMsg,
  } = useFavStore();
  const { movies } = useMovieStore();

  // Fetch favorites when user changes or component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      if (authenticated && user?._id) {
        try {
          await fetchUserFav(user._id);
        } catch (error) {
          console.error("Error fetching favorites:", error);
          toast.error(favErrorMsg || "Failed to load favorites");
        }
      }
    };

    fetchFavorites();
  }, [authenticated, user?._id, fetchUserFav, favErrorMsg]);

  // Remove movie from favorites
  const removeMovieFromFavorite = useCallback(async (userId, movieId) => {
    if (!userId || !movieId) {
      toast.error("Invalid request");
      return;
    }

    const toastId = toast.loading("Removing from favorites...");

    try {
      await removeFromFavorite(userId, movieId);
      toast.success("Movie removed from favorites", { id: toastId });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error(error.message || "Failed to remove from favorites", { id: toastId });
    }
  }, [removeFromFavorite]);

  // Get favorite movies list
  const favoriteMovies = useMemo(() => {
    if (!movies?.length || !favorite?.length) return [];

    // Convert favorite IDs to strings for comparison
    const favoriteIds = favorite.map(id => String(id));

    return movies.filter(movie =>
      movie?.tmdbId && favoriteIds.includes(String(movie.tmdbId))
    );
  }, [movies, favorite]);

  // Filter favorites based on search query
  const filteredFavorites = useMemo(() => {
    if (!favoriteMovies.length) return [];
    if (!searchQuery.trim()) return favoriteMovies;

    return favoriteMovies.filter(movie =>
      movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [favoriteMovies, searchQuery]);

  // Handle movie click
  const handleMovieClick = useCallback((tmdbId) => {
    navigate(`/discover/movie/${tmdbId}`);
  }, [navigate]);

  // Handle remove click
  const handleRemoveClick = useCallback(async (e, movieId) => {
    e.stopPropagation(); // Prevent triggering the movie card click
    if (user?._id) {
      await removeMovieFromFavorite(user._id, movieId);
    }
  }, [user?._id, removeMovieFromFavorite]);

  // Loading state
  if (loadingFavorite) {
    return (
      <section className="flex h-screen bg-[#141414] overflow-hidden">
        <div className="h-full flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="animate-spin text-[#E50000]" size={35} />
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-screen bg-[#141414] overflow-hidden">
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 w-full scrollbar-none overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Your Favorites
                </h1>
                <p className="text-gray-400">
                  {favorite?.length || 0}{" "}
                  {(favorite?.length || 0) === 1 ? "movie" : "movies"} saved
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#262626] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#E50000] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search favorites"
                />
              </div>
            </div>

            {/* Error State */}
            {favErrorMsg && (
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">{favErrorMsg}</div>
                <button
                  onClick={() => user?._id && fetchUserFav(user._id)}
                  className="px-4 py-2 bg-[#E50000] rounded-md hover:bg-[#FF1919] transition text-white"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Content */}
            {!favErrorMsg && (
              <>
                {filteredFavorites.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {filteredFavorites.map((movie) => (
                      <div key={movie.tmdbId} className="relative group">
                        <MovieCard
                          movie={movie}
                          onClick={() => handleMovieClick(movie.tmdbId)}
                        />
                        <button
                          onClick={(e) => handleRemoveClick(e, movie.tmdbId)}
                          className="absolute top-2 right-2 p-2 bg-[#1A1A1A]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#E50000]/80"
                          aria-label="Remove from favorites"
                        >
                          <HeartOff className="text-[#E50000] group-hover:text-white" size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    {searchQuery ? (
                      <>
                        <Search size={48} className="text-gray-500 mb-4" />
                        <h3 className="text-xl font-medium text-white">
                          No matches found
                        </h3>
                        <p className="text-gray-400 mt-2">
                          We couldn't find any favorites matching "{searchQuery}"
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mt-4 px-4 py-2 text-[#E50000] hover:underline"
                        >
                          Clear search
                        </button>
                      </>
                    ) : (
                      <>
                        <Heart size={48} className="text-gray-500 mb-4" />
                        <h3 className="text-xl font-medium text-white">
                          No favorites yet
                        </h3>
                        <p className="text-gray-400 mt-2">
                          Movies you mark as favorite will appear here
                        </p>
                        <button
                          onClick={() => navigate("/movies")}
                          className="mt-4 px-4 py-2 bg-[#E50000] rounded-md hover:bg-[#FF1919] transition text-white"
                        >
                          Browse Movies
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavoritePage;