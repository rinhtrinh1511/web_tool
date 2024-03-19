import { createSlice } from "@reduxjs/toolkit";

const topupCardSlice = createSlice({
  name: "topupCard",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    isSuccess: true,
  },
  reducers: {
    topupCardStart: (state) => {
      state.isLoading = true;
    },
    topupCardSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isSuccess = true;
    },
    topupCardFalse: (state, action) => {
      state.isLoading = true;
      state.error = action.payload;
      state.isSuccess = false;
    },
  },
});

export const { topupCardStart, topupCardSuccess, topupCardFalse } =
  topupCardSlice.actions;
export default topupCardSlice.reducer;
