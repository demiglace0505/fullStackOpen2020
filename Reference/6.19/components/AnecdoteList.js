import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer.js'
import { setNotification, removeNotification } from '../reducers/notificationReducer.js'

const AnecdoteList = (props) => {
  // const anecdoteFilter = useSelector(state => state.filter)
  // const anecdotes = useSelector(state => state.anecdotes)
  // const dispatch = useDispatch()

  const vote = (anecdote) => {
    // console.log('vote', id)
    // dispatch(voteAnecdote(anecdote))
    // dispatch(setNotification(`You voted '${anecdote.content}'`, 3))
    // dispatch(setNotification(`You voted '${anecdote.content}'`))
    // setTimeout(()=> {
    //   dispatch(removeNotification())
    // }, 5000)
  }

  const anecdotesToShow = props.filter === ''
    ? props.anecdotes
    : props.anecdotes.filter((a) => a.content.includes(props.filter))

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

const mapStateToProps = (state) => {
  console.log(state)
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

export default connect(mapStateToProps)(AnecdoteList)