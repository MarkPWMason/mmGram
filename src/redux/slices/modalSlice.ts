import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type Data = {
  modalOpen: boolean;
  postModalId: number;
  title: string;
  content:string;
};

const initalState: Data = {
  modalOpen: false,
  postModalId: -1,
  title: '',
  content: ''
};

export const modalSlice = createSlice({
  name: 'modalSlice',
  initialState: initalState,
  reducers: {
    setModalState: (state, action) => {
      const { modalState } = action.payload;
      state.modalOpen = modalState;
    },
    setModalValues: (state, action) => {
      const { postModalId, title, content } = action.payload;
      state.postModalId = postModalId;
      state.title = title;
      state.content = content;
    },
    closeAllModals: (state) => {
      state.modalOpen = false;
      state.postModalId = -1;
    }
  },
});

export const { setModalState, closeAllModals, setModalValues } = modalSlice.actions;
export const selectModalOpen = (state: RootState) => state.modalSlice.modalOpen;
export const selectPostModalId = (state: RootState) => state.modalSlice.postModalId;
export const selectTitle = (state: RootState) => state.modalSlice.title;
export const selectContent = (state: RootState) => state.modalSlice.content;

export default modalSlice.reducer;
