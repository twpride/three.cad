

import { DepTree } from './depTree.mjs'
import update from 'immutability-helper'


export const preloadedState = {
  treeEntries: {
    byId: {},
    allIds: [],
    tree: {},
    order: {},
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
          order: { [action.obj.obj3d.name]: { $set: state.treeEntries.allIds.length } }
        },
      })

    case 'set-active-sketch':
      return update(state, {
        activeSketchId: { $set: action.sketch },
      })
    case 'exit-sketch':
      return {
        ...state, activeSketchId: ''
      }
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
          order: { [action.mesh.name]: { $set: state.treeEntries.allIds.length } }
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
          },
          order: { [action.mesh.name]: { $set: state.treeEntries.allIds.length } }
        }
      })
    case 'delete-node':

      const depTree = new DepTree(state.treeEntries)

      const obj = depTree.deleteNode(action.id)


      return update(state, {
        treeEntries: { $set: obj }
      })



    case 'restore-state':
      return action.state
    default:
      return state
  }
}



