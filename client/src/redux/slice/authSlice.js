import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  userData: {},
  isSuccess: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
      state.isSuccess = true;
      state.error = "Đăng nhập thành công.";
    },

    loginFalse: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSuccess = false;
    },
    logout: (state) => {
      state.isLoading = false;
      state.userData = {};
      state.error = null;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.userData = {};
      state.error = null;
      state.isSuccess = false;
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
  resetState,
} = authSlice.actions;

export default authSlice.reducer;
