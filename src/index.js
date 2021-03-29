
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
        ...state, treeEntries: {
          byId: { ...state.treeEntries.byId, ['s' + ++_entId]: action.obj },
          allIds: [...state.treeEntries.allIds, 's' + _entId]
        }
      }
    case 'rx-extrusion':
      return {
        ...state,
        treeEntries: {
          byId: { ...state.treeEntries.byId, ['e' + ++_entId]: action.obj },
          allIds: [...state.treeEntries.allIds, 'e' + _entId]
        },
        mesh2sketch: {
          ...state.mesh2sketch,
          [action.skId]: _entId
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
