import React, { useState } from 'react'


const BlogForm = ({ addBlog }) => {
  const [newBlogTitle, setnewBlogTitle] = useState('')
  const [newBlogAuthor, setnewBlogAuthor] = useState('')
  const [newBlogUrl, setnewBlogUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()
    console.log('sending:', newBlogTitle, newBlogAuthor, newBlogUrl)
    addBlog({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
    })
    setnewBlogTitle('')
    setnewBlogAuthor('')
    setnewBlogUrl('')
  }

  return (

    <div>
      <h1>create new</h1>
      <form onSubmit={createBlog}>
        <div>
          title: <input
            type="text"
            value={newBlogTitle}
            name="Title"
            onChange={({ target }) => setnewBlogTitle(target.value)}
          />
        </div>
        <div>
          author: <input
            type="text"
            value={newBlogAuthor}
            name="Author"
            onChange={({ target }) => setnewBlogAuthor(target.value)}
          />
        </div>
        <div>
          url: <input
            type="text"
            value={newBlogUrl}
            name="URL"
            onChange={({ target }) => setnewBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm