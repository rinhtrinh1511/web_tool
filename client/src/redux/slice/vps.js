import { createSlice } from "@reduxjs/toolkit";

const vpsSlice = createSlice({
    name: "vps",
    initialState: {
        isLoading: false,
        vps: [],
        error: "",
    },
    reducers: {
        getVpsStart: (state) => {
            state.isLoading = true;
        },
        getVpsSuccess: (state, action) => {
            state.isLoading = false;
            state.vps = action.payload;
            state.error = "";
        },
        getVpsFalse: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        getVpsDetailStart: (state, action) => {
            state.isLoading = true;
        },
        getVpsDetailSuccess: (state, action) => {
            state.isLoading = false;
            state.vps = action.payload;
        },
        getVpsDetailFalse: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    getVpsStart,
    getVpsSuccess,
    getVpsFalse,
    getVpsDetailStart,
    getVpsDetailSuccess,
    getVpsDetailFalse,
} = vpsSlice.actions;
export default vpsSlice.reducer;
