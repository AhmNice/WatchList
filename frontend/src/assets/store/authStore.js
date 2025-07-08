import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePlaylistStore } from './playlistStore';

axios.defaults.withCredentials = true;

const initialStates = {
  success: false,
  user: null,
  loading: false,
  errorMsg: null,
  checkingAuth: true,
  authenticated: false
};

const serverURL_AUTH = import.meta.env.VITE_AUTH_SERVER_URL;
const serverURL_ACC = import.meta.env.VITE_ACCOUNT_SERVER_URL;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialStates,

      login: async ({ email, password }) => {
        set({
          loading: true,
          errorMsg: null,
          success: false,
          authenticated: false
        });

        try {
          const { data } = await axios.post(`${serverURL_AUTH}/user-login`, { email, password });
          set({
            loading: false,
            user: data.user,
            errorMsg: null,
            authenticated: true,
            success: true,
            checkingAuth: false
          });
          return data;
        } catch (error) {
          console.error('Login error:', error);
          set({
            loading: false,
            errorMsg: error?.response?.data?.message || error.message || 'Internal server error',
            authenticated: false,
            success: false
          });
          throw error;
        }
      },

      signup: async (credentials) => {
        set({
          ...initialStates,
          loading: true,
          checkingAuth: false
        });
        try {
          const { data } = await axios.post(`${serverURL_AUTH}/create-account`, credentials);
          set({
            success: true,
            loading: false,
            errorMsg: null,
            user: data.user,
            authenticated: true
          });
        } catch (error) {
          console.log('Error creating account', error.message);
          set({
            errorMsg: error?.response?.data?.message || 'Internal server error',
            loading: false,
            success: false,
            user: null,
            authenticated: false
          });
        }
      },

      forgetPassword: async (email) => {
        set({ loading: true, errorMsg: null, success: false });
        try {
          const { data } = await axios.post(`${serverURL_ACC}/forget-password`, { email });
          set({ loading: false, errorMsg: null, success: true });
          return data;
        } catch (error) {
          console.error('Error in forget password:', error);
          set({
            loading: false,
            errorMsg: error?.response?.data?.message || 'Internal server error',
            success: false
          });
          throw error;
        }
      },

      verifyOTP: async (otp) => {
        set({ loading: true, errorMsg: null, success: false });
        try {
          const { data } = await axios.post(`${serverURL_AUTH}/verify-otp`, { otp });
          set({
            loading: false,
            errorMsg: null,
            success: true,
            user: data.user,
            authenticated: true
          });
          return data;
        } catch (error) {
          console.error('Error verifying OTP:', error);
          set({
            loading: false,
            errorMsg: error?.response?.data?.message || 'Internal server error',
            success: false
          });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ checkingAuth: true, loading: true, errorMsg: null });

        const authenticated = get().authenticated;
        if (authenticated) {
          set({ checkingAuth: false, loading: false });
          return;
        }

        try {
          const { data } = await axios.get(`${serverURL_ACC}/check-auth`);
          set({
            checkingAuth: false,
            loading: false,
            errorMsg: null,
            authenticated: true,
            user: data.user
          });
        } catch (error) {
          console.error('Error checking authentication:', error);
          set({ checkingAuth: false, loading: false, authenticated: false });
        }
      },

      logout: async () => {
        set({ loading: true, errorMsg: null, success: false });
        try {
          await axios.get(`${serverURL_AUTH}/user-logout`);
          set({ ...initialStates, checkingAuth: false });
          // Clear persisted state
          useAuthStore.persist.clearStorage();
          usePlaylistStore.persist.clearStorage();
          usePlaylistStore.getState().resetPlaylist();
        } catch (error) {
          console.error('Logout error:', error);
          set({
            loading: false,
            errorMsg: error?.response?.data?.message || 'Internal server error',
            success: false
          });
        }
      },

      reset: () => set({ ...initialStates, checkingAuth: false })
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        authenticated: state.authenticated,
        user: state.user
      }),
    }
  )
);
