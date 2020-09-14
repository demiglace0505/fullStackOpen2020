import blogService from '../services/blogs.js'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data
    case 'NEW_BLOG':
      return [
        ...state, action.data
      ]
    case 'DELETE_BLOG':
      // console.log('action.data', action.data)
      return state.filter((b) => b.id !== action.data)
    case 'LIKE_BLOG':
      const likedBlogIdx = state.findIndex((b) => b.id === action.data)
      return state.map((b, idx) => {
        if (idx !== likedBlogIdx) {
          return b
        }
        return {
          ...b,
          likes: b.likes+1
        }
      })
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createNewBlog = (newBlog) => {
  return async dispatch => {
    const returnedBlog = await blogService.create(newBlog)
    dispatch({
      type: 'NEW_BLOG',
      data: returnedBlog
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    const returnedBlog = await blogService.deleteBlog(id)
    // console.log(returnedBlog)
    dispatch({
      type: 'DELETE_BLOG',
      data: id
    })
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    dispatch({
      type: 'LIKE_BLOG',
      data: blog.id
    })
  }
}


export default blogReducer