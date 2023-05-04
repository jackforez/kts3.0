import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  refresh: false,
  currentPage: "",
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    onRefreh: (state) => {
      !state.refresh;
    },
    onLoading: (state) => {
      state.loading = true;
    },
    loaded: (state) => {
      state.loading = false;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { onRefreh, onLoading, loaded, setCurrentPage } =
  systemSlice.actions;

export default systemSlice.reducer;
