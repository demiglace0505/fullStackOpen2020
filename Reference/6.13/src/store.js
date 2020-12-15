import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import anecdoteReducer from './reducers/anecdoteReducer.js'
import notificationReducer from './reducers/notificationReducer.js'
import filterReducer from './reducers/filterReducer.js'

const reducers = combineReducers({
  anecdotes: anecdoteReducer,
  notification: notificationReducer,
  filter: filterReducer
})

const store = createStore(reducers, composeWithDevTools())

export default store