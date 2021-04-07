
import ReactDOM from 'react-dom'
import React from 'react'

import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'


import { Tree } from './treeEntry'
import { NavBar } from './navBar'
import { reducer, preloadedState } from './reducer'

import './app.css'


window.store = createStore(reducer, preloadedState, applyMiddleware(logger))


const App = ({ store }) => (
  <Provider store={store}>
    <NavBar />
    <Tree />
  </Provider>
);


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App store={store} />, document.getElementById('react'));
});

