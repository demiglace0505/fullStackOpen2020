
import React, { useState } from 'react'

import { useApolloClient, useSubscription } from '@apollo/client'

import Authors from './components/Authors.js'
import Books from './components/Books.js'
import NewBook from './components/NewBook.js'
import LoginForm from './components/LoginForm.js'
import Recommended from './components/Recommended.js'

import { ALL_BOOKS, BOOK_ADDED } from './queries/queries.js'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => { set.map(b => b.id).includes(object.id) }
    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    // add new book if it is not yet in cache
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          allBooks: dataInStore.allBooks.concat(addedBook)
        }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('subscription data', subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`New book: ${subscriptionData.data.bookAdded.title} successfully added`)
      updateCacheWith(addedBook)
    }
  })

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
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} updateCacheWith={updateCacheWith} />
      <Recommended show={page === 'recommend'} />

    </div>
  )
}

export default App