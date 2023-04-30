import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type Data = {
  posts: any;
};

const initalState: Data = {
  posts: null,
};

export const postSlice = createSlice({
  name: 'postSlice', //has to match the name of the reducer in store.ts
  initialState: initalState,
  reducers: {
    setPosts: (state, action) => {
      //state is passed to the reducer
      //action is the payload that i pass
      const postTitle = action.payload.title;
      const postsContent = action.payload.content;
      state.posts = { title: postTitle, content: postsContent };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPosts } = postSlice.actions;
export const selectPosts = (state: RootState) => state.postSlice.posts;

export default postSlice.reducer;
