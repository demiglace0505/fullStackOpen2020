import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { CREATE_BOOK, ALL_BOOKS } from '../queries/queries.js'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook, result] = useMutation(CREATE_BOOK, {
    onError: (err) => {
      console.log(err.graphQLErrors[0].message)
    },
    update: (store, response) => {
      console.log('createbook', response.data.addBook)
      props.updateCacheWith(response.data.addBook)
    }
    // replaced with updateCacheWith() 
    // update: (store, response) => {
    //   const dataInStore = store.readQuery({ query: ALL_BOOKS })
    //   store.writeQuery({
    //     query: ALL_BOOKS,
    //     data: {
    //       ...dataInStore,
    //       allBooks: [
    //         ...dataInStore.allBooks,
    //         response.data.addBook
    //       ]
    //     }
    //   })
    // }
  })

  if (!props.show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    console.log('adding book...')
    createBook({
      variables: {
        title, author, published, genres
      }
    })
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook