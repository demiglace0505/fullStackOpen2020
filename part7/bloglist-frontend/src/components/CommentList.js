import React from 'react'

const CommentList = ({ commentArr }) => {
  return (
    <div>
      <h2>comments</h2>
      <ul>
        {commentArr.map((c, idx) =>
          <li key={idx}>{c}</li>
        )}
      </ul>
    </div>
  )
}

export default CommentList