import React, { useState } from 'react'
import '../App.css'

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false)

  const expandedInfoVisible = { display: expanded ? '' : 'none' }
  const expandButtonText = () => expanded ? 'hide' : 'view'

  return (

    <div className="blogPost">
        {blog.title} {blog.author} <button
          onClick={() => setExpanded(!expanded)}>
          {expandButtonText()}
        </button>
        <div style={expandedInfoVisible}>
          <div>{blog.url}</div>
          <div>likes: {blog.likes}</div>
          <div>{blog.user.username}</div>
        </div>
    </div>
  )
}

export default Blog
