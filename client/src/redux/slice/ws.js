import { createSlice } from '@reduxjs/toolkit';

const websocketSlice = createSlice({
  name: 'websocket',
  initialState: {
    ws: null,
  },
  reducers: {
    setWebSocket: (state, action) => {
      state.ws = action.payload;
    },
  },
});

export const { setWebSocket } = websocketSlice.actions;

export default websocketSlice.reducer;
