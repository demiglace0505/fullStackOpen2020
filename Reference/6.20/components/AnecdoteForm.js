import React from 'react'
import { useDispatch, connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer.js'
import { setNotification, } from '../reducers/notificationReducer.js'

const AnecdoteForm = (props) => {
  // const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    // console.log(event.target)
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
    props.setNotification(`New anecdote '${content}' created`, 10)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    createAnecdote: value => {
      dispatch(createAnecdote(value))
    },
    setNotification: setNotification
  }
}


export default connect(
  null,
  mapDispatchToProps
)(AnecdoteForm)