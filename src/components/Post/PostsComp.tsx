import React from 'react';
import PostComp from './PostComp';
import { useDispatch, useSelector } from 'react-redux';
import { selectPosts, setAllPosts } from '../../redux/slices/postSlice';
import IPost from '../../interfaces/IPost';

const PostsComp = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  console.log('POSTS', posts);

  if (posts === null) {
    fetch('http://localhost:5000/', { method: 'GET' })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data: IPost[]) => {
        console.log("POST DATA", data);
        const posts = data.map((p:IPost) => {
          const post: IPost = {
            id: p.id,
            title: p.title,
            content: p.content,
            imageUrl: p.imageUrl,
            user_id: p.user_id.toString()//thinks its a string but its actually a number
            //need to fix this for now just make it a string
          }
          console.log('post map', post, typeof post.user_id)
          return post
        })
        dispatch(setAllPosts({ posts: posts }));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div>
      {posts !== null &&
        posts.length > 0 &&
        posts.map((post: any, index: number) => {
          return <PostComp post={post} key={index} />;
        })}
    </div>
  );
};

export default PostsComp;
