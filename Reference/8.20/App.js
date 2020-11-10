
import React, { useState } from 'react'

import Authors from './components/Authors.js'
import Books from './components/Books.js'
import NewBook from './components/NewBook.js'
import LoginForm from './components/LoginForm.js'
import Recommended from './components/Recommended.js'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} />
        <LoginForm show={page === 'login'} setToken={setToken} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={() => setToken(null)}>logout</button>
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Recommended show={page === 'recommend'} />

    </div>
  )
}

export default App