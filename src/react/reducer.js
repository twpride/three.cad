

import { DepTree } from './depTree.mjs'
import update from 'immutability-helper'
import { combineReducers } from 'redux';

const defaultState = {
  byId: {},
  allIds: [],
  tree: {},
  order: {},
  visible: {},
  activeSketchId: ""
}

export function treeEntries(state = defaultState, action) {
  switch (action.type) {
    case 'rx-sketch':
      return update(state, {
        byId: { [action.obj.obj3d.name]: { $set: action.obj } },
        allIds: { $push: [action.obj.obj3d.name] },
        tree: { [action.obj.obj3d.name]: { $set: {} } },
        order: { [action.obj.obj3d.name]: { $set: state.allIds.length } },
        visible: { [action.obj.obj3d.name]: { $set: true } },
      })

    case 'set-entry-visibility': {
      return update(state, {
        visible: { $merge: action.obj },
      })
    }

    case 'set-active-sketch':
      return update(state, {
        visible: { [action.activeSketchId]: { $set: true } },
        activeSketchId: { $set: action.activeSketchId },
      })
    case 'exit-sketch':
      return update(state, {
        activeSketchId: { $set: "" },
        visible: { [state.activeSketchId]: { $set: false } },
      })
    case 'rx-extrusion':

      return update(state, {
        byId: {
          [action.mesh.name]: { $set: action.mesh }
        },
        allIds: { $push: [action.mesh.name] },
        tree: {
          [action.sketchId]: { [action.mesh.name]: { $set: true } },
          [action.mesh.name]: { $set: {} }
        },
        order: { [action.mesh.name]: { $set: state.allIds.length } },
        visible: {
          [action.mesh.name]: { $set: true }
        }
      })
    case 'rx-boolean':

      return update(state, {
        byId: {
          [action.mesh.name]: { $set: action.mesh }
        },
        allIds: { $push: [action.mesh.name] },
        tree: {
          [action.deps[0]]: { [action.mesh.name]: { $set: true } },
          [action.deps[1]]: { [action.mesh.name]: { $set: true } },
          [action.mesh.name]: { $set: {} }
        },
        order: { [action.mesh.name]: { $set: state.allIds.length } }
      })
    case 'delete-node':
      const depTree = new DepTree(state)
      const obj = depTree.deleteNode(action.id)
      return update(state, { $merge: obj })

    case 'restore-state':
      return action.state
    default:
      return state
  }
}

export function ui(state = {dialog:{}}, action) {
  switch (action.type) {

    case 'set-dialog':
      return update(state, {
        dialog: { $set: { target: action.target, action: action.action } },
      })
    case 'clear-dialog':
      return update(state, {
        dialog: { $set: {} },
      })
    default:
      return state
  }
}



export const reducer = combineReducers({
  ui,
  treeEntries
})