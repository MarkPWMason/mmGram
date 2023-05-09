import React, { useState } from 'react';
import styles from './Home.module.css';
import CreatePostComp from '../components/Post/CreatePostComp';
import PostsComp from '../components/Post/PostsComp';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken, setUserValues } from '../redux/slices/userSlice';

const Home = () => {
  const [createPost, setCreatePost] = useState(false);
  const authToken = useSelector(selectAuthToken);

  console.log('auth', authToken);

  const dispatch = useDispatch();

  if (authToken === '') {
    //check if it was stored in localStorage
    let localAuthToken = sessionStorage.getItem('auth');
    if (localAuthToken !== null) {
      const data = JSON.parse(localAuthToken);
      console.log('loaded data');
      dispatch(
        setUserValues({
          username: data.username,
          user_id: data.user_id,
          auth_token: data.auth_token,
        })
      );
    }
  }
  //if not then they shouldn't be on this page and they need to leave

  console.log('auth: ', authToken);
  return (
    <div className={styles.homeContainer}>
      {authToken !== '' && (
        <button
          onClick={() => {
            setCreatePost(true);
          }}
        >
          Create Post
        </button>
      )}
      {createPost && <CreatePostComp createPost={setCreatePost} />}
      <PostsComp />
    </div>
  );
};

export default Home;
