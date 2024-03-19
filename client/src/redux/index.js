import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import toolSlice from "./slice/tool";
import vpsSlice from "./slice/vps";
import disCountSlice from "./slice/discount";
import purchase from "./slice/purchase";
import topupCard from "./slice/topupCard";
import historySlice from "./slice/history";
const store = configureStore({
  reducer: {
    auth: authSlice,
    tools: toolSlice,
    vps: vpsSlice,
    discount: disCountSlice,
    purchase: purchase,
    topupCard: topupCard,
    history: historySlice,
  },
});

export default store;
