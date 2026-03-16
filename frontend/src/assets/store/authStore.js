import axios from "axios";
import { create } from "zustand";
import { usePlaylistStore } from "./playlistStore";
import { useMovieStore } from "./movieStore";
import { useFavStore } from "./favoriteStore";
import { useRecommendationStore } from "./recommendationStore";
import { useUserStore } from "./userStore";

axios.defaults.withCredentials = true;

const initialStates = {
  success: false,
  user: null,
  loading: false,
  errorMsg: null,
  checkingAuth: false,
  authenticated: null,
  lastAuthCheck: null
};

const serverURL_AUTH = import.meta.env.VITE_AUTH_SERVER_URL;
const serverURL_ACC = import.meta.env.VITE_ACCOUNT_SERVER_URL;

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Internal server error";

export const useAuthStore = create(
  (set, get) => ({
    ...initialStates,

    updateUser: (newUserData) => {
      set((state) => ({
        user: { ...state.user, ...newUserData }
      }));
    },

    login: async ({ email, password }) => {
      set({
        loading: true,
        errorMsg: null,
        success: false,
        authenticated: false
      });

      try {
        const { data } = await axios.post(
          `${serverURL_AUTH}/user-login`,
          { email, password }
        );

        if (!data.success) {
          set({
            loading: false,
            errorMsg: data.message,
            authenticated: false,
            success: false
          });

          return { success: false, error: data.message };
        }

        set({
          loading: false,
          user: data.user,
          errorMsg: null,
          authenticated: true,
          success: true,
          checkingAuth: false,
          lastAuthCheck: Date.now()
        });

        return { success: true, data };

      } catch (error) {
        const message = getErrorMessage(error);

        set({
          loading: false,
          errorMsg: message,
          authenticated: false,
          success: false
        });

        return { success: false, error: message };
      }
    },

    signup: async (credentials) => {
      set({
        ...initialStates,
        loading: true,
        checkingAuth: false
      });

      try {
        const { data } = await axios.post(
          `${serverURL_AUTH}/create-account`,
          credentials
        );

        if (!data.success) {
          set({
            loading: false,
            errorMsg: data.message,
            authenticated: false,
            success: false
          });

          return { success: false, error: data.message };
        }

        set({
          success: true,
          loading: false,
          errorMsg: null,
          user: data.user,
          authenticated: true
        });

        return { success: true, data };

      } catch (error) {
        const message = getErrorMessage(error);

        set({
          errorMsg: message,
          loading: false,
          success: false,
          user: null,
          authenticated: false
        });

        return { success: false, error: message };
      }
    },

    forgetPassword: async (email) => {
      set({ loading: true, errorMsg: null, success: false });

      try {
        const { data } = await axios.post(
          `${serverURL_ACC}/forget-password`,
          { email }
        );

        if (!data.success) {
          set({ loading: false, errorMsg: data.message, success: false });
          return { success: false, error: data.message };
        }

        set({ loading: false, errorMsg: null, success: true });

        return { success: true, data };

      } catch (error) {
        const message = getErrorMessage(error);

        set({
          loading: false,
          errorMsg: message,
          success: false
        });

        return { success: false, error: message };
      }
    },

    verifyOTP: async (otp) => {
      set({ loading: true, errorMsg: null, success: false });

      try {
        const { data } = await axios.post(
          `${serverURL_AUTH}/verify-otp`,
          { otp }
        );

        if (!data.success) {
          set({ loading: false, errorMsg: data.message, success: false });
          return { success: false, error: data.message };
        }

        set({
          loading: false,
          errorMsg: null,
          success: true,
          user: data.user,
          authenticated: true
        });

        return { success: true, data };

      } catch (error) {
        const message = getErrorMessage(error);

        set({
          loading: false,
          errorMsg: message,
          success: false
        });

        return { success: false, error: message };
      }
    },

    changePasswordInAccount: async (payload) => {
      set({ loading: true, success: false, errorMsg: null });

      try {
        const { data } = await axios.post(
          `${serverURL_AUTH}/account/change-password`,
          payload
        );

        if (!data.success) {
          set({ loading: false, errorMsg: data.message, success: false });
          return { success: false, error: data.message };
        }

        set({
          loading: false,
          success: true,
          errorMsg: null,
          user: data.user
        });

        return { success: true, data };

      } catch (error) {
        const message = getErrorMessage(error);

        set({
          success: false,
          errorMsg: message,
          loading: false
        });

        return { success: false, error: message };
      }
    },

    changePasswordOutside: async (payload) => {
      set({
        loading: true,
        success: false,
        errorMsg: null
      });

      try {
        const { data } = await axios.post(
          `${serverURL_AUTH}/account/password-reset`,
          payload
        );

        if (!data.success) {
          set({ loading: false, errorMsg: data.message, success: false });
          return { success: false, error: data.message };
        }

        set({
          success: true,
          errorMsg: null,
          loading: false,
          user: data.user
        });

        return { success: true, data };

      } catch (error) {
        const message = getErrorMessage(error);

        set({
          success: false,
          errorMsg: message,
          loading: false
        });

        return { success: false, error: message };
      }
    },

    checkAuth: async (force = false) => {
      const { checkingAuth, authenticated, lastAuthCheck } = get();
      const now = Date.now();
      const twoDays = 2 * 24 * 60 * 60 * 1000;

      if (!force && authenticated && lastAuthCheck && now - lastAuthCheck < twoDays) {
        set({ checkingAuth: false });
        return { success: true };
      }

      set({ checkingAuth: true, errorMsg: null });

      try {
        const { data } = await axios.get(`${serverURL_ACC}/check-auth`);

        set({
          authenticated: true,
          user: data.user,
          lastAuthCheck: now
        });

        return { success: true, data };

      } catch (error) {
        const message = getErrorMessage(error);

        set({
          authenticated: false,
          errorMsg: message
        });

        return { success: false, error: message };

      } finally {
        set({ checkingAuth: false });
      }
    },

    logout: async () => {
      set({ loading: true, errorMsg: null, success: false });

      try {
        await axios.get(`${serverURL_AUTH}/user-logout`);

        set({ ...initialStates, checkingAuth: null });

        usePlaylistStore.getState().resetPlaylist();
        useMovieStore.getState().resetMovieStore();
        useFavStore.getState().resetState();
        useRecommendationStore.getState().resetState();
        useUserStore.getState().reset();

        return { success: true };

      } catch (error) {
        const message = getErrorMessage(error);

        set({
          loading: false,
          errorMsg: message,
          success: false
        });

        return { success: false, error: message };

      } finally {
        set({ checkingAuth: false, loading: false });
      }
    },

    reset: () => set({ ...initialStates, checkingAuth: false })
  })
);