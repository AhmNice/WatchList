import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const initialStates = {
  movies: null,
  loading: false,
  success: false,
  errorMsg: null,
};

const movieBaseURL = import.meta.env.VITE_MOVIE_BASE_URL;

export const useMovieStore = create((set,get) => ({
  ...initialStates,
  getAllMovie: async () => {
    const { movies } = get(); // 👈 Get current state
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
}));
