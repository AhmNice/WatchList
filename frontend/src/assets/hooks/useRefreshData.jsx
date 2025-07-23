import { useEffect } from 'react';
import { useMovieStore } from '../store/movieStore';
import { usePlaylistStore } from '../store/playlistStore';
import { useAuthStore } from '../store/authStore'
const useAutoRefreshData = () => {
  const { getAllMovie } = useMovieStore();
  const { fetchUserPlaylists } = usePlaylistStore();
  const { user } = useAuthStore()

  const refreshInterval = 10 * 60 * 1000; // 10 minutes

  useEffect(() => {
    // Initial fetch on mount
    getAllMovie(true);
    fetchUserPlaylists(user?._id, true);

    const interval = setInterval(() => {
      try {
        getAllMovie();
        fetchUserPlaylists();
      } catch (error) {
        console.error('Auto-refresh error:', error.message);
      }
    }, refreshInterval);

    // ✅ Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [getAllMovie, fetchUserPlaylists]);
};

export default useAutoRefreshData;
