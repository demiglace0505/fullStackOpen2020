import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'

import { setNotification } from '../reducers/notifReducer.js'
import { deleteBlog, likeBlog } from '../reducers/blogReducer.js'

import blogService from '../services/blogs.js'
import '../App.css'




const Blog = ({ blog }) => {
  // const [expanded, setExpanded] = useState(false)

  const signedinUser = useSelector(state => state.signedinUser)
  const dispatch = useDispatch()

  // DELETE BUTTON CONDITIONAL RENDERING LOGIC
  const deleteButtonStyle = {
    display:
      signedinUser.id === blog.user.id
        ? ''
        : 'none'
  }

  // const expandedInfoVisible = { display: expanded ? '' : 'none' }
  // const expandButtonText = () => expanded ? 'hide' : 'view'


  const handleLike = async (event) => {
    event.preventDefault()
    dispatch(likeBlog(blog))
    // await blogService.update(updatedBlog.id, updatedBlog)
    // setlikes(likes + 1)
    // console.log(res)
  }


  const handleDelete = async (id, title) => {
    if (window.confirm(`delete ${title}?`)) {
      dispatch(deleteBlog(id))
      // await blogService.deleteBlog(id)
      // setBlogs(blogs.filter((blog) => blog.id !== id))
      dispatch(setNotification(
        `BLOG ${title} HAS BEEN DELETED`,
        'success'
      ))
    } else {
      console.log('cancelled delete')
    }
  }

  // CONDITIONAL RENDERING - FOR NON SIGNED IN PERSON
  if (!signedinUser) {
    return null
  }

  return (

    <div className="blogPost">
      <h1>{blog.title} {blog.author}</h1>
      <Link to={blog.url}>{blog.url}</Link>

      <div className="likesInfo">
        {blog.likes} likes
        <button
          className="likeButton"
          onClick={(event) => handleLike(event)}
        >LIKE</button>
      </div>

      <div>
        added by {blog.author}
      </div>

      <div>
        <button
          className="deleteButton"
          onClick={() => handleDelete(blog.id, blog.title)}
          style={deleteButtonStyle}>DELETE</button>
      </div>

      {/* 
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
          likes: {blog.likes}
          <div>
            <button className="likeButton" onClick={(event) => handleLike(event)}>like</button>
          </div>
        </div>
        <div>{blog.user.username}</div>
        <button className="deleteButton" onClick={() => handleDelete(blog.id, blog.title)} style={deleteButton}>DELETE</button>
      </div> */}
    </div>
  )
}

// Blog.propTypes = {
//   blog: PropTypes.object.isRequired,
//   currUser: PropTypes.object.isRequired,
//   handleDelete: PropTypes.func.isRequired
// }

export default Blog
