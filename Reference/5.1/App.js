import React, { useState, useEffect } from 'react'
import Blog from './components/Blog.js'
import LoginForm from './components/LoginForm.js'
import blogService from './services/blogs.js'
import loginService from './services/login.js'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in:', username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('ERROR!')
    }
  }

  return (
    <div>
      {
        user === null
          ?
          <div>
            <h1>log in to application</h1>
            <LoginForm 
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
          </div>
          :
          <div>
            <h1>blogs</h1>
            <p>{user.name} logged in</p>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
      }



    </div>
  )
}

export default App