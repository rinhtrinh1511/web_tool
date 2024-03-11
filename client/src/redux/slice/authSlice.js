import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoading: false,
        name: "",
        token: null,
        error: "",
        err: "",
        isSuccess: null,
        showDropdown: true,
    },
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.name = action.payload;
            state.token = action.payload;
            state.error = "";
            state.isSuccess = true;
        },
        loginFalse: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isSuccess = false;
        },
        logout: (state) => {
            state.isLoading = false;
            state.name = "";
            state.token = null;
            state.error = "";
            state.showDropdown = true;
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
