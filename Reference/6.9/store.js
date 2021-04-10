import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import anecdoteReducer from './reducers/anecdoteReducer.js'

const store = createStore(anecdoteReducer, composeWithDevTools())

export default store