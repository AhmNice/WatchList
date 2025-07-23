import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from './authStore';

axios.defaults.withCredentials = true;

const initialStates = {
  users: null,
  loadingUsers: false,
  errorMsg: null,
  successMsg: null,
  success: null,
};

const serverBaseURL = import.meta.env.VITE_SERVER_BASE_URL;

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...initialStates,

      // ✅ Fetch all users
      fetchUsers: async (force = false) => {
        const { users } = get();
        if (!force && users && users.length > 0) return;

        set({ loadingUsers: true, errorMsg: null });

        try {
          const { data } = await axios.get(`${serverBaseURL}/user-api/users`);
          set({
            users: data.data,
            success: true,
            errorMsg: null,
          });
        } catch (error) {
          set({
            errorMsg: error.response?.data?.message || error.message,
            success: false,
          });
        } finally {
          set({ loadingUsers: false });
        }
      },

      // ✅ Follow user
      followUser: async (currentUserId, targetUserId) => {
        set({ loadingUsers: true, errorMsg: null, successMsg: null, success: false });

        try {
          const { data } = await axios.post(
            `${serverBaseURL}/user-api/follow/${currentUserId}/${targetUserId}`
          );
          set({
            users: data.users,
            success: true,
            errorMsg: null,
            successMsg: data.message
          });
          useAuthStore.getState().updateUser(data.currentUser);
        } catch (error) {
          set({
            errorMsg: error.response?.data?.message || error.message,
            success: false,
          });
        } finally {
          set({ loadingUsers: false });
        }
      },
      unFollowUser: async (currentUserId, userId) => {
        set({ loadingUsers: true, errorMsg: null, successMsg: null, success: false });
        try {
          const { data } = await axios.post(`${serverBaseURL}/user-api/unfollow/${currentUserId}/${userId}`)
          set({
            success: true,
            errorMsg: null,
            successMsg: data.message,
             users: data.users
          })
          useAuthStore.getState().updateUser(data.currentUser)
        } catch (error) {
          set({
            errorMsg: error.response?.data?.message || error.message,
            success: false,
          });
        } finally {
          set({ loadingUsers: false });
        }
      },

      // ✅ Reset store
      reset: () => set({ ...initialStates }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        users: state.users,
      }),
    }
  )
);
