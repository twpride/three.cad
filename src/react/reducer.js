

import { DepTree } from './depTree.mjs'
import update from 'immutability-helper'


export const preloadedState = {
  treeEntries: {
    byId: {},
    allIds: [],
    tree: {},
    order: {},
    visible: {},
    activeSketchId: ""
  },
}

export function reducer(state = {}, action) {
  switch (action.type) {
    case 'rx-sketch':
      return update(state, {
        treeEntries: {
          byId: { [action.obj.obj3d.name]: { $set: action.obj } },
          allIds: { $push: [action.obj.obj3d.name] },
          tree: { [action.obj.obj3d.name]: { $set: {} } },
          order: { [action.obj.obj3d.name]: { $set: state.treeEntries.allIds.length } },
          visible: { [action.obj.obj3d.name]: { $set: true } },
        },
      })

    case 'set-entry-visibility': {
      return update(state, {
        treeEntries: {
          visible: { $merge: action.obj },
        },
      })
    }

    case 'set-active-sketch':
      return update(state, {
        treeEntries: {
          visible: { [action.activeSketchId]: { $set: true } },
          activeSketchId: { $set: action.activeSketchId },
        },
      })
    case 'exit-sketch':
      return update(state, {
        treeEntries: {
          activeSketchId: { $set: "" },
          visible: { [state.treeEntries.activeSketchId]: { $set: false } },
        },
      })
    case 'rx-extrusion':

      return update(state, {
        treeEntries: {
          byId: {
            [action.mesh.name]: { $set: action.mesh }
          },
          allIds: { $push: [action.mesh.name] },
          tree: {
            [action.sketchId]: { [action.mesh.name]: { $set: true } },
            [action.mesh.name]: { $set: {} }
          },
          order: { [action.mesh.name]: { $set: state.treeEntries.allIds.length } },
          visible: {
            [action.mesh.name]: { $set: true }
          }
        }
      })
    case 'rx-boolean':

      return update(state, {
        treeEntries: {
          byId: {
            [action.mesh.name]: { $set: action.mesh }
          },
          allIds: { $push: [action.mesh.name] },
          tree: {
            [action.deps[0]]: { [action.mesh.name]: { $set: true } },
            [action.deps[1]]: { [action.mesh.name]: { $set: true } },
            [action.mesh.name]: { $set: {} }
          },
          order: { [action.mesh.name]: { $set: state.treeEntries.allIds.length } }
        }
      })
    case 'delete-node':

      const depTree = new DepTree(state.treeEntries)

      const obj = depTree.deleteNode(action.id)


      return update(state, {
        treeEntries: { $merge: obj }
      })



    case 'restore-state':
      return action.state
    default:
      return state
  }
}



