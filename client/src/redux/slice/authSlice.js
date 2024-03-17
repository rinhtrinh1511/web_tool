import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoading: false,
        userData: {},
        isSuccess: false,
        error: null,
    },
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.userData = action.payload;
            state.isSuccess = true;
        },
        loginFalse: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isSuccess = false;
        },
        logout: (state) => {
            state.isLoading = false;
            state.userData = {};
        },
        registerStart: (state) => {
            state.isLoading = true;
        },
        registerSuccess: (state) => {
            state.isLoading = false;
            state.err = "";
            state.isSuccess = true;
        },
        registerFalse: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
            state.isSuccess = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});
export const {
    loginStart,
    loginFalse,
    loginSuccess,
    logout,
    registerStart,
    registerFalse,
    registerSuccess,
    setError,
} = authSlice.actions;

export default authSlice.reducer;
