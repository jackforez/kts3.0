import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  refresh: false,
  openModal: false,
  currentPage: "",
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    onRefreh: (state) => {
      state.refresh = !state.refresh;
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
    onOpenModal: (state) => {
      state.openModal = true;
    },
    onCloseModal: (state) => {
      state.openModal = false;
    },
  },
});

export const {
  onRefreh,
  onLoading,
  loaded,
  setCurrentPage,
  onOpenModal,
  onCloseModal,
} = systemSlice.actions;

export default systemSlice.reducer;
