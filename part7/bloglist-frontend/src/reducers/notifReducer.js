const notifReducer = (state = { notifMessage: null, notifType: null, timeoutID: null },
  action
) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      if (state.timeoutID) {
        clearTimeout(state.timeoutID)
      }
      return {
        notifMessage: action.notifMessage,
        notifType: action.notifType,
        timeoutID: null
      }

    case 'REMOVE_NOTIFICATION':
      return {
        notifMessage: null,
        notifType: null,
        timeoutID: null
      }
    case 'REFRESH_TIMEOUT':
      return {
        ...state,
        timeoutID: action.timeoutID
      }
    default:
      return state
  }
}

export const setNotification = (notifMessage, notifType) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notifMessage,
      notifType
    })
    let timeoutID = await setTimeout(() => {
      dispatch({
        type: 'REMOVE_NOTIFICATION'
      })
    }, 5000)
    dispatch({
      type: 'REFRESH_TIMEOUT',
      timeoutID
    })
  }
}


export default notifReducer