import { create } from "zustand";
import axios from "axios";

// Zustand store
export const useUserStore = create((set) => ({
  user: null,              // will hold the user object
  loading: false,          // loading state
  error: null,             // error state

  // Fetch user from backend
  fetchUser: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:3000/api/users/profile", {
        withCredentials: true, // Send jwt cookie to backend
      });
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Call when task is completed
  completeTask: async (subtaskId) => {
    try {
      set({ loading: true });
      await axios.post(
        `http://localhost:3000/api/users/complete/level-subtasks/${subtaskId}`,
        {},
        { withCredentials: true }
      );
      // after backend updates streak + xp, re-fetch user
      const res = await axios.get("http://localhost:3000/api/users/profile", {
        withCredentials: true,
      });
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

