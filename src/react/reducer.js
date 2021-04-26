

import { DepTree } from './depTree'
import update from 'immutability-helper'
import { combineReducers } from 'redux';
import { sce } from './app'

const defaultTreeState = {
  byId: {},
  allIds: [],
  tree: {},
  order: {},
  visible: {},
}

let cache

export function treeEntries(state = defaultTreeState, action) {
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
        visible: { [sce.activeSketch.obj3d.name]: { $set: false } },
      })
    case 'restore-sketch':

      const sketch = sce.loadSketch(cache)

      const deletedObj = sce.obj3d.children.splice(state.order[sce.activeSketch.obj3d.name] + 1, 1,
        sketch.obj3d
      )[0]

      deletedObj.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })

      sce.activeSketch = sketch

      return update(state, {
        byId: { [sce.activeSketch.obj3d.name]: { $set: sketch } },
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
      return defaultTreeState
    default:
      return state
  }
}

const defaultUIState = {
  dialog: {},
  fileHandle: null,
  fileName: 'Untitled',
  selectedList: [],
  selectedSet: {},

}

export function ui(state = defaultUIState, action) {
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
        mode: { $set: "" } // we clear the existing mode when entering dialog
      })
    case 'clear-dialog':
      return update(state, {
        dialog: { $set: {} },
        mode: { $set: "" }
      })
    case 'set-file-handle':
      return update(state, {
        fileHandle: { $set: action.fileHandle },
        modified: { $set: false },
      })
    case 'new-part':
      return defaultUIState
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
    case 'restore-state':
      return update(state, {
        fileName: { $set: action.fileName },
      })
    case 'on-pick':

      console.log(action.obj.userData.type)
      const idx = state.selectedList.indexOf(action.obj)

      const setNeedsUpdate = action.obj.userData.type == 'mesh' || action.obj.userData.type == 'sketch'

      if (idx == -1) {
        return update(state, {
          selectedList: { $push: [action.obj] },
          // selectedSet: { [action.obj.name]: { $set: true } }
          selectedSet: (curr) => setNeedsUpdate ? { ...curr, [action.obj.name]: true } : curr
        })

      } else {

        if (action.obj.userData.type != 'selpoint') {
          return update(state, {
            selectedList: { $splice: [[idx, 1]] },
            // selectedSet: { [action.obj.name]: { $set: false } }
            selectedSet: (curr) => setNeedsUpdate ? { ...curr, [action.obj.name]: false } : curr
          })
        } else {
          return state
        }

      }

    case 'clear-selection':
      if (state.selectedList.length) {
        return update(state, {
          selectedList: { $set: [] },
          selectedSet: { $set: {} }
        })
      } else {
        return state
      }

    case 'set-mode':


      return update(state, {
        mode: { $set: action.mode }
      })

    default:
      return state
  }
}



export const reducer = combineReducers({
  ui,
  treeEntries
})