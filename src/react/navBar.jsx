

import React, { useEffect, useReducer } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { FaEdit, FaFileDownload } from 'react-icons/fa'
import { MdSave, MdFolder, MdFileUpload, MdInsertDriveFile } from 'react-icons/md'
import { FaRegFolderOpen, FaFile } from 'react-icons/fa'

import * as Icon from "./icons";
import { Dialog } from './dialog'
import { STLExport, saveFile, openFile } from './fileHelpers'




export const NavBar = () => {
  const dispatch = useDispatch()
  const activeSketchId = useSelector(state => state.treeEntries.activeSketchId)
  const treeEntriesById = useSelector(state => state.treeEntries.byId)
  const fileHandle = useSelector(state => state.ui.fileHandle)

  const boolOp = (code) => {
    if (sc.selected.length != 2 || !sc.selected.every(e => e.userData.type == 'mesh')) return
    const [m1, m2] = sc.selected
    sc.boolOp(m1, m2, code)
    sc.render()
    forceUpdate()
  }

  const addSketch = () => {
    sc.addSketch()
    dispatch({ type: 'set-dialog', action: 'sketch' })

    forceUpdate()
  }




  useEffect(() => {  // hacky way to handle mounting and unmounting mouse listeners for feature mode
    if (!activeSketchId) {
      sc.canvas.addEventListener('pointermove', sc.onHover)
      sc.canvas.addEventListener('pointerdown', sc.onPick)
      return () => {
        sc.canvas.removeEventListener('pointermove', sc.onHover)
        sc.canvas.removeEventListener('pointerdown', sc.onPick)
      }
    }
  }, [activeSketchId])

  const sketchModeButtons = [
    [Icon.Extrude, () => {
      dispatch({ type: 'finish-sketch' })
      dispatch({ type: 'set-dialog', action: 'extrude', target: sc.activeSketch })

    }, 'Extrude [e]'],
    [Icon.Dimension, () => sc.activeSketch.command('d'), 'Dimension [d]'],
    [Icon.Line, () => sc.activeSketch.command('l'), 'Line [l]'],
    [Icon.Arc, () => sc.activeSketch.command('a'), 'Arc [a]'],
    [Icon.Coincident, () => sc.activeSketch.command('c'), 'Coincident [c]'],
    [Icon.Vertical, () => sc.activeSketch.command('v'), 'Vertical [v]'],
    [Icon.Horizontal, () => sc.activeSketch.command('h'), 'Horizontal [h]'],
    [Icon.Tangent, () => sc.activeSketch.command('t'), 'Tangent [t]'],
    [Icon.Tangent, () => sc.activeSketch.command('t'), 'Tangent [t]'],
  ]


  const partModeButtons = [
    [FaEdit, addSketch, 'Sketch [s]'],
    [Icon.Extrude, () => {
      dispatch({ type: 'set-dialog', action: 'extrude', target: treeEntriesById[sc.selected[0].name] })
    }, 'Extrude [e]'],

    [Icon.Union, () => boolOp('u'), 'Union'],
    [Icon.Subtract, () => boolOp('s'), 'Subtract'],
    [Icon.Intersect, () => boolOp('i'), 'Intersect'],
    [MdInsertDriveFile, () => {
      sc.newPart()
      dispatch({ type: 'new-part' })
      sc.render()
    }, 'New [ctrl+n]'],
    [MdSave,
      () => {
        saveFile(fileHandle, sc.saveScene(), dispatch)
      }
      , 'Save [ctrl+s]'],
    [MdFolder, () => {
      openFile(dispatch).then(
        ()=>sc.render()
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
        activeSketchId ?
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




