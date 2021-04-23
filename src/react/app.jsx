import ReactDOM from 'react-dom'
import React from 'react'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { reducer } from './reducer'

import { Tree } from './tree'
import { NavBar } from './navBar'
import { ToolTip } from './toolTip'

import './app.css'

// export async function serial(...args) {
//   return (await import('bson')).serialize(...args);
// }

// export async function deserial(...args) {
//   return (await import('bson')).deserialize(...args);
// }

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

export let sce
export let fs

document.addEventListener('DOMContentLoaded', async () => {

  const { Scene } = await import('../Scene')
  sce = new Scene(store)
  // window.sc = sce

  ReactDOM.render(<App store={store} />, document.getElementById('react'));

  fs = await import ('../../node_modules/browser-fs-access/dist/index')

});

// window.store = store