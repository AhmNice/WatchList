import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Play, Plus, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMovieStore } from '../store/movieStore';
import { useAuthStore } from '../store/authStore';
import { movieGenres } from '../util/genre';
import AddToPlaylistModal from './modals/AddToPlaylistModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import MovieCard from './Cards/MovieCard';
import { useFavStore } from '../store/favoriteStore';

// Extracted components for better readability
const ReviewCard = ({ review }) => (
  <div className="bg-[#1A1A1A] p-4 rounded-lg">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-full Manrope-SemiBold bg-[#E50000] flex items-center justify-center text-white">
        {review.addedBy?.username?.charAt(0) || 'U'}
      </div>
      <div>
        <h4 className="font-medium text-white Manrope-SemiBold">
          {review?.addedBy?.username || 'Anonymous'}
        </h4>
      </div>
    </div>
    <p className="text-gray-300 text-sm Manrope-Regular">{review.reviewText}</p>
  </div>
);

const CastCard = ({ cast }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-[#1A1A1A] rounded-lg overflow-hidden group">
    <div className="relative aspect-[2/3]">
      {cast.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
          alt={cast.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-[#262626] flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )}
    </div>
    <div className="p-2 sm:p-3">
      <h3 className="font-medium text-white text-xs sm:text-sm truncate">{cast.name}</h3>
      <p className="text-gray-400 text-xs truncate">{cast.character}</p>
    </div>
  </motion.div>
);

const CrewCard = ({ crew }) => (
  <div className="bg-[#1A1A1A] p-2 sm:p-3 rounded-lg">
    <h3 className="font-medium text-white text-xs sm:text-sm">{crew.name}</h3>
    <p className="text-gray-400 text-xs">{crew.job}</p>
  </div>
);

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="w-full h-screen flex justify-center items-center bg-[#141414]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50000]"></div>
  </div>
);

const MovieDetails = ({ containerRef, location = 'movie' }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  // Store hooks
  const { movies, fetchMovieDetails } = useMovieStore();
  const { authenticated, user } = useAuthStore();
  const { addMovieToFavorite, favorite } = useFavStore();
console.log("Favorite List:", favorite);
  // State management
  const [movieDetails, setMovieDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  // Check if movie is favorited
  const isFavorited = useMemo(() => {
    if (!movieDetails || !favorite.length) return false;
    return favorite.some(fav => String(fav) === String(movieDetails.tmdbId));
  }, [movieDetails, favorite]);

  // Get genre objects
  const genreObjects = useMemo(() => {
    if (!movieDetails?.genre_ids) return [];
    return movieDetails.genre_ids
      .map(id => movieGenres.find(g => g.id === id))
      .filter(Boolean);
  }, [movieDetails?.genre_ids]);

  // Get recommendations based on genres
  const recommendations = useMemo(() => {
    if (!movies.length || !movieDetails?.genre_ids) return [];
    return movies.filter(movie =>
      String(movie.tmdbId) !== String(movieDetails.tmdbId) &&
      movie.genre_ids?.some(genre => movieDetails.genre_ids.includes(genre))
    );
  }, [movies, movieDetails]);

  // Scroll to top when movie changes
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [movieId, containerRef]);

  // Fetch movie details
  useEffect(() => {
    const fetchDetails = async () => {
      const foundMovie = movies.find(movie => String(movie.tmdbId) === String(movieId));

      if (foundMovie) {
        setMovieDetails(foundMovie);
        return;
      }

      try {
        setIsLoading(true);
        const details = await fetchMovieDetails(movieId);
        setMovieDetails(details);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        toast.error('Failed to load movie details');
        setMovieDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchDetails();
    }
  }, [movieId, movies, fetchMovieDetails]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!movieId) return;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_MOVIE_BASE_URL}/review/${movieId}?page=1&limit=10`
        );
        setReviews(data?.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [movieId, reviewRefreshTrigger]);

  // Handle add to favorites
  const handleAddToFav = useCallback(async () => {
    if (!authenticated) {
      toast.error('Please login to add to favorites');
      return;
    }

    if (!user?._id || !movieId) return;

    const toastId = toast.loading('Adding to favorites...');

    try {
      const response = await addMovieToFavorite(user._id, { movieId });

      if (response.success) {
        toast.success('Movie added to favorites', { id: toastId });
      } else {
        toast.error(response.error || 'Failed to add to favorites', { id: toastId });
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error(error.message || 'Failed to add to favorites', { id: toastId });
    }
  }, [authenticated, user?._id, movieId, addMovieToFavorite]);

  // Handle add to playlist
  const handleAddToPlaylist = useCallback(() => {
    if (!authenticated) {
      toast.error('Please login to add to playlists');
      return;
    }
    setAddingToPlaylist(true);
  }, [authenticated]);

  // Handle review submission
  const handleReviewSubmit = useCallback(async () => {
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    if (!authenticated) {
      toast.error('Please login to post a review');
      return;
    }

    if (!user?._id || !movieDetails) {
      toast.error('Unable to post review. Please try again.');
      return;
    }

    setIsSubmittingReview(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_MOVIE_BASE_URL}/add-review/${movieId}`,
        {
          review: reviewText,
          userId: user._id,
          movie: [movieDetails],
        }
      );

      toast.success('Review submitted successfully!');
      setReviewText('');
      setReviewRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  }, [reviewText, authenticated, user?._id, movieDetails, movieId]);

  // Handle movie click for recommendations
  const handleMovieClick = useCallback((tmdbId) => {
    const path = location === 'movie'
      ? `/movies/${tmdbId}`
      : `/discover/movie/${tmdbId}`;

    navigate(path);

    setTimeout(() => {
      if (containerRef?.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, [location, navigate, containerRef]);

  // Loading state
  if (isLoading && !movieDetails) {
    return <LoadingSkeleton />;
  }

  // Not found state
  if (!movieDetails) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#141414]">
        <p className="text-white">Movie not found</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-[#141414] pb-12">
      {/* Playlist Modal */}
      {addingToPlaylist && (
        <AddToPlaylistModal
          movieId={movieId}
          onClose={() => setAddingToPlaylist(false)}
        />
      )}

      {/* Hero Section */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] max-h-[800px] overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0">
          {movieDetails.backdrop && (
            <img
              src={movieDetails.backdrop}
              alt={movieDetails.title}
              className="w-full h-full rounded-md object-cover"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
        </div>

        {/* Movie Info */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 h-full flex flex-col justify-end pb-8 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 sm:gap-8"
          >
            {/* Poster */}
            <div className="hidden sm:block w-40 h-60 md:w-64 md:h-96 flex-shrink-0 rounded-lg overflow-hidden shadow-xl">
              <img
                src={movieDetails.poster}
                alt={movieDetails.title}
                className="w-full h-full mt-2 rounded-md object-cover"
                loading="lazy"
              />
            </div>

            {/* Details */}
            <div className="flex-1 md:absolute md:bottom-15 md:left-80 lg:absolute lg:bottom-15 lg:left-80 text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {movieDetails.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500" size={14} />
                  <span>{parseInt(movieDetails.vote)?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{movieDetails.releaseYear}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" />
                  <span>{movieDetails.runtime || 'N/A'} min</span>
                </div>
              </div>

              {/* Genres */}
              {genreObjects.length > 0 && (
                <div className="flex flex-wrap Manrope-Regular gap-2 mb-3 sm:mb-4">
                  {genreObjects.slice(0, 3).map(genre => (
                    <span
                      key={genre.id}
                      className="px-2 py-1 text-xs sm:text-sm bg-[#E50000]/20 text-[#E50000] rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-gray-300 Manrope-Regular text-sm truncate w-full h-auto hover:whitespace-normal sm:w-auto sm:whitespace-normal sm:text-base mb-4 sm:mb-6 max-w-3xl">
                {movieDetails.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {movieDetails.trailer && (
                  <a
                    href={movieDetails.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex Manrope-Regular items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1 sm:py-2 bg-[#E50000] rounded-md hover:bg-[#FF1919] transition"
                  >
                    <Play size={14} />
                    <span>Watch Trailer</span>
                  </a>
                )}

                <button
                  onClick={handleAddToPlaylist}
                  className="flex items-center Manrope-Regular gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-[#262626] rounded-md hover:bg-[#333] transition"
                >
                  <Plus size={14} />
                  <span>Add To Playlist</span>
                </button>

                <button
                  onClick={handleAddToFav}
                  className={`p-1 sm:p-2 rounded-md transition ${
                    isFavorited
                      ? 'bg-[#E50000] text-white'
                      : 'bg-[#262626] hover:bg-[#333]'
                  }`}
                >
                  <Heart size={14} className={isFavorited ? 'fill-current' : ''} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Cast Section */}
            {movieDetails.cast?.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  Cast
                </h2>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
                  {movieDetails.cast.slice(0, 10).map((castMember) => (
                    <CastCard key={castMember.id} cast={castMember} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Crew Section */}
            {movieDetails.crew?.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  Crew
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {movieDetails.crew.slice(0, 8).map((crewMember) => (
                    <CrewCard key={crewMember.id} crew={crewMember} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Add Review Form */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl Manrope-Bold text-white mb-3 sm:mb-4">
                Post Review
              </h2>

              {authenticated ? (
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full bg-[#262626] border border-[#333] rounded-md p-3 text-white mb-3 text-sm sm:text-base"
                    rows="3"
                    disabled={isSubmittingReview}
                  />
                  <button
                    onClick={handleReviewSubmit}
                    disabled={isSubmittingReview || !reviewText.trim()}
                    className="px-4 py-2 bg-[#E50000] rounded-md hover:bg-[#FF1919] text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isSubmittingReview ? 'Posting...' : 'Post Review'}
                  </button>
                </div>
              ) : (
                <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
                  <p className="text-gray-300">
                    Please <button onClick={() => navigate('/login')} className="text-[#E50000] hover:underline">login</button> to post a review
                  </p>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  More Like This
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recommendations.slice(0, 4).map((rec) => (
                    <MovieCard
                      key={rec.tmdbId}
                      movie={rec}
                      onClick={() => handleMovieClick(rec.tmdbId)}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-1">
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Reviews ({reviews.length})
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <ReviewCard key={review._id || index} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-center py-3 Manrope-Regular text-gray-300">
                  No reviews yet. Be the first to post a review!
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetails;