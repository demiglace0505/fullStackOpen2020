import React from 'react'
import { useSelector } from 'react-redux'
import {
  Switch, Route, Link,
  useRouteMatch
} from 'react-router-dom'

import Blog from './Blog.js'
import BlogForm from './BlogForm.js'
import Togglable from './Togglable.js'
import '../App.css'

import {
  Box,
  Card, CardContent
} from '@material-ui/core'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  const blogMatch = useRouteMatch('/blogs/:id')

  const blog = blogMatch
    ? blogs.find(b => b.id === blogMatch.params.id)
    : null

  return (
    <Switch>
      <Route path='/blogs/:id'>
        <Blog blog={blog} />
      </Route>

      <Route path='/blogs'>
        <h1>blogs</h1>
        <Togglable openLabel='new blog' closeLabel='cancel'>
          <Box>
            <BlogForm />
          </Box>
        </Togglable>
        <div className="allBlogs">
          {blogs.map((b) =>
            <Card className="bloglistCard" elevation={3} square="true" key={b.id}>
              <CardContent>
                <Link to={`/blogs/${b.id}`}>{b.title} - {b.author}</Link>
              </CardContent>
            </Card>
          )}
        </div>
      </Route>
    </Switch>
  )
}

export default BlogList