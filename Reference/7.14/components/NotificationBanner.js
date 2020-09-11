import React from 'react'
import { useSelector } from 'react-redux'

const NotificationBanner = () => {
  const notification = useSelector(state => state.notification)

  if (notification.notifMessage === null) {
    return null
  }

  if (notification.notifType === 'success') {
    return (
      <div className="notifSuccess">{notification.notifMessage}</div>
    )
  }
  if (notification.notifType === 'error') {
    return (
      <div className="notifError">{notification.notifMessage}</div>
    )
  }
}

export default NotificationBanner