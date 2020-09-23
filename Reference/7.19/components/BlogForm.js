import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { setNotification } from '../reducers/notifReducer.js'
import { createNewBlog } from '../reducers/blogReducer.js'

import {
  createMuiTheme
} from '@material-ui/core/styles'
import {
  TextField, Button
} from '@material-ui/core'

const theme = createMuiTheme({

})


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
          <TextField
            value={newBlogTitle}
            onChange={(e) => setnewBlogTitle(e.target.value)}
            variant="outlined"
            label="Title"
            size="small"
            margin="dense"
            required
          />
        </div>

        <div>
          <TextField
            value={newBlogAuthor}
            onChange={(e) => setnewBlogAuthor(e.target.value)}
            variant="outlined"
            label="Author"
            size="small"
            margin="dense"
            required
          />
        </div>

        <div>
          <TextField
            value={newBlogUrl}
            onChange={(e) => setnewBlogUrl(e.target.value)}
            variant="outlined"
            label="URL"
            size="small"
            margin="dense"
            required
          />
        </div>

        <Button
          id="createBlog-button"
          type="submit"
          variant="contained"
          color="primary"
        >
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm