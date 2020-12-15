import userService from '../services/users.js'

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.payload
    default:
      return state
  }
}

export const fetchAllUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      payload: users
    })
  }
}

export default usersReducer