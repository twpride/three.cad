
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
          byNid: { ...state.treeEntries.byNid, [action.obj.obj3d.name]: action.obj },
          allNids: [...state.treeEntries.allNids, action.obj.obj3d.name]
        }
      }
    case 'set-active-sketch':
      return {
        ...state, activeSketchNid: action.sketch
      }
    case 'exit-sketch':
      return {
        ...state, activeSketchNid: ''
      }
    case 'rx-extrusion':
      return {
        ...state,
        treeEntries: {
          byNid: { ...state.treeEntries.byNid, [action.mesh.name]: action.mesh },
          allNids: [...state.treeEntries.allNids, action.mesh.name]
        },
        mesh2sketch: {
          ...state.mesh2sketch,
          [action.sketch.obj3d.name]: action.mesh.name
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
    byNid: {},
    allNids: []
  }
}





window.store = createStore(reducer, preloadedState, applyMiddleware(logger))




document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Root, { store: store }, null)
    , document.getElementById('react')
  );
});
