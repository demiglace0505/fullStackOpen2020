import React, { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries/queries.js'
import generateTable from '../helpers/generateTable.js'

const Books = (props) => {
  const [filter, setFilter] = useState('all genres')
  const books = useQuery(ALL_BOOKS)
  // console.log(books)
  let bookArr = []

  if (!props.show) {
    return null
  }

  if (books.loading) {
    return <div>loading books...</div>
  }

  if (filter === 'all genres') {
    bookArr = books.data.allBooks
  } else {
    bookArr = books.data.allBooks.filter((b) => b.genres.includes(filter))
  }

  return (
    <div>
      <h2>books</h2>
      <div>
        {`in genre `} <strong>{`${filter}`}</strong>
      </div>
      {generateTable(bookArr)}
      <GenreBar books={books} setFilter={setFilter} />
    </div>
  )
}

const GenreBar = ({ books, setFilter }) => {
  let allGenres = []
  books.data.allBooks.forEach((b) => {
    allGenres = allGenres.concat(b.genres)
  })
  allGenres = allGenres.filter((value, index, self) => self.indexOf(value) === index)

  return (
    <div>
      {allGenres.map(g =>
        <button
          key={g}
          onClick={() => setFilter(g)}
        >{g}</button>
      )}
      <button onClick={() => setFilter('all genres')}>all genres</button>
    </div>
  )
}

export default Books