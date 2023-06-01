import React, { useEffect, useState } from 'react';

import styles from './CommentComp.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken, selectUserID } from '../../redux/slices/userSlice';
import { addCommentToPost, setComments } from '../../redux/slices/postSlice';
import { selectUsername } from '../../redux/slices/userSlice';
import IPost from '../../interfaces/IPost';
import { Link } from 'react-router-dom';

require('dotenv').config();


const CommentComp = ({
  post,
  setCommentOpen,
}: {
  post: IPost;
  setCommentOpen: any;
}) => {
  const dispatch = useDispatch();
  const [postComment, setPostComment] = useState<string>('');
  const [repliedUser, setRepliedUser] = useState<string>('');
  const [replyId, setReplyId] = useState<number | null>(null);

  const username = useSelector(selectUsername);
  const userID = useSelector(selectUserID);
  const authToken = useSelector(selectAuthToken);

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/comments?post_id=${post.id}`, {
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

  return (
    <div className={styles.commentContainer}>
      <button
        className={styles.closeBtn}
        onClick={() => {
          setCommentOpen(false);
        }}
      >
        X
      </button>
      <div className={styles.comments}>
        {post.comments.map((c: any, index: number) => {
          return (
            <div key={index}>
              <p className={styles.comment}>
                <Link to={`/profile?user_id=${c.user_id}`}>{c.username}:</Link>{' '}
                {c.comment}{' '}
                <span className={styles.replyBtnDiv}>
                  <button
                    className={styles.replyBtn}
                    onClick={() => {
                      setRepliedUser(c.username);
                      setReplyId(
                        typeof c.reply_id === 'undefined' || c.reply_id == null
                          ? c.id
                          : c.reply_id
                      );
                    }}
                  >
                    REPLY
                  </button>
                </span>
              </p>
              {c.children &&
                c.children.map((childComment: any, childIndex: number) => {
                  //return the child comment and indent it
                  return (
                    <p className={styles.repliedComment} key={childIndex}>
                      {childComment.username}: {childComment.comment}{' '}
                      <button
                        className={styles.replyBtn}
                        onClick={() => {
                          setRepliedUser(childComment.username);
                          setReplyId(
                            typeof childComment.reply_id === 'undefined' ||
                              childComment.reply_id == null
                              ? childComment.id
                              : childComment.reply_id
                          );
                        }}
                      >
                        REPLY
                      </button>
                    </p>
                  );
                })}
            </div>
          );
        })}
      </div>
      {authToken && (
        <>
          {repliedUser && (
            <p className={styles.replyingComment}>REPLYING TO: {repliedUser}</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRepliedUser('');
              fetch(`${process.env.BACKEND_URL}/addcomment`, {
                method: 'POST',
                headers: new Headers({
                  'content-type': 'application/json',
                }),
                body: JSON.stringify({
                  user_id: userID,
                  post_id: post.id,
                  comment: postComment,
                  username: username,
                  reply_id: replyId,
                }),
              })
                .then((res) => {
                  if (res.status === 200) {
                    return res.json();
                  } else {
                    throw new Error('There was a problem');
                  }
                })
                .then((data) => {
                  dispatch(
                    addCommentToPost({
                      id: data.id,
                      user_id: userID,
                      post_id: post.id,
                      comment: data.comment,
                      username: data.username,
                      reply_id: replyId,
                    })
                  );
                  setPostComment('');
                })
                .catch((err) => {
                  alert(err);
                });
            }}
            className={styles.commentInput}
          >
            <div className={styles.commentInput}>
              <textarea
                className={styles.commentText}
                placeholder="Please write your comment."
                cols={80}
                rows={4}
                value={postComment}
                onChange={(e) => {
                  setPostComment(e.target.value);
                }}
              ></textarea>
              <button className={styles.submit} type="submit">
                POST
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CommentComp;
