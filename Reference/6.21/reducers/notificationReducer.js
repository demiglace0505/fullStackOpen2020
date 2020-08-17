const notificationReducer = (
  state = { message: null, timeoutID: null },
  action
) => {
  // console.log('state before action: ', state)
  // console.log('action', action)
  switch (action.type) {
    case 'SET_NOTIFICATION':
      if (state.timeoutID) {
        clearTimeout(state.timeoutID)
      }
      return { message: action.message, timeoutID: null }
    case 'REMOVE_NOTIFICATION':
      return { message: null, timeoutID: null }
    case 'SET_TIMEOUTID':
      return { ...state, timeoutID: action.timeoutID }
    default:
      return state
  }
}

export const setNotification = (message, duration) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      message
    })
    let timeoutID = await setTimeout(() => {
      dispatch({
        type: 'REMOVE_NOTIFICATION'
      })
    }, duration * 1000)
    dispatch({ type: 'SET_TIMEOUTID', timeoutID })
  }
}

export default notificationReducer