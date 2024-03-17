import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import toolSlice from "./slice/tool";
import vpsSlice from "./slice/vps";

const store = configureStore({
    reducer: {
        auth: authSlice,
        tools: toolSlice,
        vps: vpsSlice,
    },
});

export default store;
