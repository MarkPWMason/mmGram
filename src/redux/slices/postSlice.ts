import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import IPost from '../../interfaces/IPost';

type Data = {
  posts: null | IPost[];
};

const initalState: Data = {
  posts: null,
};

export const postSlice = createSlice({
  name: 'postSlice', //has to match the name of the reducer in store.ts
  initialState: initalState,
  reducers: {
    setPost: (state, action) => {
      //state is passed to the reducer
      //action is the payload that i pass
      const { title, content, imageUrl, id, user_id } = action.payload;
      if (state.posts == null) {
        state.posts = [
          {
            id: id,
            title: title,
            content: content,
            imageUrl: imageUrl,
            user_id: user_id,
          },
        ];
      } else {
        state.posts.unshift({
          id: id,
          title: title,
          content: content,
          imageUrl: imageUrl,
          user_id: user_id,
        });
      }
    },
    setAllPosts: (state, action) => {
      const posts: IPost[] = action.payload.posts;
      state.posts = posts;
    },
    deletePosts: (state, action) => {
      const { id } = action.payload;
      if (state.posts != null) {
        state.posts = state.posts.filter((p) => {
          return p.id !== id;
        });
      }
    },
    updatePosts: (state, action) => {
      const { title, content, imageUrl, id } = action.payload;
      console.log("image from slice: ", imageUrl)
      if (state.posts != null) {
        state.posts = state.posts.map((p) => {
          if (p.id === id) {
            p.content = content;
            p.title = title;
            if (imageUrl !== null && typeof imageUrl != 'undefined') {
              p.imageUrl = imageUrl;
            }
          }
          return p;
        });
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPost, setAllPosts, deletePosts, updatePosts } =
  postSlice.actions;
export const selectPosts = (state: RootState) => state.postSlice.posts;

export default postSlice.reducer;
