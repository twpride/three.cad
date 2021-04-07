
import ReactDOM from 'react-dom'
import React from 'react'

import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { reducer, preloadedState } from './reducer'
import logger from 'redux-logger'

import { Tree } from './tree'
import { NavBar } from './navBar'
import { ToolTip} from './toolTip'

import './app.css'

const store = createStore(reducer, preloadedState, applyMiddleware(logger))

const App = ({ store }) => (
  <Provider store={store}>
    <NavBar />
    <Tree />
    <ToolTip/>
  </Provider>
);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App store={store} />, document.getElementById('react'));
});

window.store = store