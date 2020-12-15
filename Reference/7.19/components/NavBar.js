import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route, Link, useHistory
} from 'react-router-dom'

import { logoutCurrentUser } from '../reducers/signedinUserReducer.js'

import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Tabs, Tab
} from '@material-ui/core'

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
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" flexGrow={1}>
          <Tabs>
            {/* <Link to="/blogs" className="tabLink"> */}
            <Tab component={Link} to="/blogs" label="BLOGS" />
            {/* </Link> */}
            <Tab component={Link} to="/users" label="USERS" />
            {/* <Link to="/users" className="tabLink"><Tab label="USERS" index={1} /></Link> */}
          </Tabs>
        </Box>
        <span>{signedinUser.name} is logged in</span>
        <span>    </span>
        <Button color="inherit" onClick={handleLogout}>logout</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar