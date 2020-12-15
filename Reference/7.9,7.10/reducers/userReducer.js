const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

export const setCurrentUser = (user) => {
  return {
    type: 'SET_USER',
    user
  }
}

export const logoutCurrentUser = () => {
  return {
    type: 'LOGOUT'
  }
}

export default userReducer