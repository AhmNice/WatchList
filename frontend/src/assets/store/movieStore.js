import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

axios.defaults.withCredentials = true;

const initialStates = {
  movies: [],
  loading: false,
  success: false,
  errorMsg: null,
  lastFetched: null,
};

const movieBaseURL = import.meta.env.VITE_MOVIE_BASE_URL;

export const useMovieStore = create(
  persist(
    (set, get) => ({
      ...initialStates,

      getAllMovie: async (force = false) => {
        const { movies, lastFetched } = get();

        // Check if we should use cached data
        const shouldUseCache = !force &&
          movies &&
          movies.length > 0 &&
          lastFetched &&
          (Date.now() - lastFetched < 5 * 60 * 1000); // Cache for 5 minutes

        if (shouldUseCache) {
          console.log("Using cached movie data");
          return;
        }

        set({ loading: true, success: false, errorMsg: null });
        try {
          const { data } = await axios.get(`${movieBaseURL}/all-movies`);
          set({
            loading: false,
            success: true,
            movies: data.movieList,
            lastFetched: Date.now(),
          });
        } catch (error) {
          console.error(error?.response?.data?.message || error.message);
          set({
            loading: false,
            errorMsg:
              error?.response?.data?.message ||
              error.message ||
              "Internal server error",
          });
        }
      },

      // Manually clear persisted data
      clearPersistedData: () => {
        set({ ...initialStates });
        localStorage.removeItem("movie-storage"); // Remove from localStorage
      },

      // Force refresh data
      refreshMovies: async () => {
        await get().getAllMovie(true);
      },

      resetMovieStore: () => set({ ...initialStates }),
    }),
    {
      name: "movie-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        movies: state.movies,
        lastFetched: state.lastFetched,

      }),
    }
  )
);