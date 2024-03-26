import { createSlice } from "@reduxjs/toolkit";

const topupCardSlice = createSlice({
  name: "topupCard",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    isSuccess: false,
  },
  reducers: {
    topupCardStart: (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    },
    topupCardSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = "";
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
