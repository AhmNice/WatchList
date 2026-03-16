import axios from "axios";
import { create } from "zustand";
axios.defaults.withCredentials = true
const initialStates = {
  favSuccess: false,
  favorite: [],
  loadingFavorite: false,
  favErrorMsg: null,
}
const favURL = import.meta.env.VITE_FAV_BASE_URL
export const useFavStore = create(
  (set, get) => ({
    ...initialStates,
    fetchUserFav: async (userId) => {
      if (get().favorite && get().favorite.length !== 0) {
        return;
      }

      set({ loadingFavorite: true, favErrorMsg: null, favSuccess: false })
      try {
        const { data } = await axios.get(`${favURL}/get-favorite/${userId}`)
        set({
          loadingFavorite: false,
          favErrorMsg: null,
          favSuccess: true,
          favorite: data.favorites
        })
      } catch (error) {
        console.log(error.message);
        set({
          favSuccess: false,
          favErrorMsg: error?.response?.data?.message
        })
      }
    },
    addMovieToFavorite: async (userId, payload) => {
      set({
        loadingFavorite: true,
        favSuccess: false,
        favErrorMsg: null
      });
      try {
        const { data } = await axios.post(`${favURL}/addMovieToFavorite/${userId}`, payload)
        set({
          loadingFavorite: false,
          favErrorMsg: null,
          favSuccess: true,
          favorite: data.favorites
        })
      } catch (error) {
        console.log(error.message)
        set({
          loadingFavorite: false,
          favErrorMsg: error?.response?.data?.message
        })
      }
    },
    removeFromFavorite: async (userId, movieId) => {
      set({
        favSuccess: false,
        loadingFavorite: true,
        favErrorMsg: null
      });
      try {
        const { data } = await axios.delete(`${favURL}/remove-movie/${movieId}/${userId}`)
        set({
          favSuccess: true,
          loadingFavorite: false,
          favorite: data.favorites
        })
      } catch (error) {
        console.log(error.message)
        set({
          favSuccess: false,
          loadingFavorite: false,
          favErrorMsg: error?.response?.data?.message
        })
      }
    },
    resetState: () => set({ ...initialStates })
  })
)