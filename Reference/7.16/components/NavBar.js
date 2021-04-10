import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route, Link, useHistory
} from 'react-router-dom'

import { logoutCurrentUser } from '../reducers/signedinUserReducer.js'

const Navbar = () => {
  const signedinUser = useSelector(state => state.signedinUser)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    // setUser(null)
    dispatch(logoutCurrentUser())
    history.push('/')
  }

  if (!signedinUser) {
    return null
  }

  return (
    <div>
      <Link to="/blogs">blogs</Link>
      <span>    </span>
      <Link to="/users">users</Link>
      <span>    </span>
      <span>{signedinUser.name} is logged in</span>
      <span>    </span>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Navbar