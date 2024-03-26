import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    isLoading: false,
    history: [],
    error: "",
  },
  reducers: {
    historyStart: (state) => {
      state.isLoading = true;
    },
    historySuccess: (state, action) => {
      state.isLoading = false;
      state.history = action.payload;
      state.error = "";
    },
    historyFalse: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetHistory: (state) => {
      state.isLoading = false;
      state.history = [];
      state.error = "";
    },
  },
});

export const { historyStart, historySuccess, historyFalse, resetHistory } =
  historySlice.actions;
export default historySlice.reducer;
