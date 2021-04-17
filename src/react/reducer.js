

import { DepTree } from './depTree'
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
      cache = JSON.stringify(state.byId[action.activeSketchId])
      return update(state, {
        visible: { [action.activeSketchId]: { $set: true } },
        activeSketchId: { $set: action.activeSketchId },
      })
    case 'finish-sketch':
      return update(state, {
        activeSketchId: { $set: "" },
        visible: { [state.activeSketchId]: { $set: false } },
      })
    case 'cancel-sketch':

      const sketch = sc.loadSketch(cache)

      const deletedObj = sc.obj3d.children.splice(state.order[state.activeSketchId] + 1, 1,
        sketch.obj3d
      )[0]
      console.log('spliced and starting to delete')

      deletedObj.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })

      // sketch.deactivate()

      return update(state, {
        activeSketchId: { $set: "" },
        byId: { [state.activeSketchId]: { $set: sketch } },
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

export function ui(state = { dialog: {} }, action) {
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