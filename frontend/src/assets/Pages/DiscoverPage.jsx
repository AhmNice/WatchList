import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useMovieStore } from '../store/movieStore';
import { useEffect } from 'react';
import { useState } from 'react';
import MovieCard from '../components/Cards/MovieCard';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const DiscoverPage = () => {
  const { movies, getAllMovie, loading, error } = useMovieStore();
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 20;
  const [filteredMovies, setFilteredMovies] = React.useState([])
  const [ optionToShow, setOptionToShow ] = useState()
  const [ movieToAdd, setMovieTo ] = useState(null)
  const [whereToAdd, setWhereToAdd ] = useState(null)
  const onWatchLater = (movie)=>{
    setMovieTo(movie)
    setWhereToAdd('Watch Later')
  }
  const AddToPlaylist = (movie)=>{
    setMovieTo(movie)
  }
  useEffect(() => {
    document.title = 'WatchList - Discover';
    if (!movies || movies.length === 0) {
      getAllMovie();
    }
  }, [])
  useEffect(() => {
    if (movies) {
      setFilteredMovies(movies.filter(movie => movie.poster && movie.title && movie.releaseYear))

    }
  }, [movies])
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
  const currentMovies = movies?.slice(indexOfFirstMovie, indexOfLastMovie)
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  return (
    <section className="w-full h-screen flex bg-[#141414] overflow-auto">
      <div className=" h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-full flex flex-col overflow-auto">
        <div className="h-16 flex-shrink-0">
          <Header />
        </div>

        {/* Scrollable Content */}
        <div className=" overflow-y-auto p-6  scrollbar-none">
          <div className="flex justify-between items-center">
            <h2 className="Manrope-SemiBold pb-4 text-md text-white  ">
              All Movies
            </h2>
          </div>
          <div className="">
            {loading && (
              <div className='flex items-center justify-center h-96'>
                <Loader2 className='text-[#E50000] animate-spin' size={24} />
              </div>
            )}
            {currentMovies?.length > 0 ? (
              <>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
                  {currentMovies.map((movie, index) => (
                    <MovieCard
                      movie={movie}
                      key={`movie-${index}`}
                      showMenu={true}
                      showOption = { index === optionToShow}
                      onOptionClick={()=>{
                        setOptionToShow( optionToShow === index ? null : index )
                      }}
                      onAddToPlaylist={''}
                      onWatchLater={''}
                    />
                  ))}
                </div>

                {/* pagination */}
                <div className="flex justify-center items-center mt-8 gap-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-[#262626]'}`}
                  >
                    <ChevronLeft size={16} className='text-white ' />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
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
              </>

            ) : null}
          </div>
        </div>
      </div>
    </section>

  )
}

export default DiscoverPage