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
    },
});

export const {
    historyStart,
    historySuccess,
    historyFalse,
} = historySlice.actions;
export default historySlice.reducer;
