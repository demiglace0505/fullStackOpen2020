import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ username, password, handleLogin, setUsername, setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      <h1>log in to application</h1>
      username
      <input
        id="username-input"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
      <input
        id="password-input"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button id="login-button" type="submit">login</button>
  </form>
)

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired
}

export default LoginForm