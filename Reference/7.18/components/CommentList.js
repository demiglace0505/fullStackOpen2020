import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { comment } from '../reducers/blogReducer.js'

const CommentList = ({ blog }) => {
  // console.log(blog)


  return (
    <div>
      <h2>comments</h2>
      <CommentBox blog={blog} />
      <ul>
        {blog.comments.map((c, idx) =>
          <li key={idx}>{c}</li>
        )}
      </ul>
    </div>
  )
}

const CommentBox = ({ blog }) => {
  const [newComment, setnewComment] = useState('')
  const dispatch = useDispatch()

  const createComment = (event) => {
    event.preventDefault()
    dispatch(comment(blog, newComment))
    setnewComment('')
  }

  return (
    <div>
      <form onSubmit={createComment}>
        <input
          type="text"
          value={newComment}
          name="Comment"
          onChange={(e) => setnewComment(e.target.value)}
        />
        <button type="submit">
          add comment
        </button>
      </form>
    </div>
  )
}

export default CommentList