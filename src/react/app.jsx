
import ReactDOM from 'react-dom'
import React, { } from 'react'

import { createStore, applyMiddleware } from 'redux'
import { Provider, useSelector } from 'react-redux'
import { reducer } from './reducer'
import logger from 'redux-logger'

import { Tree } from './tree'
import { NavBar } from './navBar'
import { ToolTip } from './toolTip'


import './app.css'

const preloadedState = {
  treeEntries: {
    byId: {},
    allIds: [],
    tree: {},
    order: {},
    visible: {},
    activeSketchId: ""
  },
}

// const store = createStore(reducer, preloadedState, applyMiddleware(logger))


const store = createStore(reducer, {}, applyMiddleware(logger))
// const store = createStore(reducer, sc.loadState(), applyMiddleware(logger))


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