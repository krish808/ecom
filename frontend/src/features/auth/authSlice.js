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

// --- Helper: check token expiry
const getTokenData = () => {
  const token = storage.getItem("token");
  const user = storage.getItem("user");
  const expiry = storage.getItem("tokenExpiry");

  if (!token || !expiry || new Date().getTime() > Number(expiry)) {
    storage.removeItem("token");
    storage.removeItem("user");
    storage.removeItem("tokenExpiry");
    return { token: null, user: null };
  }
  return { token, user: JSON.parse(user) };
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

      // Save token + expiry
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify({ name, email }));
      storage.setItem("tokenExpiry", expiryTime);

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

      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));
      storage.setItem("tokenExpiry", expiryTime);

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
    ...getTokenData(),
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
      storage.removeItem("tokenExpiry");
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
