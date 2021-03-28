
// import { createStore, applyMiddleware } from 'redux'
// import logger from 'redux-logger'



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
var bbb = 'bbbx'
var store = Redux.createStore(reducer, {sketches:[]}, Redux.applyMiddleware(reduxLogger.logger))
