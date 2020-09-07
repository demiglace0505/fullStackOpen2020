import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { setNotification } from '../reducers/notifReducer.js'
import { createNewBlog } from '../reducers/blogReducer.js'


const BlogForm = () => {
  const [newBlogTitle, setnewBlogTitle] = useState('')
  const [newBlogAuthor, setnewBlogAuthor] = useState('')
  const [newBlogUrl, setnewBlogUrl] = useState('')

  const dispatch = useDispatch()

  const createBlog = (event) => {
    event.preventDefault()
    console.log('sending:', newBlogTitle, newBlogAuthor, newBlogUrl)
    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }
    setnewBlogTitle('')
    setnewBlogAuthor('')
    setnewBlogUrl('')
    dispatch(createNewBlog(newBlog))
    dispatch(setNotification(
      `A NEW BLOG ${newBlog.title} by ${newBlog.author} HAS BEEN ADDED`,
      'success'))
  }

  return (
    <div>
      <h1>create new</h1>
      <form onSubmit={createBlog}>
        <div>
          title: <input
            id="title-input"
            type="text"
            value={newBlogTitle}
            name="Title"
            onChange={(event) => setnewBlogTitle(event.target.value)}
          />
        </div>
        <div>
          author: <input
            id="author-input"
            type="text"
            value={newBlogAuthor}
            name="Author"
            onChange={(event) => setnewBlogAuthor(event.target.value)}
          />
        </div>
        <div>
          url: <input
            id="url-input"
            type="text"
            value={newBlogUrl}
            name="URL"
            onChange={(event) => setnewBlogUrl(event.target.value)}
          />
        </div>
        <button id="createBlog-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm