import React from 'react'
import { useSelector } from 'react-redux'

import {
  Alert, AlertTitle
} from '@material-ui/lab'

const NotificationBanner = () => {
  const notification = useSelector(state => state.notification)

  if (notification.notifMessage === null) {
    return null
  }

  if (notification.notifType === 'success') {
    return (
      <Alert severity="success">
        <AlertTitle>Success!</AlertTitle>
        {notification.notifMessage}
      </Alert>
    )
  }
  if (notification.notifType === 'error') {
    return (
      <Alert severity="error">
        <AlertTitle>Error!</AlertTitle>
        {notification.notifMessage}
      </Alert>
    )
  }
}

export default NotificationBanner