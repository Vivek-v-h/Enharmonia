import { createSlice } from "@reduxjs/toolkit";

// Safely parse user from localStorage
const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    console.error('Error parsing user from localStorage:', err);
    return null;
  }
};

const token = localStorage.getItem("token");
const user = safeParse(localStorage.getItem("user"));

const initialState = {
  isAuthenticated: !!token,
  user: user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      
      // Log the incoming payload to verify it's correct
      console.log("loginSuccess payload:", action.payload);

      state.isAuthenticated = true;
      state.user = user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});


export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
