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
  },
});

export const { getVpsStart, getVpsSuccess, getVpsFalse } = vpsSlice.actions;
export default vpsSlice.reducer;
