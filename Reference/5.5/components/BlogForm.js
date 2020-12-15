import React from 'react'


const BlogForm = ({
  handleCreateBlog,
  newBlogTitle,
  setnewBlogTitle,
  newBlogAuthor,
  setnewBlogAuthor,
  newBlogUrl,
  setnewBlogUrl
}) => (

    <div>
      <h1>create new</h1>
      <form onSubmit={handleCreateBlog}>
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

export default BlogForm