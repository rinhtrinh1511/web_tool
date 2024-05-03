import { createSlice } from "@reduxjs/toolkit";

const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    isLoading: false,
    error: "",
    isSuccess: false,
  },
  reducers: {
    purchaseStart: (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    },
    purchaseSuccess: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSuccess = true;
    },
    purchaseFalse: (state, action) => {
      state.isLoading = true;
      state.error = action.payload;
      state.isSuccess = false;
    },
    resetPurchase: (state) => {
      state.isLoading = false;
      state.error = "";
      state.isSuccess = false;
    },
  },
});

export const { purchaseStart, purchaseSuccess, purchaseFalse, resetPurchase } =
  purchaseSlice.actions;
export default purchaseSlice.reducer;
