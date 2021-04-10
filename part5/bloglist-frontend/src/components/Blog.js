import React, { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs.js'
import '../App.css'

const Blog = ({ blog, currUser, handleDelete }) => {
  const [likes, setlikes] = useState(blog.likes)
  const [expanded, setExpanded] = useState(false)

  const deleteButton = { display: currUser.id === blog.user.id ? '' : 'none' }

  const expandedInfoVisible = { display: expanded ? '' : 'none' }
  const expandButtonText = () => expanded ? 'hide' : 'view'


  const handleLike = async (event) => {
    event.preventDefault()
    const updatedBlog = { ...blog, likes: likes + 1 }
    // console.log(updatedBlog)

    await blogService.update(updatedBlog.id, updatedBlog)
    setlikes(likes + 1)
    // console.log(res)
  }

  return (

    <div className="blogPost">
      <div className="basicInfo">
        <span className="titleAndAuthor">
          {blog.title} {blog.author}
        </span>
        <button className="toggleButton"
          onClick={() => setExpanded(!expanded)}>
          {expandButtonText()}
        </button>
      </div>
      <div style={expandedInfoVisible} className="expandedInfo">
        <div>{blog.url}</div>
        <div className="likesInfo">
          likes: {likes}
          <div>
            <button className="likeButton" onClick={(event) => handleLike(event)}>like</button>
          </div>
        </div>
        <div>{blog.user.username}</div>
        <button className="deleteButton" onClick={() => handleDelete(blog.id, blog.title)} style={deleteButton}>DELETE</button>
      </div>
    </div>
  )
}

// Blog.propTypes = {
//   blog: PropTypes.object.isRequired,
//   currUser: PropTypes.object.isRequired,
//   handleDelete: PropTypes.func.isRequired
// }

export default Blog
