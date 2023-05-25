import React, { useEffect, useState } from 'react';
import PostComp from './PostComp';
import { useDispatch, useSelector } from 'react-redux';
import { selectPosts, setAllPosts } from '../../redux/slices/postSlice';
import IPost from '../../interfaces/IPost';

import { selectUserID } from '../../redux/slices/userSlice';

const PostsComp = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const userID = useSelector(selectUserID);
  const [loaded, setLoaded] = useState<Boolean>(false);

  useEffect(() => {
    fetch(`http://localhost:5000/?user_id=${userID}`, { method: 'GET' })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data: IPost[]) => {
        const posts = data.map((p: IPost) => {
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
        });
        dispatch(setAllPosts({ posts: posts }));
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {posts !== null &&
        posts.length > 0 &&
        loaded &&
        posts.map((post: any, index: number) => {
          return <PostComp post={post} key={index} />;
        })}
    </div>
  );
};

export default PostsComp;
