
import ReactDOM from 'react-dom'
import React from 'react'
import { Root } from './app.jsx'


import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'



function reducer(state = {}, action) {
  switch (action.type) {
    case 'toggle':
      return { ...state, toggle: action.payload }
    case 'rx-new-sketch':
      return { ...state, sketches: [...state.sketches, action.idx] }
    default:
      return state
  }
}

window.store = createStore(reducer, {sketches:[]}, applyMiddleware(logger))



document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Root, { store: store }, null)
    , document.getElementById('react')
  );
});
