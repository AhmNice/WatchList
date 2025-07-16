import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Play, Plus, Bookmark, Share2, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMovieStore } from '../store/movieStore';
import { useAuthStore } from '../store/authStore';
import { movieGenres } from '../util/genre';
import AddToPlaylistModal from './modals/AddToPlaylistModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import MovieCard from './Cards/MovieCard';
import { useFavStore } from '../store/favoriteStore';

const MovieDetails = ({ containerRef, location = 'movie' }) => {
  const { movieId } = useParams();
  const { movies, fetchMovieDetails } = useMovieStore();
  const { authenticated, user } = useAuthStore();
  const [reviewText, setReviewText] = useState('');
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState()
  const [movieDetails, setMovieDetails] = useState(null);
  const navigate = useNavigate()
  const { addMovieToFavorite,loadingFavorite } = useFavStore()
  useEffect(() => {
    // Scroll to top when component mounts
    if (containerRef?.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [movieId]); // Trigger when movieId changes
  // Find movie in store or fetch details
  useEffect(() => {
    const foundMovie = movies.find(movie => String(movie.tmdbId) === String(movieId));
    if (foundMovie) {
      setMovieDetails(foundMovie);
      console.log(foundMovie)
    } else {
      const fetchDetails = async () => {
        try {
          setIsLoading(true);
          const details = await fetchMovieDetails(movieId);
          setMovieDetails(details);
        } catch (error) {
          console.error('Error fetching movie details:', error);
          toast.error('Failed to load movie details');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [movieId, movies, fetchMovieDetails]);
  useEffect(() => {
    const { data } = axios.get()
  }, [])
  const handleAddToFav = async( movieId) =>{
    const payload ={
      movieId: movieId
    }
    const processing = toast.loading('Adding to favorite')
    try {
        await addMovieToFavorite( user._id, payload)
        toast.success('Movie added to favorite', {id: processing})
    } catch (error) {
      console.log(error.message)
      toast.error(error.message, {id:processing})
    }
  }
  const genreObjects = movieDetails?.genre_ids?.map(id =>
    movieGenres.find(g => g.id === id)
  ) || [];

  const recommendations = movies.filter(movie =>
    String(movie.tmdbId) !== String(movieDetails?.tmdbId) &&
    movie.genre_ids.some(genre => movieDetails?.genre_ids.includes(genre))
  );

  const handleAddToPlaylist = () => {
    if (!authenticated) {
      toast.error('Please login to add to playlists');
      return;
    }
    setAddingToPlaylist(true);
  };

  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  // Fetch reviews only when movieId or trigger changes
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_MOVIE_BASE_URL}/review/${movieId}?page=1&limit=10`);
        setReviews(data?.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReview();
  }, [movieId, reviewRefreshTrigger]);

  // Then, after a successful review submit:
  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_MOVIE_BASE_URL}/add-review/${movieId}`
        ,
        {
          review: reviewText,
          userId: user._id,
          movie: [movieDetails],
        }
      );

      toast.success('Review submitted!');
      setReviewText('');


      // 🔁 Trigger review refetch
      setReviewRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading && !movieDetails) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#141414]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50000]"></div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#141414]">
        <p className="text-white">Movie not found</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-[#141414] pb-12">
      {addingToPlaylist && (
        <AddToPlaylistModal
          movieId={movieId}
          onClose={() => setAddingToPlaylist(false)}
        />
      )}

      {/* Hero Section */}
      <div className="relative w-full  h-[50vh] sm:h-[60vh] md:h-[70vh] max-h-[800px] overflow-hidden">
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
                className="w-full h-full  mt-2 rounded-md object-cover"
                loading="lazy"
              />
            </div>

            {/* Details */}
            <div className="flex-1 md:absolute md:bottom-15 md:left-80 lg:absolute lg:bottom-15 lg:left-80 text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{movieDetails.title}</h1>

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
              <p className="text-gray-300 Manrope-Regular text-sm truncate w-full h-auto hover:whitespace-normal sm:w-auto sm:whitespace-normal  sm:text-base mb-4 sm:mb-6 max-w-3xl">
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
                  <span>Add To playlist</span>
                </button>
                <button
                onClick={(e)=>{
                  e.stopPropagation()
                  handleAddToFav(movieId, user._id)
                }}
                className="p-1 sm:p-2 bg-[#262626] rounded-md hover:bg-[#333] transition">
                  <Heart size={14} />
                </button>
                {/* <button className="p-1 sm:p-2 bg-[#262626] rounded-md hover:bg-[#333] transition">
                  <Share2 size={14} />
                </button> */}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Cast & Crew */}
          <div className="lg:col-span-2">
            {/* Cast Section */}
            {movieDetails.cast?.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Cast</h2>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
                  {movieDetails.cast.slice(0, 10).map((cast) => (
                    <CastCard key={cast.id} cast={cast} />
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
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Crew</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {movieDetails.crew.slice(0, 8).map((crew) => (
                    <CrewCard key={crew.id} crew={crew} />
                  ))}
                </div>
              </motion.section>
            )}
            {/* Add Review Form */}
            <h2 className="text-xl sm:text-2xl  Manrope-Bold text-white mb-3 sm:mb-4">Post Review</h2>

            {authenticated && (
              <div className="bg-[#1A1A1A] p-4 rounded-lg">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full bg-[#262626] border border-[#333] rounded-md p-3 text-white mb-3 text-sm sm:text-base"
                  rows="3"
                  disabled={isLoading}
                />
                <button
                  onClick={handleReviewSubmit}
                  disabled={isLoading || !reviewText.trim()}
                  className="px-4 py-2 bg-[#E50000] rounded-md hover:bg-[#FF1919] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            )}

            {/* Recommendations */}
            {recommendations?.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6 sm:mb-8 "
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white my-4 mb-3 sm:mb-4">More Like This</h2>
                <div className="space-y-3 sm:space-y-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recommendations.slice(0, 4).map((rec) => (
                    <MovieCard
                      key={rec.tmdbId}
                      movie={rec}
                      onClick={() => {
                        // Navigate first
                        navigate(location === 'movie' ? `/movies/${rec.tmdbId}` : `/discover/movie/${rec.tmdbId}`);

                        // Then scroll to top after a small delay to ensure navigation happens
                        setTimeout(() => {
                          if (containerRef?.current) {
                            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }, 100);
                      }}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Column - Recommendations/Comments */}
          <div className="lg:col-span-1">


            {/* Reviews Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Reviews</h2>

              {/* Existing Reviews */}
              {reviews?.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))}
                </div>
              ) : (
                <div className='text-sm text-center py-3 Manrope-Regular text-gray-300'>
                  No review yet be the first to post a review
                </div>
              )}


            </motion.section>
          </div>
        </div>
      </div>
    </section>
  );
};

// Component for displaying individual reviews
const ReviewCard = ({ review }) => {
  return (
    <div className="bg-[#1A1A1A] p-4 rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full Manrope-SemiBold bg-[#E50000] flex items-center justify-center text-white">
          {review.addedBy?.username?.charAt(0) || 'U'}
        </div>
        <div>
          <h4 className="font-medium text-white Manrope-SemiBold">{review?.addedBy?.username || 'Anonymous'}</h4>
        </div>
      </div>
      <p className="text-gray-300 text-sm Manrope-Regular">{review.reviewText}</p>
    </div>
  );
};

const CastCard = ({ cast }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#1A1A1A] rounded-lg overflow-hidden group"
    >
      <div className="relative aspect-[2/3]">
        {cast.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
            alt={cast.name}
            className="w-full h-full object-cover"
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
  )
}

const CrewCard = ({ crew }) => {
  return (
    <div className="bg-[#1A1A1A] p-2 sm:p-3 rounded-lg">
      <h3 className="font-medium text-white text-xs sm:text-sm">{crew.name}</h3>
      <p className="text-gray-400 text-xs">{crew.job}</p>
    </div>
  )
}



export default MovieDetails