import React, { useState } from 'react';
import styles from './Home.module.css';
import CreatePostComp from '../components/Post/CreatePostComp';
import PostsComp from '../components/Post/PostsComp';

const Home = () => {
  const [createPost, setCreatePost] = useState(false);
  return (
    <div className={styles.homeContainer}>
      <button
        onClick={() => {
          setCreatePost(true);
        }}
      >
        Create Post
      </button>
      {createPost && <CreatePostComp />}
      <PostsComp />
    </div>
  );
};

export default Home;
