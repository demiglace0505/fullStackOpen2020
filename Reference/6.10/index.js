import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store.js'

import { notificationChange } from './reducers/notificationReducer.js'


store.dispatch(notificationChange('Test notification'))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)