import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import CssBaseline from '@material-ui/core/CssBaseline'

import './App.css'
import App from './App.js'
import store from './store.js'


ReactDOM.render(
  <Provider store={store}>
    <CssBaseline />
    <App />
  </Provider>,
  document.getElementById('root'))