import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input on mount
  useEffect(() => {
    inputRef.current.focus();
    // Load recent searches from localStorage
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(savedSearches);
  }, []);

  // Search function (mock API call)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_MOVIE_BASE_URL}/search?query=${query.trim()}`)
        setResults(data.result)
        setIsLoading(false)
        const updatedSearches = [
        query,
        ...recentSearches.filter(item => item !== query).slice(0, 4)
      ];
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

      setIsLoading(false);
    } catch (error) {
      console.log(error.message)
      setIsLoading(false);
      const errorMsg = error.response?.data?.message
      toast.error(errorMsg)
    }


  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current.focus();
  };

  const handleResultClick = (result) => {
    navigate(`/movies/${result.id}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" absolute fixed inset-0 z-50 bg-[#141414]/95 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="max-w-2xl mx-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-white p-2"
          aria-label="Close search"
        >
          <X size={24} />
        </button>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mt-12 mb-8">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full bg-[#262626] Manrope-Regular text-white text-lg p-4 pl-12 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50000]"
            />
            <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>

        {/* Content */}
        <div className="bg-[#1A1A1A] max-h-80 rounded-lg overflow-x-auto scrollbar-none">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 Manrope-Regular">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <h3 className="px-4 py-3 text-gray-400 Manrope-Bold border-b border-[#262626]">
                Search Results
              </h3>
              <ul>
                {results.map((result) => (
                  <motion.li
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-4 py-3 hover:bg-[#262626] flex justify-between items-center"
                    >
                      <div className='flex justify-between w-full '>
                        <span className="font-medium Manrope-SemiBold text-white">{result.title}</span>
                      <div className='w-12 h-12 overflow-hidden '>
                        <img className='w-full h-full object-cover' src={`https://image.tmdb.org/t/p/w500${result.poster_path}`} alt="" />
                      </div>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <>
                  <h3 className="px-4 py-3 Manrope-SemiBold text-gray-400 border-b border-[#262626]">
                    Recent Searches
                  </h3>
                  <ul>
                    {recentSearches.map((search, index) => (
                      <li key={index}>
                        <button
                          onClick={() => {
                            setQuery(search);
                            inputRef.current.focus();
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-[#262626] flex items-center gap-3"
                        >
                          <Clock size={16} className="text-gray-500" />
                          <span className='text-gray-400 Manrope-Regular'>{search}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>

        {/* Empty State */}
        {!isLoading && results.length === 0 && recentSearches.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            Search for movies
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchModal;