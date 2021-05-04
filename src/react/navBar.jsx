

import React, { useEffect, useReducer, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { FaEdit, FaLinkedin, FaGithub } from 'react-icons/fa'
import { MdSave, MdFolder, MdInsertDriveFile, MdHelpOutline } from 'react-icons/md'
import * as Icon from "./icons";

import { Dialog } from './dialog'
import { Modal } from './modal'
import { STLExport, saveFile, openFile } from './fileHelpers'
import { QuickStart } from './quickStart';
import { Help } from './help'
const visitedFlagStorage = sessionStorage
const buttonIdx = {
  'line': 1,
  'arc': 2,
  'dimension': 3,
  'coincident': 4,
  'vertical': 5,
  'horizontal': 6,
  'tangent': 7,
}

export const NavBar = () => {
  const dispatch = useDispatch()
  const treeEntries = useSelector(state => state.treeEntries)
  const sketchActive = useSelector(state => state.ui.sketchActive)
  const fileHandle = useSelector(state => state.ui.fileHandle)
  const modified = useSelector(state => state.ui.modified)
  const fileName = useSelector(state => state.ui.fileName)
  const mode = useSelector(state => state.ui.mode)

  const boolOp = (code) => {
    if (sce.selected.length != 2 || !sce.selected.every(e => e.userData.type == 'mesh')) {
      alert('please first select two bodies for boolean operation')
      return
    }
    const [m1, m2] = sce.selected

    const mesh = sce.boolOp(m1, m2, code)

    sce.obj3d.add(mesh)

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


    sce.render()
    forceUpdate()
  }


  const addSketch = () => {
    const sketch = sce.addSketch()
    if (!sketch) {
      alert('please select a plane or 3 points to set the sketch plane')
      return
    }

    dispatch({ type: 'rx-sketch', obj: sketch })

    sketch.activate()

    sce.render()

    dispatch({ type: 'set-dialog', action: 'sketch', target: sketch.obj3d.name })

    forceUpdate()
  }

  const confirmDiscard = () => !modified ? true : confirm('Discard changes? All changes will be lost.')



  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (modified ||
        (sce.activeSketch &&
          (
            sce.activeSketch.hasChanged
            || sce.activeSketch.idOnActivate != id
            || sce.activeSketch.c_idOnActivate != sce.activeSketch.c_id
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
      sce.canvas.addEventListener('pointermove', sce.onHover)
      sce.canvas.addEventListener('pointerdown', sce.onPick)
      return () => {
        sce.canvas.removeEventListener('pointermove', sce.onHover)
        sce.canvas.removeEventListener('pointerdown', sce.onPick)
      }
    }
  }, [sketchActive])

  const sketchModeButtons = [
    [Icon.Extrude, () => dispatch({ type: 'set-dialog', action: 'extrude', target: sce.activeSketch.obj3d.name }), 'Extrude'],
    [Icon.Line, () => sce.activeSketch.command('line'), 'Line (l)'], //1
    [Icon.Arc, () => sce.activeSketch.command('arc'), 'Arc (a)'],
    [Icon.Dimension, () => sce.activeSketch.command('dimension'), 'Dimension (d)'],
    [Icon.Coincident, () => sce.activeSketch.command('coincident'), 'Coincident (c)'],
    [Icon.Vertical, () => sce.activeSketch.command('vertical'), 'Vertical (v)'],
    [Icon.Horizontal, () => sce.activeSketch.command('horizontal'), 'Horizontal (h)'],
    [Icon.Tangent, () => sce.activeSketch.command('tangent'), 'Tangent (t)'], //7
    [MdSave, async () => saveFile(fileHandle, JSON.stringify([id, sce.sid, sce.mid, treeEntries]), dispatch, fileName), 'Save'],
  ]


  const partModeButtons = [
    [FaEdit, addSketch, 'Sketch'],
    [Icon.Extrude, () => {
      try {
        dispatch({ type: 'set-dialog', action: 'extrude', target: sce.selected[0].name })
      } catch (err) {
        console.error(err)
        alert('please select a sketch from the left pane extrude')
      }

    }, 'Extrude'],

    [Icon.Union, () => boolOp('u'), 'Union'],
    [Icon.Subtract, () => boolOp('s'), 'Subtract'],
    [Icon.Intersect, () => boolOp('i'), 'Intersect'],
    [MdInsertDriveFile, () => {
      if (!confirmDiscard()) return
      sce.newPart()
      dispatch({ type: 'new-part' })
      sce.render()
    }, 'New'],
    [MdSave,
      () => {
        saveFile(fileHandle, JSON.stringify([id, sce.sid, sce.mid, treeEntries]), dispatch, fileName)
      }
      , 'Save'],
    [MdFolder, () => {
      if (!confirmDiscard()) return
      openFile(dispatch).then(
        sce.render
      )
    }, 'Open'],
    [Icon.Stl, () => {
      if (sce.selected[0] && sce.selected[0].userData.type == 'mesh') {
        STLExport(fileHandle ? fileHandle.name.replace(/\.[^/.]+$/, "") : 'untitled')
      } else {
        alert('please first select one body to export')
      }
    }, 'Export to STL'],
  ]

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const [splash, setSplash] = useState(!visitedFlagStorage.getItem('visited'))
  const [modal, setModal] = useState(false)

  return <div className='topNav flex justify-center bg-gray-800 text-gray-200 '>

    <div className='w-auto h-full flex-1 flex justify-end lg:justify-between'>
      <div className='w-100 h-full font-mono text-lg text-gray-200 select-none hidden lg:flex mr-8 items-center'>
        <Icon.Logo className='w-auto h-6 mx-1' />
          three.cad
      </div>
      <div className='h-full w-48 flex items-center justify-end'>
        <Dialog />
      </div>
    </div>
    <div className='w-auto h-full flex'>
      {(sketchActive ? sketchModeButtons : partModeButtons).map(
        ([Icon, fcn, txt], idx) => (
          Icon !== undefined ?
            <Icon className={`cursor-pointer fill-current w-auto h-full p-3.5
            ${idx == buttonIdx[mode] ? 'bg-green-500' : 'hover:bg-gray-600 bg-transparent'}`} tooltip={txt}
              onClick={fcn} key={idx}
            /> :
            <div className="w-12 h-full"></div>
        ))
      }
    </div>
    <div className='w-auto h-full flex-1 justify-end flex-shrink-1 hidden md:flex'>

      <MdHelpOutline className={`cursor-pointer fill-current w-auto h-full p-3
            ${modal ? 'bg-green-500' : 'hover:bg-gray-600 bg-transparent'}`} onClick={() => {
        setModal(true)
      }
      } />

      <a href='https://github.com/twpride/three.cad' className='h-full w-auto'>
        <FaGithub className="text-gray-200 cursor-pointer hover:bg-gray-600 bg-transparent w-auto h-full p-3.5"></FaGithub>
      </a>
      <a href='https://www.linkedin.com/in/howard-hwang-b3000335' className='h-full w-auto'>
        <FaLinkedin className="text-gray-200 cursor-pointer hover:bg-gray-600 bg-transparent w-auto h-full p-3.5"></FaLinkedin>
      </a>
    </div>
    {
      splash && <Modal {...{ setModal: setSplash, clickOut: false}}>
        <Help {...{ setModal: setSplash, setQs: setModal }} />
      </Modal>
    }
    {
      modal && <Modal {...{ setModal, id: 'navbar' }}>
        <QuickStart {...{ setModal }} />
      </Modal>
    }

  </div>
}




