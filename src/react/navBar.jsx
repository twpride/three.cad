

import React, { useEffect, useReducer } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { FaEdit } from 'react-icons/fa'
import { MdSave, MdFolder, MdInsertDriveFile } from 'react-icons/md'

import * as Icon from "./icons";
import { Dialog } from './dialog'
import { STLExport, saveFile, openFile, verifyPermission } from './fileHelpers'




export const NavBar = () => {
  const dispatch = useDispatch()
  const sketchActive = useSelector(state => state.ui.sketchActive)
  const treeEntries = useSelector(state => state.treeEntries)
  const fileHandle = useSelector(state => state.ui.fileHandle)
  const modified = useSelector(state => state.ui.modified)

  const boolOp = (code) => {
    if (sc.selected.length != 2 || !sc.selected.every(e => e.userData.type == 'mesh')) return
    const [m1, m2] = sc.selected

    const mesh = sc.boolOp(m1, m2, code)

    sc.obj3d.add(mesh)

    dispatch({
      type: 'set-entry-visibility', obj: {
        [m1.name]: false,
        [m2.name]: false,
        [mesh.name]: true,
      }
    })

    dispatch({
      type: 'rx-boolean', mesh, deps: [m1.name, m2.name]
    })


    sc.render()
    forceUpdate()
  }

  const addSketch = async () => {
    const sketch = await sc.addSketch()

    dispatch({ type: 'rx-sketch', obj: sketch })

    sketch.activate()

    sc.render()

    dispatch({ type: 'set-dialog', action: 'sketch' })

    forceUpdate()
  }

  const confirmDiscard = () => !modified ? true : confirm('Discard changes? All changes will be lost.')




  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (modified ||
        (sc.activeSketch &&
          (
            sc.activeSketch.hasChanged
            || sc.activeSketch.idOnActivate != id
            || sc.activeSketch.c_idOnActivate != sc.activeSketch.c_id
          )
        )
      ) {
        e.preventDefault();
        e.returnValue = `There are unsaved changes. Are you sure you want to leave?`;
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [modified])

  useEffect(() => {  // hacky way to handle mounting and unmounting mouse listeners for feature mode
    if (!sketchActive) {
      sc.canvas.addEventListener('pointermove', sc.onHover)
      sc.canvas.addEventListener('pointerdown', sc.onPick)
      return () => {
        sc.canvas.removeEventListener('pointermove', sc.onHover)
        sc.canvas.removeEventListener('pointerdown', sc.onPick)
      }
    }
  }, [sketchActive])

  const sketchModeButtons = [
    [Icon.Extrude, () => {
      dispatch({ type: 'set-dialog', action: 'extrude', target: sc.activeSketch })

    }, 'Extrude [e]'],
    [Icon.Dimension, () => sc.activeSketch.command('d'), 'Dimension [d]'],
    [Icon.Line, () => sc.activeSketch.command('l'), 'Line [l]'],
    [Icon.Arc, () => sc.activeSketch.command('a'), 'Arc [a]'],
    [Icon.Coincident, () => sc.activeSketch.command('c'), 'Coincident [c]'],
    [Icon.Vertical, () => sc.activeSketch.command('v'), 'Vertical [v]'],
    [Icon.Horizontal, () => sc.activeSketch.command('h'), 'Horizontal [h]'],
    [Icon.Tangent, () => sc.activeSketch.command('t'), 'Tangent [t]'],
    [MdSave,
      async () => {
        if(await verifyPermission(fileHandle) === false) return
        sc.refreshNode(sc.activeSketch.obj3d.name, treeEntries)
        sc.activeSketch.clearSelection()
        saveFile(fileHandle, JSON.stringify([id, sc.sid, sc.mid, treeEntries]), dispatch)
        sc.render()
        sc.activeSketch.setClean()
      }
      , 'Save']
  ]


  const partModeButtons = [
    [FaEdit, addSketch, 'Sketch [s]'],
    [Icon.Extrude, () => {
      dispatch({ type: 'set-dialog', action: 'extrude', target: treeEntries.byId[sc.selected[0].name] })
    }, 'Extrude'],

    [Icon.Union, () => boolOp('u'), 'Union'],
    [Icon.Subtract, () => boolOp('s'), 'Subtract'],
    [Icon.Intersect, () => boolOp('i'), 'Intersect'],
    [MdInsertDriveFile, () => {
      if (!confirmDiscard()) return
      sc.newPart()
      dispatch({ type: 'new-part' })
      sc.render()
    }, 'New'],
    [MdSave,
      () => {
        saveFile(fileHandle, JSON.stringify([id, sc.sid, sc.mid, treeEntries]), dispatch)
      }
      , 'Save'],
    [MdFolder, () => {
      if (!confirmDiscard()) return
      openFile(dispatch).then(
        sc.render
      )
    }, 'Open'],
    [Icon.Stl, () => {
      STLExport('box')
    },
      , 'Export STL'],
  ]

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  return <div className='topNav flex justify-center items-center bg-gray-700'>

    <div className='w-auto h-full flex-1 flex items-center justify-end'>
      <Dialog />
    </div>
    <div className='w-auto h-full flex-none'>
      {
        sketchActive ?
          sketchModeButtons.map(([Icon, fcn, txt, shortcut], idx) => (
            <Icon className="btn w-auto h-full p-3.5" tooltip={txt}
              onClick={fcn} key={idx}
            />
          ))
          :
          partModeButtons.map(([Icon, fcn, txt, shortcut], idx) => (
            <Icon className="btn w-auto h-full p-3.5" tooltip={txt}
              onClick={fcn} key={idx}
            />
          ))
      }
    </div>
    <div className='w-auto h-full flex-1 items-center'>
    </div>

  </div>
}


// app.saveFile = async () => {
//   try {
//     if (!app.file.handle) {
//       return await app.saveFileAs();
//     }
//     gaEvent('FileAction', 'Save');
//     await writeFile(app.file.handle, app.getText());
//     app.setModified(false);
//   } catch (ex) {
//     gaEvent('Error', 'FileSave', ex.name);
//     const msg = 'Unable to save file';
//     console.error(msg, ex);
//     alert(msg);
//   }
//   app.setFocus();
// };




