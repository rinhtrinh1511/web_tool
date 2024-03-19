import { createSlice } from "@reduxjs/toolkit";

const purchaseSlice = createSlice({
    name: "purchase",
    initialState: {
        isLoading: false,
        error: "",
        isSuccess: true,
    },
    reducers: {
        purchaseStart: (state) => {
            state.isLoading = true;
        },
        purchaseSuccess: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isSuccess =  true
        },
        purchaseFalse: (state, action) => {
            state.isLoading = true;
            state.error = action.payload;
            state.isSuccess =  false
        },
    },
});

export const { purchaseStart, purchaseSuccess, purchaseFalse } =
    purchaseSlice.actions;
export default purchaseSlice.reducer;
