import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer.js'
import { setNotification, removeNotification } from '../reducers/notificationReducer.js'

const AnecdoteList = (props) => {
  const anecdoteFilter = useSelector(state => state.filter)
  const anecdotes = useSelector(state => state.anecdotes)
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    // console.log('vote', id)
    dispatch(voteAnecdote(anecdote.id))
    dispatch(setNotification(anecdote.content))
    setTimeout(()=> {
      dispatch(removeNotification())
    }, 5000)
  }

  const anecdotesToShow = anecdoteFilter === ''
    ? anecdotes
    : anecdotes.filter((a) => a.content.includes(anecdoteFilter))

  const sortedAnecdotes = anecdotesToShow.sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList