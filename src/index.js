
import ReactDOM from 'react-dom'
import React from 'react'
import { Root } from './app.jsx'


import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'

let _entId = 0

function reducer(state = {}, action) {
  switch (action.type) {
    case 'toggle':
      return { ...state, toggle: action.payload }
    case 'rx-sketch':
      return {
        ...state, treeEntries: [...state.treeEntries, action.obj.name]
        ,
      }
    case 'set-active-sketch':
      return {
        ...state, activeSketch: action.sketch.name
      }
    case 'exit-sketch':
      return {
        ...state, activeSketch: ''
      }
    case 'rx-extrusion':
      return {
        ...state,
        treeEntries: [...state.treeEntries, action.mesh.name]
        ,
        mesh2sketch: {
          ...state.mesh2sketch,
          [action.sketch.name]: action.mesh.name
        }
      }
    case 'restore-state':
      return action.state
    default:
      return state
  }
}




const preloadedState = {
  treeEntries: [
    // 's1','m1'
  ]
  ,
}





window.store = createStore(reducer, preloadedState, applyMiddleware(logger))



document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Root, { store: store }, null)
    , document.getElementById('react')
  );
});
