import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../../redux/slices/postSlice';
import {
  removeUserValues,
  selectAuthToken,
  selectUserID,
} from '../../redux/slices/userSlice';

import styles from './CreatePostComp.module.css';

const CreatePostComp = ({ createPost }: { createPost: any }) => {
  const [postTitle, setPostTitle] = useState<any>('');
  const [postContent, setPostContent] = useState<any>('');
  const [postImage, setPostImage] = useState<any>(null);

  const userID = useSelector(selectUserID);
  const authToken = useSelector(selectAuthToken);

  const dispatch = useDispatch();

  return (
    <div>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          //post to the api have the api return the id then set it below instead of 1
          console.log('userID ', userID.toString());
          const fd = new FormData();
          fd.append('image', postImage);
          fd.append('title', postTitle);
          fd.append('content', postContent);
          fd.append('user_id', userID.toString());
          fd.append('auth_token', authToken);
          fetch('http://localhost:5000/createpost', {
            method: 'POST',
            body: fd,
          })
            .then((res) => {
              if (res.status === 200) {
                return res.json();
              } else if (res.status === 403) {
                dispatch(removeUserValues());
              } else if (res.status === 404) {
                alert('Something went wrong, Logging out');
                dispatch(removeUserValues());
              } else if (res.status === 500) {
                alert('Server error');
              }
            })
            .then((data) => {
              console.log('create data', data.user_id);
              const id = data.id;
              const imageUrl = data.imageUrl;

              dispatch(
                setPost({
                  id: id,
                  title: postTitle,
                  content: postContent,
                  imageUrl: imageUrl,
                  user_id: userID,
                })
              );
              createPost(false);
            })
            .catch((err) => {
              console.error(err);
            });
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={(e) => {
            setPostTitle(e.target.value);
            console.log(e.target.value);
          }}
        />
        <textarea
          name="content"
          placeholder="Content"
          cols={30}
          rows={10}
          onChange={(e) => {
            setPostContent(e.target.value);
          }}
        />
        <input
          id="image"
          name="image"
          placeholder="Image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.currentTarget.files !== null)
              setPostImage(e.currentTarget.files[0]);
          }}
        />
        <input type="submit" value={'POST'} />
      </form>
    </div>
  );
};

export default CreatePostComp;
