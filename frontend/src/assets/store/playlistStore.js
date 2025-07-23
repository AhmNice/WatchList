import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
axios.defaults.withCredentials = true;

const initialState = {
  playlists: [],
  allPlaylist:[],
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
      fetchUserPlaylists: async (userId, force = false) => {
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
      fetchAllPlaylist: async(force = false)=>{
        const { allPlaylist } = get()
        if(!force && allPlaylist && allPlaylist.length > 0){
          return
        }
        set({ loadingPlaylist: true, errorMsg: null, success: false})
        try {
          const { data } = await axios.get(`${playlistBaseUrl}/all-playlist`);
          set({
            success:true,
            errorMsg:null,
            allPlaylist: data.playlists
          })
        } catch (error) {
          console.log(error.message)
          set({
            success:false,
            errorMsg:response.error.data.message || error.message
          })
        }finally{
          set({
            loadingPlaylist:false,
          })
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
          await get().fetchUserPlaylists(data.playlist.userId, true);
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
      addMovieToPlaylist: async (playlistId, userId, payload) => {
        set({ loadingPlaylist: true, success: false });
        try {
          const { data } = await axios.patch(`${playlistBaseUrl}/update-playlist/${playlistId}/${userId}`, payload);
          set({
            playlists: Array.isArray(data.playlist) ? data.playlist : [],
            loadingPlaylist: false,
            success: true,
            errorMsg: null
          })
        } catch (error) {
          console.log(error.message)
          set({
            success: false,
            loadingPlaylist: false,
            errorMsg: error.message || 'Could not add movie',
          });
        }
      },
      deletePlaylist: async (playlistId, userId) => {
        set({ loadingPlaylist: true, success: false })
        try {
          const { data } = await axios.delete(`${playlistBaseUrl}/delete-playlist/${playlistId}/${userId}`)
          set({
            loadingPlaylist: false,
            success: true,
            playlists: Array.isArray(data.playlist) ? data.playlist : [],
            errorMsg: null
          })
        } catch (error) {
          console.log(error?.response?.data?.message || error.message)
          set({ errorMsg: error?.response?.data?.message })
        }
      },
      updatePlaylist: async (payload, userId, playlistId) => {
        set({
          loadingPlaylist: true,
          errorMsg: null,
          success: false
        });
        try {
          const { data } = await axios.patch(
            `${playlistBaseUrl}/update-playlist/${playlistId}/${userId}`,
            payload
          );
          // Option 1: Re-fetch all playlists for the user to ensure state is up to date
          await get().fetchUserPlaylists(userId, true);

          set({
            loadingPlaylist: false,
            success: true,
            errorMsg: null
          });
        } catch (error) {
          console.log(error.message);
          set({
            errorMsg: error.response?.data?.message || error.message,
            success: false,
            loadingPlaylist: false
          });
        }
      },
      onJoin: async (playlistShareCode, payload) => {
        set({
          loadingPlaylist: true, success: false, errorMsg: null
        })
        try {
          const { data } = await axios.post(`${playlistBaseUrl}/add-user/${playlistShareCode}`, payload);
          set({
            success: true,
            allPlaylist: Array.isArray(data.playlist) ? data.playlist : [],
            errorMsg: null,
          })
        } catch (error) {
          console.log(error?.response?.data?.message || error.message)
          set({ errorMsg: error?.response?.data?.message })
        } finally {
          set({ loadingPlaylist: false })
        }
      }
    }),

    {
      name: 'playlist-store', // name in localStorage

    }
  )
);
