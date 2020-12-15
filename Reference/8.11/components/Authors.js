
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries/queries.js'

const Authors = (props) => {
  const [name, setname] = useState('')
  const [year, setyear] = useState('')

  const authors = useQuery(ALL_AUTHORS)
  const [changeBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = (event) => {
    event.preventDefault()
    changeBirthyear(
      {
        variables: {
          name: name,
          setBornTo: parseInt(year)
        }
      }
    )
    setname('')
    setyear('')
  }

  if (!props.show) {
    return null
  }

  if (authors.loading) {
    return <div>loading authors...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={(event) => setname(event.target.value)}
          />
        </div>
        <div>
          born
          <input
            value={year}
            onChange={(event) => setyear(event.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>

    </div>
  )
}

export default Authors
