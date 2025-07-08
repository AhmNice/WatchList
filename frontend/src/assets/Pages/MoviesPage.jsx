import React, { useEffect, useState } from 'react';
import { useMovieStore } from '../store/movieStore';
import MovieCard from '../components/Cards/MovieCard';
import Navbar from '../components/Navbar';
import { ChevronLeft, ChevronRight, Loader2, Search, Sliders } from 'lucide-react';

const MoviesPage = () => {
  const { movies, getAllMovie, loading, error } = useMovieStore();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 20;
  const [activeCard, setActiveCard] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    year: '',
    genre: ''
  });
  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  const [showFilters, setShowFilters] = useState(false);

  // Get all unique genres from movies
  const allGenres = [...new Set(movies?.flatMap(movie => movie.genre_ids || []))]
    .filter(Boolean)
    .map(id => ({ id, name: genreMap[id] }))
    .filter(g => g.name); // Remove unknowns


  // Get all unique years from movies
  const allYears = [...new Set(movies?.map(movie => movie.releaseYear).filter(Boolean))].sort((a, b) => b - a);


  useEffect(() => {
    document.title = 'WatchList - Movies';
    if (!movies || movies.length === 0) {
      getAllMovie();
    }
  }, [movies, getAllMovie]);

  useEffect(() => {
    if (movies) {
      let result = movies.filter(movie =>
        movie.poster && movie.title && movie.releaseYear
      );

      // Apply filters
      if (filters.name) {
        result = result.filter(movie =>
          movie.title.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.year) {
        result = result.filter(movie =>
          movie.releaseYear == (`${filters.year}`)
        );
      }

      if (filters.genre) {
  result = result.filter(movie =>
    movie.genre_ids?.includes(Number(filters.genre))
  );
}


      setFilteredMovies(result);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [movies, filters]);

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ name: '', year: '', genre: '' });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#141414]">
        <Loader2 size={25} className='animate-spin text-[#E50000]' />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#141414]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-[#141414]">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white Manrope-Bold">
            Popular Movies
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#262626] rounded-md text-white hover:bg-[#333]"
          >
            <Sliders size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#262626] mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Name Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search by title"
                  className="w-full pl-10 pr-4 py-2 bg-[#262626] border border-[#333] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#E50000]"
                />
              </div>

              {/* Year Filter */}
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-[#262626] border border-[#333] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#E50000]"
              >
                <option value="">All Years</option>
                {allYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Genre Filter */}
              <select
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-[#262626] border border-[#333] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#E50000]"
              >
                <option value="">All Genres</option>
                {allGenres.map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))}

              </select>
            </div>

            {Object.values(filters).some(Boolean) && (
              <button
                onClick={resetFilters}
                className="mt-4 text-[#E50000] hover:underline text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-gray-400 mb-4">
          Showing {filteredMovies.length} movies
        </div>

        {currentMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {currentMovies.map((movie, index) => (
                <MovieCard
                  key={movie.id || movie._id}
                  movie={movie}
                  showRating={true}
                  showDropDown={activeCard === index}
                  onClick={() => setActiveCard(activeCard === index ? null : index)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-[#262626]'}`}
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`w-10 h-10 rounded-md ${currentPage === pageNumber ? 'bg-[#E50000] text-white' : 'text-white hover:bg-[#262626]'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-[#262626]'}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">No movies found matching your filters</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MoviesPage;