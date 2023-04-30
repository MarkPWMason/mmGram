import React from 'react';
import { useSelector } from 'react-redux';
import { selectPosts } from '../../redux/slices/postSlice';
import PostComp from './PostComp';

const PostsComp = () => {
  const posts = useSelector(selectPosts);
  
  return <div>
    {posts !== null && posts.length > 0 && posts.map((post: any, index: number) => {
        return <PostComp post={post} key={index} />;
      })}
  </div>;
};

export default PostsComp;
