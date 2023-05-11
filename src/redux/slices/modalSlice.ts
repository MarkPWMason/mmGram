import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type Data = {
  modalOpen: boolean;
  postModalId: number;
};

const initalState: Data = {
  modalOpen: false,
  postModalId: -1,
};

export const modalSlice = createSlice({
  name: 'modalSlice',
  initialState: initalState,
  reducers: {
    setModalState: (state, action) => {
      const { modalState } = action.payload;
      state.modalOpen = modalState;
    },
    setModalId: (state, action) => {
      const { postModalId } = action.payload;
      state.postModalId = postModalId;
    },
    closeAllModals: (state) => {
      state.modalOpen = false;
      state.postModalId = -1;
    }
  },
});

export const { setModalState, setModalId, closeAllModals } = modalSlice.actions;
export const selectModalOpen = (state: RootState) => state.modalSlice.modalOpen;
export const selectPostModalId = (state: RootState) =>
  state.modalSlice.postModalId;

export default modalSlice.reducer;
