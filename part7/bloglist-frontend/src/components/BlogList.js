import React from 'react'
import {useSelector} from 'react-redux'

import Blog from './Blog.js'

const BlogList =() => {
  const blogs = useSelector(state => state.blogs)

  return(
    <div className="allBlogs">
      <Blog />
    </div>
  )
}

export default BlogList