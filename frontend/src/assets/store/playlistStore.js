import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
axios.defaults.timeout = 10000; 
axios.defaults.withCredentials = true;

const initialState = {
  playlists: [],
  loadingPlaylist: false,
  success: false,
  errorMsg: null,
};

const playlistBaseUrl = import.meta.env.VITE_PLAYLIST_BASE_URL;

export const usePlaylistStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ✅ Reset the entire store
      resetPlaylist: () => set({ ...initialState }),
      fetchAllPlaylist: async (userId, force = false) => {
        const { playlists } = get();
        if (!force && playlists && playlists.length > 0) return;
        set({ ...initialState, loadingPlaylist: true });
        try {
          const { data } = await axios.get(`${playlistBaseUrl}/get-userPlaylist/${userId}`);
          set({
            playlists: Array.isArray(data.playlists) ? data.playlists : [],
            loadingPlaylist: false,
            success: true,
            errorMsg: null,
          });
        } catch (error) {
          console.error('Fetch playlists error:', error.message);
          set({
            success: false,
            loadingPlaylist: false,
            errorMsg: error.message || 'Something went wrong',
          });
        }
      },

      // ✅ Create new playlist
      createPlaylist: async (playlistObj) => {
        set({ loadingPlaylist: true, success: false });

        try {
          const { data } = await axios.post(`${playlistBaseUrl}/create-playlist`, playlistObj);
          const current = get().playlists || [];

          set({
            playlists: [...current, data.playlist],
            loadingPlaylist: false,
            success: true,
            errorMsg: null,
          });
          await get().fetchAllPlaylist(data.playlist.userId, true);
        } catch (error) {
          console.error('Create playlist error:', error.message);
          set({
            success: false,
            loadingPlaylist: false,
            errorMsg: error.message || 'Could not create playlist',
          });
        }
      },

      // ✅ Remove a movie from a playlist
      removeMovieFromPlaylist: async (playlistId, movieId, userId) => {
        set({ loadingPlaylist: true, success: false });

        try {
          const { data } = await axios.delete(`${playlistBaseUrl}/remove-movie/${playlistId}/${userId}/${movieId}`);

          set({
            playlists: Array.isArray(data.playlist) ? data.playlist : [],
            loadingPlaylist: false,
            success: true,
            errorMsg: null,
          });

        } catch (error) {
          console.error('Remove movie error:', error.message);
          set({
            success: false,
            loadingPlaylist: false,
            errorMsg: error.message || 'Could not remove movie',
          });
        }
      },
      deletePlaylist: async(playlistId, userId) =>{
        set({loadingPlaylist: true, success:false})
        try {
            const { data } = await axios.delete(`${playlistBaseUrl}/delete-playlist/${playlistId}/${userId}`)
            set({
              loadingPlaylist:false,
              success:true,
              playlists: Array.isArray(data.playlist) ? data.playlist : [],
              errorMsg:null
            })
        } catch (error) {
          console.log(error?.response?.data?.message || error.message)
          set({errorMsg: error?.response?.data?.message})
        }
      }
    }),

    {
      name: 'playlist-store', // name in localStorage

    }
  )
);
