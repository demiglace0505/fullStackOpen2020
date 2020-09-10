import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import setNotification from '../reducers/notifReducer.js'

import loginService from '../services/login.js'
import blogService from '../services/blogs.js'
import { setCurrentUser } from '../reducers/signedinUserReducer.js'

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
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <h1>log in to application</h1>
      username
      <input
            id="username-input"
            type="text"
            value={username}
            name="Username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          password
      <input
            id="password-input"
            type="password"
            value={password}
            name="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm