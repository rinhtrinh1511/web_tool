import { createSlice } from "@reduxjs/toolkit";

const disCountSlice = createSlice({
    name: "discount",
    initialState: {
        isLoading: false,
        discount: [],
        error: "",
    },
    reducers: {
        discountStart: (state) => {
            state.isLoading = true;
        },
        discountSuccess: (state, action) => {
            state.isLoading = false;
            state.discount = action.payload;
            state.error = "";
        },
        discountFalse: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const {
    discountStart,
    discountSuccess,
    discountFalse,
} = disCountSlice.actions;
export default disCountSlice.reducer;
