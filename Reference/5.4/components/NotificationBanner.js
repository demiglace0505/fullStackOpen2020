import React from 'react'

const NotificationBanner = ( {notifMessage, notifType} ) => {
  if (notifMessage === null) {
    return null
  }
  if (notifType === 'success') {
    return (
      <div className="notifSuccess">{notifMessage}</div>
    )
  }
  if (notifType === 'error') {
    return (
      <div className="notifError">{notifMessage}</div>
    )
  }
}

export default NotificationBanner