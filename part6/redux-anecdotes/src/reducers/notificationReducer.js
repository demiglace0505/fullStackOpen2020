const notificationReducer = (state = 'hello', action) => {
  // console.log('state before action: ', state)
  // console.log('action', action)
  switch (action.type) {
    case 'NOTIFY':
      return action.notifMessage
    default:
      return state
  }
}

export const notificationChange = (notifMessage) => {
  return {
    type: 'NOTIFY',
    notifMessage
  }
}

export default notificationReducer