import React, { useEffect, useState } from 'react';
import {
  deletePosts,
  setComments,
  updatePostLikes,
  updatePosts,
} from '../../redux/slices/postSlice';
import IPost from '../../interfaces/IPost';
import { useDispatch, useSelector } from 'react-redux';
import styles from './PostComp.module.css';
import {
  removeUserValues,
  selectAuthToken,
  selectUserID,
} from '../../redux/slices/userSlice';
import { selectPostModalId, setModalId } from '../../redux/slices/modalSlice';
import CommentComp from './CommentComp';

const PostComp = ({ post }: { post: IPost }) => {
  const authToken = useSelector(selectAuthToken);

  const [updatedTitle, setUpdatedTitle] = useState<string>(post.title);
  const [updatedContent, setUpdatedContent] = useState<string>(post.content);
  const [updatedImage, setUpdatedImage] = useState<any>(post.imageUrl);
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [powerUp, setPowerUp] = useState<boolean>(false);

  const userID = useSelector(selectUserID);
  const modalId = useSelector(selectPostModalId);
  const isOwner = post.user_id.toString() === userID.toString();
  //delete
  const dispatch = useDispatch();

  let commentsNum = 0;
  const getCommentNum = (comments: any) => {
    for (let i = 0; i < comments.length; i++) {
      if (typeof comments[i].children != 'undefined') {
        commentsNum += comments[i].children.length;
      }
    }
    commentsNum += comments.length;
    return commentsNum;
  };

  useEffect(() => {
    fetch(`http://localhost:5000/comments?post_id=${post.id}`, {
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
      .then((data) => {
        dispatch(setComments({ post_id: post.id, comments: data }));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [post.id, dispatch]);

  const isLiked = liked == null ? post.hasLiked : liked;

  if (isLiked) {
    setTimeout(() => {
      setPowerUp(false);
    }, 1000);
  }

  return (
    <div className={styles.postComp}>
      <div
        className={powerUp ? styles.postContainerPowerUp : styles.postContainer}
      >
        <span className={styles.top}></span>
        <span className={styles.bottom}></span>
        <span className={styles.right}></span>
        <span className={styles.left}></span>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postContent}>{post.content}</p>

        {post.isVideo ? (
          <video className={styles.postImage} controls width="250">
            <source src={post.imageUrl} type="video/mp4" />
          </video>
        ) : (
          <img className={styles.postImage} src={post.imageUrl} alt="" />
        )}

        <div className={styles.postPrompt}>
          <div className={styles.likes}>
            <p className={styles.likeNumber}>
              {typeof post.likes === 'undefined' ? 0 : post.likes}
            </p>
            <img
              className={styles.likeBtnImg}
              src={isLiked ? '/images/likedLike.svg' : '/images/like.svg'}
              alt=""
              onMouseOver={(e) => {
                e.currentTarget.src = '/images/likedLike.svg';
              }}
              onMouseOut={(e) => {
                e.currentTarget.src = isLiked
                  ? '/images/likedLike.svg'
                  : '/images/like.svg';
              }}
              onClick={() => {
                if (authToken) {
                  fetch('http://localhost:5000/likepost', {
                    method: 'POST',
                    headers: new Headers({
                      'content-type': 'application/json',
                    }),
                    body: JSON.stringify({
                      id: post.id,
                      user_id: userID,
                    }),
                  })
                    .then((res) => {
                      if (res.status === 200) {
                        return res.json();
                      }
                    })
                    .then((data) => {
                      setLiked(!isLiked);
                      /* 
                      race condition avoided by using the isLiked state rather than the liked state 
                      because the state for liked hasn't changed yet because of the setLiked func above.
                      */
                      if (!isLiked) {
                        setPowerUp(true);
                      }

                      dispatch(
                        updatePostLikes({
                          id: post.id,
                          likes: data.likes,
                        })
                      );
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                } else {
                  alert('You need to be logged in');
                }
              }}
            />
          </div>
          <div className={styles.comments}>
            <p className={styles.likeNumber}>{getCommentNum(post.comments)}</p>
            <img
              className={styles.commentBtn}
              src="/images/comment.svg"
              alt=""
              onClick={() => {
                setCommentOpen(true);
              }}
            />
            {commentOpen && (
              <CommentComp setCommentOpen={setCommentOpen} post={post} />
            )}
          </div>
        </div>

        {isOwner && (
          <div className={styles.postBtnContainer}>
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
                    headers: new Headers({
                      'content-type': 'application/json',
                    }),
                    body: JSON.stringify({
                      id: post.id,
                      user_id: userID,
                      auth_token: authToken,
                    }),
                  })
                    .then((res) => {
                      if (res.status === 200) {
                        return res.text();
                      } else if (res.status === 403) {
                        throw new Error('Unauthorized');
                      } else if (res.status === 500) {
                        throw new Error('Server Error');
                      }
                    })
                    .then((data) => {
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
                  dispatch(setModalId({ postModalId: -1 }));
                  const title = data.title;
                  const imageUrl = data.imageUrl;
                  const content = data.content;

                  let isVideo = false;
                  if (data.filetype.includes('mp4')) {
                    isVideo = true;
                  } else {
                    isVideo = false;
                  }

                  dispatch(
                    updatePosts({
                      user_id: post.user_id,
                      id: post.id,
                      title: title,
                      content: content,
                      imageUrl: imageUrl,
                      isVideo: isVideo,
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
            <button
              onClick={() => {
                dispatch(setModalId({ postModalId: -1 }));
              }}
              className={styles.closeBtn}
            >
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
              maxLength={70}
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
              accept="image/*, video/mp4"
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
