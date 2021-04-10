const anecdoteReducer = (state = [], action) => {
  // console.log('state before action: ', state)
  // console.log('action', action)
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data
    case 'VOTE':
      const id = action.data.id
      const anecdoteToVote = state.find(a => a.id === id)
      const updatedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      return state.map(anecdote => 
          anecdote.id !== id ? anecdote : updatedAnecdote
        )
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    default:
      return state
  }
}

const getId = () => (100000 * Math.random()).toFixed(0)

export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes
  }
}

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    data: {
      content,
      id: getId(),
      votes: 0
    }
  }
}

export default anecdoteReducer