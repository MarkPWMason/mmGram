import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectPosts, setAllPosts } from '../redux/slices/postSlice';
import IPost from '../interfaces/IPost';
import PostComp from '../components/Post/PostComp';
import {
  selectAuthToken,
  selectUserID,
  setUserValues,
} from '../redux/slices/userSlice';

import styles from './Profile.module.css';



const Profile = () => {
  
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const userID = useSelector(selectUserID);

  const authToken = useSelector(selectAuthToken);
  const [loaded, setLoaded] = useState<Boolean>(false);

  if (authToken === '') {
    //check if it was stored in localStorage
    let localAuthToken = sessionStorage.getItem('auth');
    if (localAuthToken !== null) {
      const data = JSON.parse(localAuthToken);
      dispatch(
        setUserValues({
          user_id: data.user_id,
          auth_token: data.auth_token,
          username: data.username,
        })
      );
    } else {
      window.location.href = '/login';
    }
  }
  

  const urlParams = new URLSearchParams(window.location.search);
  const user_id = urlParams.get('user_id') ?? userID; 

  useEffect(() => {
    fetch(`http://backend.mmgram.co.uk:5000/userposts?user_id=${user_id}`, {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data: IPost[]) => {
        const posts = data.map((p: IPost) => {
          if (p.user_id.toString() === user_id.toString()) {
            const post: IPost = {
              id: p.id,
              title: p.title,
              content: p.content,
              imageUrl: p.imageUrl,
              user_id: p.user_id.toString(), //thinks its a string but its actually a number
              //need to fix this for now just make it a string
              likes: p.likes,
              comments: p.comments ?? [],
              hasLiked: p.hasLiked,
              isVideo: p.isVideo
            };
            return post;
          }
          return p;
        });
        dispatch(setAllPosts({ posts: posts }));
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user_id]);

  return (
    <div className={styles.profileContainer}>
      {posts !== null &&
        posts.length > 0 && loaded &&
        posts.map((post: IPost, index: number) => {
          return <PostComp post={post} key={index} />;
        })}
    </div>
  );
};

export default Profile;
