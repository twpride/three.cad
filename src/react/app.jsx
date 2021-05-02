import ReactDOM from 'react-dom'
import React from 'react'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { reducer } from './reducer'

import { Tree } from './tree'
import { NavBar } from './navBar'
import { ToolTip } from './toolTip'

import './app.css'
import { Help } from './help'


let store
if (process.env.NODE_ENV === 'production') {
  store = createStore(reducer)
} else {
  const { logger } = require(`redux-logger`);
  store = createStore(reducer, {}, applyMiddleware(logger))
}


const App = ({ store }) => {
  return <Provider store={store}>
    <NavBar />
    <Tree />
    <ToolTip />
  </Provider>
}


document.addEventListener('DOMContentLoaded', () => {

  ReactDOM.render(<App store={store} />, document.getElementById('react'));


});

window.store = store