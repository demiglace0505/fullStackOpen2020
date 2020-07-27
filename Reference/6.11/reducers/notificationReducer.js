const notificationReducer = (state = null, action) => {
  // console.log('state before action: ', state)
  // console.log('action', action)
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return `You voted ${action.content}`
    case 'REMOVE_NOTIFICATION':
      return null
    default:
      return state
  }
}

export const setNotification = (content) => {
  return {
    type: 'SET_NOTIFICATION',
    content
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION'
  }
}

export default notificationReducer