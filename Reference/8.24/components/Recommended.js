import React from 'react'
import { useQuery } from '@apollo/client'

import { WHOAMI, ALL_BOOKS } from '../queries/queries.js'
import generateTable from '../helpers/generateTable.js'

const Recommended = (props) => {
  const books = useQuery(ALL_BOOKS)
  const user = useQuery(WHOAMI)
  // console.log('user', user)

  if (!props.show) {
    return null
  }

  if (user.loading || books.loading) {
    return <div>loading...</div>
  }

  const faveGenre = user.data.me.favoriteGenre
  const bookArr = books.data.allBooks.filter((b) => b.genres.includes(faveGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        {`books in your favorite genre `} <strong>{`${faveGenre}`}</strong>
      </div>
      {generateTable(bookArr)}
    </div>
  )
}

export default Recommended