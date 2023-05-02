import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  refresh: false,
};

export const systemSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onRefreh: (state) => {
      !state.loading;
    },
    onLoading: (state) => {
      state.loading = true;
    },
    loaded: (state) => {
      state.loading = false;
    },
  },
});

export const { onRefreh, onLoading, loaded } = systemSlice.actions;

export default systemSlice.reducer;
