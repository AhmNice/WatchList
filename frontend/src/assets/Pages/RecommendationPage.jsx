import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MovieCard from '../components/Cards/MovieCard';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRecommendationStore } from '../store/recommendationStore';
import { Loader2 } from 'lucide-react';

const RecommendationPage = () => {
  const { user, authenticated } = useAuthStore();
  const {
    fetchRecommendations,
    coldStartRecommendation,
    collaborativeRecommendation,
    contentBasedRecommendation,
    loadingRecommendation,
    errorMsg
  } = useRecommendationStore();

  const [activeTab, setActiveTab] = useState('coldStart');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    document.title = 'Recommendation - WatchList';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id && authenticated) {
        try {
          await fetchRecommendations(user._id);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        } finally {
          setInitialLoad(false);
        }
      }
    };

    fetchData();
  }, [user?._id, authenticated]);

  const renderRecommendations = (movies) => {
    if (!movies || movies.length === 0) {
      return (
        <div className="text-gray-400 text-center py-10">
          No recommendations available in this category.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id || movie.movieId} movie={movie} />
        ))}
      </div>
    );
  };

  const getActiveRecommendations = () => {
    switch (activeTab) {
      case 'coldStart':
        return coldStartRecommendation;
      case 'collaborative':
        return collaborativeRecommendation;
      case 'contentBased':
        return contentBasedRecommendation;
      default:
        return [];
    }
  };

  if (initialLoad) {
    return (
      <section className="flex h-screen bg-[#141414] overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#E50000]" size={48} />
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
        <div className="h-16 flex-shrink-0">
          <Header />
        </div>

        <div className="flex-1 w-full scrollbar-none overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Recommended For You</h1>

          {/* Custom Tabs Implementation */}
          <div className="mb-6">
            <div className="flex border-b border-gray-700">
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'coldStart' ? 'text-white border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('coldStart')}
              >
                For You
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'collaborative' ? 'text-white border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('collaborative')}
              >
                Similar Users
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'contentBased' ? 'text-white border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('contentBased')}
              >
                Similar Content
              </button>
            </div>
          </div>

          {errorMsg ? (
            <div className="text-red-500 text-center py-10">
              Error loading recommendations: {errorMsg}
              <button
                onClick={() => window.location.reload()}
                className="ml-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="mt-6">
              {renderRecommendations(getActiveRecommendations())}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendationPage;