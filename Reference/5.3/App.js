import React, { useState, useEffect } from 'react'
import Blog from './components/Blog.js'
import LoginForm from './components/LoginForm.js'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import BlogForm from './components/BlogForm.js'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlogTitle, setnewBlogTitle] = useState('')
  const [newBlogAuthor, setnewBlogAuthor] = useState('')
  const [newBlogUrl, setnewBlogUrl] = useState('')
  const [user, setUser] = useState(null)

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
      console.log('ERROR!')
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    console.log('sending:', newBlogTitle, newBlogAuthor, newBlogUrl)
    try {
      const newBlog = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      }
      console.log(newBlog)
      const returnedBlog = await blogService.create(newBlog)
      // console.log('after await')
      setBlogs(blogs.concat(returnedBlog))
      setnewBlogTitle('')
      setnewBlogAuthor('')
      setnewBlogUrl('')
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  return (
    <div>
      {
        user === null
          ?
          <div>
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
            <div>
              <BlogForm
                user={user}
                handleLogout={handleLogout}
                handleCreateBlog={handleCreateBlog}
                newBlogTitle={newBlogTitle}
                newBlogAuthor={newBlogAuthor}
                newBlogUrl={newBlogUrl}
                setnewBlogTitle={setnewBlogTitle}
                setnewBlogAuthor={setnewBlogAuthor}
                setnewBlogUrl={setnewBlogUrl}
              />
            </div>
            <div>
              {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
            </div>
          </div>
      }
    </div>
  )
}

export default App