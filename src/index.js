
import ReactDOM from 'react-dom'
import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'

import { Root } from './app.jsx'
import { Renderer } from "./Renderer"



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

export const store = createStore(reducer, {sketches:[]}, applyMiddleware(logger))
window.store = store;



export const renderInst = new Renderer(store);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Root, { store: store }, null)
    , document.getElementById('react')
  );
});
