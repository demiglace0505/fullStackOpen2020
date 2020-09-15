/// to do: trimming, check for token functionalities. fix failed login error message


import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom'

import { initializeBlogs, deleteBlog } from './reducers/blogReducer.js'
import { setNotification } from './reducers/notifReducer.js'
import { setCurrentUser, logoutCurrentUser } from './reducers/signedinUserReducer.js'
import { fetchAllUsers } from './reducers/usersReducer.js'

import Togglable from './components/Togglable.js'
import BlogList from './components/BlogList.js'
import LoginForm from './components/LoginForm.js'
import NotificationBanner from './components/NotificationBanner.js'
import UsersList from './components/UsersList.js'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import BlogForm from './components/BlogForm.js'
import Navbar from './components/NavBar.js'
import Home from './components/Home.js'



const App = () => {

  const blogs = useSelector(state => state.blogs)
  const signedinUser = useSelector(state => state.signedinUser)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])


  useEffect(() => {
    dispatch(setNotification('test', 'error'))
  }, [dispatch])


  useEffect(() => {
    const signedinUserJSON = window.localStorage.getItem('loggedUser')
    // console.log(signedinUserJSON)
    if (signedinUserJSON) {
      const signedinUser = JSON.parse(signedinUserJSON)
      dispatch(setCurrentUser(signedinUser))
      blogService.setToken(signedinUser.token)
      // setUser(user)
      // console.log('current user:', user)
    }
  }, [])

  const sortBlogs = (blogs) => {
    blogs.sort((a, b) => b.likes - a.likes)
  }



  const handleDelete = async (id, title) => {
    if (window.confirm(`delete ${title}?`)) {
      // console.log('hella lit')
      dispatch(deleteBlog(id))
      // await blogService.deleteBlog(id)
      // setBlogs(blogs.filter((blog) => blog.id !== id))
      dispatch(setNotification(
        `BLOG ${title} HAS BEEN DELETED`,
        'success'
      ))
    } else {
      console.log('cancelled delete')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    // setUser(null)
    dispatch(logoutCurrentUser())
  }

  const loginForm = () => (
    <LoginForm />
  )

  const blogForm = () => (
    <Togglable openLabel='new blog' closeLabel='cancel'>
      <BlogForm />
    </Togglable>
  )

  return (
    <div>
      <Router>
        <Navbar />
        <NotificationBanner />

        <div>
          {
            signedinUser === null
              ?
              <LoginForm />
              :
              <div>
                <Switch>
                  <Route path="/blogs">
                    <BlogList />
                  </Route>
                  <Route path="/users">
                    <UsersList />
                  </Route>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
              </div>
          }
        </div>
      </Router>
    </div>
  )
}

export default App