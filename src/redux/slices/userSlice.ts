import { createSlice, current } from '@reduxjs/toolkit';
import { RootState } from '../store';

type Data = {
  user_id: number;
  username: string;
  auth_token: string;
};

const initalState: Data = {
  user_id: 0,
  username: '',
  auth_token: '',
};

const storeInLocalStorage = (state: any) => {
  sessionStorage.setItem('auth', state);
};

const removeFromLocalStorage = () => {
  sessionStorage.removeItem('auth');
};

export const userSlice = createSlice({
  name: 'userSlice', //has to match the name of the reducer in store.ts
  initialState: initalState,
  reducers: {
    setUserValues: (state, action) => {
      const { user_id, username, auth_token } = action.payload;
      state.user_id = user_id;
      state.username = username;
      state.auth_token = auth_token;
      //if you log state it doesn't work then you need current
      console.log(current(state));
      storeInLocalStorage(JSON.stringify(state));
    },
    removeUserValues: (state) => {
      state.user_id = 0;
      state.username = '';
      state.auth_token = '';

      removeFromLocalStorage();
    },
  },
});
export const { setUserValues, removeUserValues } = userSlice.actions;
export const selectUsername = (state: RootState) => state.userSlice.username;
export const selectUserID = (state: RootState) => state.userSlice.user_id;
export const selectAuthToken = (state: RootState) => state.userSlice.auth_token;
export default userSlice.reducer;
