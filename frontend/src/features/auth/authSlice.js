// src/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // axios instance

// ✅ Safe wrapper for localStorage
const storage = {
  getItem: (key) => {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(key);
  },
};

// Async Thunks
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      return { user: { name, email }, token: data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      return { user: data.user, token: data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(storage.getItem("user")) || null,
    token: storage.getItem("token") || null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.success = null;
      storage.removeItem("token");
      storage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = "Signup successful!";
        // optional: storage.setItem("token", action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        storage.setItem("token", action.payload.token);
        storage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
