import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import blogReducer from './reducers/blogReducer.js'
import notifReducer from './reducers/notifReducer.js'
import signedinUserReducer from './reducers/signedinUserReducer.js'
import usersReducer from './reducers/usersReducer.js'

const reducers = combineReducers({
  blogs: blogReducer,
  signedinUser: signedinUserReducer,
  notification: notifReducer,
  users: usersReducer
})

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store