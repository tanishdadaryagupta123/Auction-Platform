// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { toast } from "react-toastify";

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../api/baseApi";

// Define API_BASE_URL at the top
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

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
    logoutRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
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
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'avatar' && data[key]) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await axios.post(
      `${BASE_URL}/api/v1/user/register`,
      formData,
      {
        withCredentials: true,
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    dispatch(userSlice.actions.registerSuccess(response.data));
    toast.success('Registration successful!');
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error);
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch(userSlice.actions.registerFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/user/login`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    // Store token immediately after login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
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
  dispatch(userSlice.actions.logoutRequest());
  try {
    const token = localStorage.getItem('token');
    await axios.get(
      `${BASE_URL}/api/v1/user/logout`,
      { 
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // Clear token and user data
    localStorage.removeItem('token');
    dispatch(userSlice.actions.logoutSuccess());
    toast.success('Logged out successfully');
    
    // Use react-router navigate instead of window.location
    window.location.replace('/login');
  } catch (error) {
    console.error('Logout Error:', error);
    // Still remove token on error to ensure user is logged out locally
    localStorage.removeItem('token');
    dispatch(userSlice.actions.logoutSuccess());
    window.location.replace('/login');
  }
};

export const fetchUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return; // Don't dispatch anything if no token exists
  }

  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/user/me`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
  } catch (error) {
    console.error('Fetch User Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    const errorMessage = error.response?.data?.message || 'Failed to fetch user';
    dispatch(userSlice.actions.fetchUserFailed(errorMessage));
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/user/leaderboard`,
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
