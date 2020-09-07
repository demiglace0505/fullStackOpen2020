import blogService from '../services/blogs.js'

const blogReducer = (state=[], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data
    case 'NEW_BLOG':
      return [
        ...state, action.data
      ]
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


export default blogReducer