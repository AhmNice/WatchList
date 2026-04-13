import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const initialStates = {
  stats: {
    totalPlaylists: 0,
    totalFavoriteMovies: 0,
    totalMoviesInPlaylists: 0,
    totalMoviesOverall: 0,
    totalRuntimeMinutes: 0,
    totalWatchTimeHours: 0,
  },
  loadingStats: false,
  statsSuccess: false,
  statsErrorMsg: null,
};

const statBaseUrl = import.meta.env.VITE_STAT_BASE_URL;

export const useStatStore = create((set) => ({
  ...initialStates,

  fetchUserStats: async (userId) => {
    if (!userId) {
      set({
        statsErrorMsg: "User ID is required",
        statsSuccess: false,
      });
      return;
    }

    set({ loadingStats: true, statsSuccess: false, statsErrorMsg: null });

    try {
      const { data } = await axios.get(`${statBaseUrl}/user/${userId}`);
      set({
        stats: data?.stats || initialStates.stats,
        loadingStats: false,
        statsSuccess: true,
        statsErrorMsg: null,
      });
    } catch (error) {
      set({
        loadingStats: false,
        statsSuccess: false,
        statsErrorMsg: error?.response?.data?.message || error.message,
      });
    }
  },

  resetStats: () => set({ ...initialStates }),
}));
