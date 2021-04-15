
import ReactDOM from 'react-dom'
import React, { useState } from 'react'

import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { reducer } from './reducer'
import logger from 'redux-logger'

import { Tree } from './tree'
import { NavBar } from './navBar'
import { ToolTip} from './toolTip'
import { Dialog } from './dialog'

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

const App = ({ store }) => {
  const [dialog, setDialog] = useState()

  return <Provider store={store}>
    <NavBar setDialog={setDialog}/>
    <Tree />
    <Dialog dd={dialog}/>
    <ToolTip/>
  </Provider>
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App store={store} />, document.getElementById('react'));
});

window.store = store