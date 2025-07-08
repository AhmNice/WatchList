import axios from "axios";
import { create } from "zustand";
import { persist } from 'zustand/middleware';

axios.defaults.withCredentials = true;

const initialStates = {
  movies: [],
  loading: false,
  success: false,
  errorMsg: null,
};

const movieBaseURL = import.meta.env.VITE_MOVIE_BASE_URL;

export const useMovieStore = create(
  persist(
    (set, get) => ({
      ...initialStates,

      getAllMovie: async () => {
        const { movies } = get();
        if (movies && movies.length > 0) return;
        set({ loading: true, success: false, errorMsg: null });
        try {
          const { data } = await axios.get(`${movieBaseURL}/all-movies`);
          set({
            loading: false,
            success: true,
            movies: data.movieList,
          });
        } catch (error) {
          console.error(error.message);
          set({
            loading: false,
            errorMsg:
              error?.response?.data?.message ||
              error.message ||
              "Internal server error",
          });
        }
      },

      resetMovieStore: () => set({ ...initialStates }),
    }),
    {
      name: 'movie-store',
      partialize: (state) => ({
        movies: state.movies,
      }),
    }
  )
);
