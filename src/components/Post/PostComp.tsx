import React from 'react'
import { useSelector } from 'react-redux'
import { selectPosts } from '../../redux/slices/postSlice'

import styles from './PostComp.module.css'

const PostComp = ({post} : {post: any}) => {
    
  return (
    <div className={styles.postContainer}>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
    </div>
  )
}

export default PostComp