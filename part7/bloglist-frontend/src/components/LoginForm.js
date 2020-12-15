import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import setNotification from '../reducers/notifReducer.js'

import loginService from '../services/login.js'
import blogService from '../services/blogs.js'
import { setCurrentUser } from '../reducers/signedinUserReducer.js'

import {
  Button,
  TextField,
  Container,
  Paper,
  Box
} from '@material-ui/core'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null)
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in:', username, password)
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setCurrentUser(user))
      // setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('handleLogin', exception)
      dispatch(setNotification(
        'wrong username or password',
        'error'))
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3}>
        <Box padding={6}>

          <form
            onSubmit={handleLogin}
          >
            <h1>Hello.</h1>
            <div>
              <TextField
                id="username-input"
                type="text"
                value={username}
                label="Username"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div>
              <TextField
                id="password-input"
                type="password"
                value={password}
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              id="login-button"
              type="submit"
              fullWidth
            >
              login
        </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginForm