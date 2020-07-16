import React, { useState } from 'react'
import blogService from '../services/blogs.js'
import '../App.css'

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false)

  const expandedInfoVisible = { display: expanded ? '' : 'none' }
  const expandButtonText = () => expanded ? 'hide' : 'view'
  const [likes, setlikes] = useState(blog.likes)

  const handleLike = async (event) => {
    event.preventDefault()
    const updatedBlog = { ...blog, likes: likes + 1}
    // console.log(updatedBlog)

    const res = await blogService.update(updatedBlog.id, updatedBlog)
    setlikes(likes + 1)
    // console.log(res)
  }

  return (

    <div className="blogPost">
      {blog.title} {blog.author} <button
        onClick={() => setExpanded(!expanded)}>
        {expandButtonText()}
      </button>
      <div style={expandedInfoVisible}>
        <div>{blog.url}</div>
        <div>
          likes: {likes}
          <button onClick={(event) => handleLike(event)}>like</button>
        </div>
        <div>{blog.user.username}</div>
      </div>
    </div>
  )
}

export default Blog
