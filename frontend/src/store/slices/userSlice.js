// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { toast } from "react-toastify";

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Define API_BASE_URL at the top
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// Rest of your code...


//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
    error: null,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    fetchUserRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchLeaderboardRequest(state) {
      state.loading = true;
      state.leaderboard = [];
      state.error = null;
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
      state.error = null;
    },
    fetchLeaderboardFailed(state, action) {
      state.loading = false;
      state.leaderboard = [];
      state.error = action.payload;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/user/register`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
    toast.success(response.data.message);
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    console.error('Register Error:', error);
    dispatch(userSlice.actions.registerFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/user/login`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    toast.success(response.data.message);
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    console.error('Login Error:', error);
    dispatch(userSlice.actions.loginFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/user/logout`,
      { withCredentials: true }
    );
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Logout failed';
    console.error('Logout Error:', error);
    dispatch(userSlice.actions.logoutFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/user/me`, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Fetch user failed';
    console.error('Fetch User Error:', error);
    dispatch(userSlice.actions.fetchUserFailed(errorMessage));
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/user/leaderboard`,
      {
        withCredentials: true,
      }
    );
    dispatch(userSlice.actions.fetchLeaderboardSuccess(response.data.leaderboard));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Fetch leaderboard failed';
    console.error('Fetch Leaderboard Error:', error);
    dispatch(userSlice.actions.fetchLeaderboardFailed(errorMessage));
  }
};

export default userSlice.reducer;
