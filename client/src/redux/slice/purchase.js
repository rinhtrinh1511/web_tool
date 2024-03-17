import { createSlice } from "@reduxjs/toolkit";

const purchaseSlice = createSlice({
    name: "purchase",
    initialState: {
        isLoading: false,
        error: "",
    },
    reducers: {
        purchaseStart: (state) => {
            state.isLoading = true;
        },
        purchaseSuccess: (state, action) => {
            state.isLoading = false;
            state.error = "";
        },
        purchaseFalse: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const { purchaseStart, purchaseSuccess, purchaseFalse } =
    purchaseSlice.actions;
export default purchaseSlice.reducer;
