import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOtherCostsFromFirebase } from "../firsebase.js";

export const fetchOtherCosts = createAsyncThunk(
  "otherCosts/fetchOtherCosts",
  async (userId) => {
    return await getOtherCostsFromFirebase(userId);
  }
);

const otherCostsSlice = createSlice({
  name: "otherCosts",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setOtherCosts: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOtherCost: (state, action) => {
      state.list.push(action.payload);
    },
    removeOtherCost: (state, action) => {
      state.list = state.list.filter((cost) => cost.id !== action.payload);
    },
    updateOtherCost: (state, action) => {
      const index = state.list.findIndex(
        (cost) => cost.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    clearOtherCosts: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherCosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchOtherCosts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const {
  setOtherCosts,
  addOtherCost,
  removeOtherCost,
  updateOtherCost,
  clearOtherCosts,
} = otherCostsSlice.actions;

export default otherCostsSlice.reducer;
