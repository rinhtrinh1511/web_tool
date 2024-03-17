import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import toolSlice from "./slice/tool";
import vpsSlice from "./slice/vps";
import disCountSlice from "./slice/discount";

const store = configureStore({
    reducer: {
        auth: authSlice,
        tools: toolSlice,
        vps: vpsSlice,
        discount: disCountSlice,
    },
});

export default store;
