import React from 'react';
import styles from './Home.module.css';
import CreatePostComp from '../components/Post/CreatePostComp';
import PostsComp from '../components/Post/PostsComp';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken, setUserValues } from '../redux/slices/userSlice';
import { selectModalOpen, setModalState } from '../redux/slices/modalSlice';

const Home = () => {
  const authToken = useSelector(selectAuthToken);

  const dispatch = useDispatch();
  const createPost = useSelector(selectModalOpen);

  if (authToken === '') {
    //check if it was stored in localStorage
    let localAuthToken = sessionStorage.getItem('auth');
    if (localAuthToken !== null) {
      const data = JSON.parse(localAuthToken);
      console.log('loaded data');
      dispatch(
        setUserValues({
          user_id: data.user_id,
          auth_token: data.auth_token,
        })
      );
    }
  }
  //if not then they shouldn't be on this page and they need to leave
  return (
    <div className={styles.homeContainer}>
      {authToken !== '' && (
        <button
          className={styles.createPostBtn}
          onClick={() => {
            dispatch(setModalState({modalState: true}));
          }}
        >
          Create Post
        </button>
      )}
      {createPost && <CreatePostComp/>}
      <PostsComp />
    </div>
  );
};

export default Home;
