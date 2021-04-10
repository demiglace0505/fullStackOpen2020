import React, { useState, useEffect } from 'react'
import Togglable from './components/Togglable.js'
import Blog from './components/Blog.js'
import LoginForm from './components/LoginForm.js'
import NotificationBanner from './components/NotificationBanner.js'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import BlogForm from './components/BlogForm.js'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifMessage, setnotifMessage] = useState(null)
  const [notifType, setnotifType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in:', username, password)
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setnotifType('error')
      setnotifMessage(
        `wrong username or password`
      )
      setTimeout(() => {
        setnotifMessage(null)
        setnotifType(null)
      }, 5000)
    }
  }

  const addBlog = async (newBlog) => {
      const returnedBlog = await blogService.create(newBlog)
      // console.log('after await')
      setBlogs(blogs.concat(returnedBlog))
      setnotifType('success')
      setnotifMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      setTimeout(() => {
        setnotifMessage(null)
        setnotifType(null)
      }, 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog'>
      <BlogForm
        addBlog={addBlog}
      />
    </Togglable>
  )

  return (
    <div>
      <div>
        <NotificationBanner notifType={notifType} notifMessage={notifMessage} />
      </div>

      <div>
        {
          user === null
            ?
            loginForm()
            :
            <div>
              <div>
                <h1>blogs</h1>
                <p>
                  {user.name} is logged in <button onClick={handleLogout}>logout</button>
                </p>
              </div>

              <div>
                {blogForm()}
              </div>

              <div>
                {blogs.map(blog =>
                  <Blog key={blog.id} blog={blog} />
                )}
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default App