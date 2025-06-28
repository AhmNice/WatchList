import axios from 'axios';
import { create } from 'zustand';
axios.defaults.withCredentials=true

// Set axios defaults
axios.defaults.withCredentials = true;

const initialStates = {
  success: false,
  user: null,
  loading: false,
  errorMsg: null,
  checkingAuth: false,
  authenticated: false
};

const serverURL = import.meta.env.VITE_SERVER_URL;
console.log(serverURL)
export const useAuthStore = create((set) => ({
  ...initialStates,

  login: async ({ email, password }) => {
    set({
      loading: true,
      errorMsg: null,
      success: false,
      authenticated: false
    });

    try {
      console.log(serverURL)
      const { data } = await axios.post(`${serverURL}/user-login`, { email, password });
      set({
        loading: false,
        user: data.user,
        errorMsg: null,
        authenticated: true,
        success: true
      });

      return data;

    } catch (error) {
      console.error('Login error:', error);

      set({
        loading: false,
        errorMsg: error?.response?.data?.message ||
          error.message ||
          'Internal server error',
        authenticated: false,
        success: false
      });

      throw error;
    }
  },


  reset: () => set({ ...initialStates })
}));