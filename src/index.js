
import ReactDOM from 'react-dom'
import React from 'react'
import { Root } from './app.jsx'


import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'

let _entId = 0

function reducer(state = {}, action) {
  switch (action.type) {
    case 'rx-sketch':
      return {
        ...state,
        treeEntries: {
          byId: { ...state.treeEntries.byId, [action.obj.sketch.name]: action.obj },
          allIds: [...state.treeEntries.allIds, action.obj.sketch.name]
        }
      }
    case 'set-active-sketch':
      return {
        ...state, activeSketch: action.sketch
      }
    case 'exit-sketch':
      return {
        ...state, activeSketch: ''
      }
    case 'rx-extrusion':
      return {
        ...state,
        treeEntries: {
          byId: { ...state.treeEntries.byId, [action.mesh.name]: action.mesh },
          allIds: [...state.treeEntries.allIds, action.mesh.name]
        },
        mesh2sketch: {
          ...state.mesh2sketch,
          [action.sketch.sketch.name]: action.mesh.name
        }
      }
    case 'restore-state':
      return action.state
    default:
      return state
  }
}




const preloadedState = {
  treeEntries: {
    byId: {},
    allIds: []
  }
}





window.store = createStore(reducer, preloadedState, applyMiddleware(logger))



document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Root, { store: store }, null)
    , document.getElementById('react')
  );
});
