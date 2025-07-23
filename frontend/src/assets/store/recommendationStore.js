import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const initialState = {
  hydrated: false,
  recommendation: [],
  coldStartRecommendation: [],
  collaborativeRecommendation: [],
  contentBasedRecommendation: [],
  loadingRecommendation: false,
  success: false,
  errorMsg: null,
};

const url = import.meta.env.VITE_RECOMMENDATION_BASE_URL;

export const useRecommendationStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      fetchRecommendations: async (userId, force = false) => {
        const {hydrated }=get()
        if (!force && hydrated) {
          return console.log('already fetched')
        }
        set({
          loadingRecommendation: true,
          success: false,
          errorMsg: null,
        });

        try {
          const { data } = await axios.post(`${url}/recommend/${userId}`);
          set({
            recommendation: data.recommendations.recommended,
            coldStartRecommendation: data.recommendations.coldStart,
            collaborativeRecommendation: data.recommendations.collaborative,
            contentBasedRecommendation: data.recommendations.contentBased,
            loadingRecommendation: false,
            success: true,
            errorMsg: null,
            hydrated:true
          });
        } catch (error) {
          set({
            loadingRecommendation: false,
            success: false,
            errorMsg: error?.response?.data?.message || "Failed to fetch recommendations",
          });
        }
      },
      resetState: ()=> set({...initialState})
    }),
    {
      name: "recommendations",
      partialize: (state) => ({
        recommendation: state.recommendation,
        coldStartRecommendation: state.coldStartRecommendation,
        collaborativeRecommendation: state.collaborativeRecommendation,
        contentBasedRecommendation: state.contentBasedRecommendation,
      }),
    }
  )
);
