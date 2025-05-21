import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getItemsFromFirebase } from "../firsebase.js";

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (userId) => {
    return await getItemsFromFirebase(userId);
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setItems: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    addItem: (state, action) => {
      state.list.push(action.payload);
    },
    removeItem: (state, action) => {
      state.list = state.list.filter((item) => item.id !== action.payload);
    },
    updateItem: (state, action) => {
      const index = state.list.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    clearItems: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { setItems, addItem, removeItem, updateItem, clearItems } =
  itemsSlice.actions;

export default itemsSlice.reducer;
