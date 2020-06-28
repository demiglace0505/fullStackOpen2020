import React from 'react'

const NotificationBanner = ({ message, notifType }) => {
  if (message === null) {
    return null
  }

  if (notifType === 'success') {
    return (
      <div className="notifSuccess">{message}</div>
    )
  }

  if (notifType === 'error')
    return (
      <div className="notifError">{message}</div>
    )
}

export default NotificationBanner