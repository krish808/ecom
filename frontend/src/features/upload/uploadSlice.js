import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const uploadProductImage = createAsyncThunk(
  "upload/uploadProductImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("image", file);

      const { data } = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.url;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Image upload failed"
      );
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    imageUrl: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetUpload: (state) => {
      state.imageUrl = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUrl = action.payload;
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
