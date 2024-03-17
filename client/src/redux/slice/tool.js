import { createSlice } from "@reduxjs/toolkit";

const toolSlice = createSlice({
    name: "tools",
    initialState: {
        isLoading: false,
        tool: [],
        error: "",
    },
    reducers: {
        getStart: (state) => {
            state.isLoading = true;
        },
        getSuccess: (state, action) => {
            state.isLoading = false;
            state.tool = action.payload;
            state.error = "";
        },
        getFalse: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        getDetailStart: (state, action) => {
            state.isLoading = true;
        },
        getDetailSuccess: (state, action) => {
            state.isLoading = false;
            state.tool = action.payload;
        },
        getDetailFalse: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    getFalse,
    getStart,
    getSuccess,
    getDetailStart,
    getDetailSuccess,
    getDetailFalse,
} = toolSlice.actions;
export default toolSlice.reducer;
