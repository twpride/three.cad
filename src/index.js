
import ReactDOM from 'react-dom'
import React from 'react'
import { Root } from './app.jsx'


import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'

let _entId = 0

function reducer(state = {}, action) {
  let id;
  switch (action.type) {
    case 'toggle':
      return { ...state, toggle: action.payload }
    case 'rx-sketch':
      id = 's' + action.obj.id
      return {
        ...state, treeEntries: {
          byId: { ...state.treeEntries.byId, [id]: action.obj },
          allIds: [...state.treeEntries.allIds, id]
        },
        env: id
      }
    case 'rx-extrusion':
      id = 'e' + action.mesh.id
      return {
        ...state,
        treeEntries: {
          byId: { ...state.treeEntries.byId, [id]: action.mesh },
          allIds: [...state.treeEntries.allIds, id]
        },
        mesh2sketch: {
          ...state.mesh2sketch,
          ['s' + action.sketch.id]: id
        }
      }
    case 'incsk':
      return { ...state, id: _sketchID++ }
    default:
      return state
  }
}




const preloadedState = {
  treeEntries: {
    byId: {
      // "s1": obj,
      // "s1": obj2,
    },
    allIds: [
      // 's1','m1'
    ]
  },
}





window.store = createStore(reducer, preloadedState, applyMiddleware(logger))



document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Root, { store: store }, null)
    , document.getElementById('react')
  );
});
