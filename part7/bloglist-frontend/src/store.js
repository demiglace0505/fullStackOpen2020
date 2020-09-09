import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import blogReducer from './reducers/blogReducer.js'
import notifReducer from './reducers/notifReducer.js'
import userReducer from './reducers/userReducer.js'

const reducers = combineReducers({
  blogs: blogReducer,
  user: userReducer,
  notification: notifReducer,
})

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store