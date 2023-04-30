import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from './CreatePostComp.module.css';
import { setPosts } from '../../redux/slices/postSlice';

const CreatePostComp = () => {
  const [postTitle, setPostTitle] = useState<any>("");
  const [postContent, setPostContent] = useState<any>("");

  const dispatch = useDispatch();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(postTitle, postContent)
          dispatch(setPosts({title: postTitle, content: postContent}))
        }}
      >
        <input type="text" placeholder="Title" onChange={(e)=>{
            setPostTitle({title: e.target.value})
            console.log(e.target.value)
        }}/>
        <textarea placeholder="Content" cols={30} rows={10} onChange={(e)=>{
          setPostContent({content: e.target.value});  
        }}/>
        <button type="submit">POST</button>
      </form>
    </div>
  );
};

export default CreatePostComp;
