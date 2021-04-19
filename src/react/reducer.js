

import { DepTree } from './depTree'
import update from 'immutability-helper'
import { combineReducers } from 'redux';

const defaultState = {
  byId: {},
  allIds: [],
  tree: {},
  order: {},
  visible: {},
}

let cache

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
      cache = JSON.stringify(action.sketch)
      return update(state, {
        visible: { [action.sketch.obj3d.name]: { $set: true } },
      })
    case 'finish-sketch':
      return update(state, {
        visible: { [sc.activeSketch.obj3d.name]: { $set: false } },
      })
    case 'restore-sketch':

      const sketch = sc.loadSketch(cache)

      const deletedObj = sc.obj3d.children.splice(state.order[sc.activeSketch.obj3d.name] + 1, 1,
        sketch.obj3d
      )[0]

      deletedObj.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })

      sc.activeSketch = sketch

      return update(state, {
        byId: { [sc.activeSketch.obj3d.name]: { $set: sketch } },
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
    case 'new-part':
      return defaultState
    default:
      return state
  }
}

export function ui(state = { dialog: {}, filePane: false }, action) {
  switch (action.type) {
    case 'set-active-sketch':
      return update(state, {
        sketchActive: { $set: true },
      })
    case 'rx-sketch':
      return update(state, {
        sketchActive: { $set: true },
      })
    case 'finish-sketch':
      return update(state, {
        sketchActive: { $set: false },
      })
    case 'set-dialog':
      return update(state, {
        dialog: { $set: { target: action.target, action: action.action } },
      })
    case 'clear-dialog':
      return update(state, {
        dialog: { $set: {} },
      })
    case 'set-file-handle':
      return update(state, {
        fileHandle: { $set: action.fileHandle },
        modified: { $set: false },
      })
    case 'new-part':
      return update(state, {
        fileHandle: { $set: null },
        modified: { $set: false },
      })
    case 'set-modified':
      return update(state, {
        modified: { $set: action.status },
      })
    case 'delete-node':
      return update(state, {
        modified: { $set: true },
      })
    case 'rx-extrusion':
      return update(state, {
        modified: { $set: true },
      })
    default:
      return state
  }
}



export const reducer = combineReducers({
  ui,
  treeEntries
})