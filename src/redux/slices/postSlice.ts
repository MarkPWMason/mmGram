import { createSlice, current } from '@reduxjs/toolkit';
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
      const {
        title,
        content,
        imageUrl,
        id,
        user_id,
        likes,
        comments,
        hasLiked,
        isVideo
      } = action.payload;

      if (state.posts == null) {
        state.posts = [
          {
            id: id,
            title: title,
            content: content,
            imageUrl: imageUrl,
            user_id: user_id,
            likes: likes,
            comments: comments,
            hasLiked:hasLiked,
            isVideo: isVideo
          },
        ];
      } else {
        state.posts.unshift({
          id: id,
          title: title,
          content: content,
          imageUrl: imageUrl,
          user_id: user_id,
          likes: likes,
          comments: comments,
          hasLiked: hasLiked,
          isVideo:isVideo
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
      const { title, content, imageUrl, id, isVideo } = action.payload;
      console.log('i got dispatched', action.payload)
      if (state.posts != null) {
        state.posts = state.posts.map((p) => {
          if (p.id === id) {
            p.content = content;
            p.title = title;
            if (imageUrl !== null && typeof imageUrl != 'undefined') {
              p.imageUrl = imageUrl;
              p.isVideo = isVideo

              console.log(imageUrl)
            }
          }
          return p;
        });
      }
    },
    updatePostLikes: (state, action) => {
      const { id, likes } = action.payload;
      if (state.posts !== null) {
        state.posts = state.posts.map((p: IPost) => {
          if (p.id === id) {
            p.likes = likes;
          }
          return p;
        });
      }
    },
    addCommentToPost: (state, action) => {
      const { id, post_id, user_id, comment, username, reply_id } =
        action.payload;
      if (state.posts !== null && state.posts.length > 0) {
        state.posts = state.posts.map((post: IPost) => {
          if (post_id === post.id) {
            if (reply_id === null) {
              post.comments.push({
                id: id,
                user_id: user_id,
                comment: comment,
                username: username,
                children: [],
              });
            } else {
              post.comments.forEach((c: any) => {
                if (c.id === reply_id) {
                  c.children.push({
                    id: id,
                    user_id: user_id,
                    comment: comment,
                    username: username,
                    children: [],
                    reply_id: reply_id
                  });
                }
              });
            }
            
          }
          return post;
        });
      }
      
    },
    setComments: (state, action) => {
      const { post_id, comments } = action.payload;

      if (state.posts !== null && state.posts.length > 0) {
        state.posts = state.posts.map((post: IPost) => {
          if (post_id === post.id) {
            post.comments = comments;
          }
          return post;
        });
      }
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setPost,
  setAllPosts,
  deletePosts,
  updatePosts,
  updatePostLikes,
  addCommentToPost,
  setComments,
} = postSlice.actions;
export const selectPosts = (state: RootState) => state.postSlice.posts;

export default postSlice.reducer;
