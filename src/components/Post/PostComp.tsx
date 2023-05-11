import React, { useState } from 'react';
import { deletePosts, updatePosts } from '../../redux/slices/postSlice';
import IPost from '../../interfaces/IPost';
import { useDispatch, useSelector } from 'react-redux';
import styles from './PostComp.module.css';
import {
  removeUserValues,
  selectAuthToken,
  selectUserID,
} from '../../redux/slices/userSlice';
import { selectPostModalId, setModalId } from '../../redux/slices/modalSlice';

const PostComp = ({ post }: { post: IPost }) => {
  const authToken = useSelector(selectAuthToken);

  const [updatedTitle, setUpdatedTitle] = useState<string>(post.title);
  const [updatedContent, setUpdatedContent] = useState<string>(post.content);
  const [updatedImage, setUpdatedImage] = useState<any>(post.imageUrl);

  console.log(updatedImage);
  const userID = useSelector(selectUserID);
  const modalId = useSelector(selectPostModalId);

  const isOwner = post.user_id.toString() === userID.toString();
  console.log(typeof post.user_id, typeof userID.toString());
  if (post.user_id === userID.toString()) {
    console.log('true');
  } else {
    console.log(false);
  }
  //delete
  const dispatch = useDispatch();
  return (
    <div className={styles.postComp}>
      <div className={styles.postContainer}>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postContent}>{post.content}</p>
        <img className={styles.postImage} src={post.imageUrl} alt="" />
        {isOwner && (
          <div className={styles.postBtn}>
            <button
              className={styles.promptBtn}
              onClick={() => {
                dispatch(setModalId({ postModalId: post.id }));
              }}
            >
              <img
                className={styles.postPrompts}
                src="/images/edit.svg"
                alt="EDIT"
              />
            </button>
            <button
              className={styles.promptBtn}
              onClick={() => {
                fetch('http://localhost:5000/deletepost', {
                  method: 'DELETE',
                  headers: new Headers({ 'content-type': 'application/json' }),
                  body: JSON.stringify({
                    id: post.id,
                    user_id: userID,
                    auth_token: authToken,
                  }),
                })
                  .then((res) => {
                    console.log(res.status);
                    if (res.status === 200) {
                      return res.text();
                    } else if (res.status === 403) {
                      throw new Error('Unauthorized');
                    } else if (res.status === 500) {
                      throw new Error('Server Error');
                    }
                  })
                  .then((data) => {
                    console.log('data: ', data);
                    dispatch(deletePosts({ id: post.id }));
                  })
                  .catch((err) => {
                    if (err.message === 'Unauthorized') {
                      alert('Unauthorized error message');
                      dispatch(removeUserValues());
                    } else if (err.message === 'Server Error') {
                      alert('Server Error');
                    }
                    console.error(err);
                  });
              }}
            >
              <img
                className={styles.postPrompts}
                src="/images/delete.svg"
                alt="DELETE"
              />
            </button>
          </div>
        )}
      </div>

      {modalId === post.id && (
        <div>
          <form
            className={styles.editPostForm}
            onSubmit={(e) => {
              e.preventDefault();

              const fd = new FormData();
              fd.append('image', updatedImage);
              fd.append('title', updatedTitle);
              fd.append('content', updatedContent);
              fd.append('id', post.id.toString());
              fd.append('user_id', userID.toString());
              fd.append('auth_token', authToken);

              fetch('http://localhost:5000/updatepost', {
                method: 'POST',
                body: fd,
              })
                .then((res) => {
                  if (res.status === 200) {
                    return res.json();
                  } else if (res.status === 403) {
                    throw new Error('Unauthorized');
                  } else if (res.status === 404) {
                    throw new Error('Logging out');
                  } else if (res.status === 500) {
                    throw new Error('Server Error');
                  }
                })
                .then((data) => {
                  /* 
                    was not sending the up to date values I was recieving from data instead I was sending the old values from form data.
                  */
                  dispatch(setModalId({ postModalId: -1 }))
                  const title = data.title;
                  const imageUrl = data.imageUrl;
                  const content = data.content;

                  console.log('FRONTEND RECIEVES FROM BACKEND: ', imageUrl);
                  dispatch(
                    updatePosts({
                      user_id: post.user_id,
                      id: post.id,
                      title: title,
                      content: content,
                      imageUrl: imageUrl,
                    })
                  );
                })
                .catch((err) => {
                  console.error(err);
                  if (err.message === 'Unauthorized') {
                    alert('Unauthorized');
                    dispatch(removeUserValues());
                  } else if (err.message === 'Logging out') {
                    alert('Something went wrong, Logging out');
                    dispatch(removeUserValues());
                  } else if (err.message === 'Server Error') {
                    alert('Server Error');
                  }
                });
            }}
          >
            <button onClick={() => {
              dispatch(setModalId({ postModalId: -1 }))
            }} className={styles.closeBtn}>
              X
            </button>
            <input
              className={styles.updatePostTitle}
              type="text"
              placeholder="Title"
              value={updatedTitle}
              onChange={(e) => {
                setUpdatedTitle(e.target.value);
              }}
            />
            <textarea
              className={styles.updatePostContent}
              placeholder="Content"
              cols={30}
              rows={10}
              value={updatedContent}
              onChange={(e) => {
                setUpdatedContent(e.target.value);
              }}
            />
            <input
              className={styles.updatePostImage}
              placeholder="Image"
              type="file"
              accept="image/png, image/gif, image/jpeg, image/webp"
              onChange={(e) => {
                if (e.currentTarget.files !== null)
                  setUpdatedImage(e.currentTarget.files[0]);
              }}
            />
            <button className={styles.updatePostSubmit} type="submit">
              POST
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostComp;
