

import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { MdDone, MdClose } from 'react-icons/md'
import * as Icon from "./icons";


export const Dialog = () => {

  const dialog = useSelector(state => state.ui.dialog)
  const treeEntries = useSelector(state => state.treeEntries)
  const dispatch = useDispatch()

  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    ref.current.focus()
  }, [dialog])

  const extrude = () => {
    const mesh = sc.extrude(dialog.target, ref.current.value)

    dispatch({ type: 'rx-extrusion', mesh, sketchId: dialog.target.obj3d.name })

    if (sc.activeSketch == dialog.target) {
      dispatch({ type: 'finish-sketch' })
      dialog.target.deactivate()
    }

    dispatch({ type: "clear-dialog" })

    sc.render()
  }

  const extrudeCancel = () => {
    if (sc.activeSketch == dialog.target) { // if extrude dialog launched from sketch mode we set dialog back to the sketch dialog
      dispatch({ type: 'set-dialog', action: 'sketch' })
    } else {
      dispatch({ type: "clear-dialog" })
    }
  }

  const extrudeEdit = () => {
    dialog.target.userData.featureInfo[1] = ref.current.value

    sc.refreshNode(dialog.target.name, treeEntries)
    dispatch({ type: 'set-modified', status: true })

    dispatch({ type: "clear-dialog" })

    sc.render()
  }

  const extrudeEditCancel = () => dispatch({ type: "clear-dialog" })

  const sketchDone = () => {
    if (sc.activeSketch.hasChanged
      || sc.activeSketch.idOnActivate != id
      || sc.activeSketch.c_idOnActivate != sc.activeSketch.c_id
    ) {
      sc.refreshNode(sc.activeSketch.obj3d.name, treeEntries)

      dispatch({ type: 'set-modified', status: true })
    }

    dispatch({ type: 'finish-sketch' })

    sc.activeSketch.deactivate()
    sc.render()
    dispatch({ type: "clear-dialog" })
  }

  const sketchCancel = () => {
    if (sc.activeSketch.hasChanged
      || sc.activeSketch.idOnActivate != id
      || sc.activeSketch.c_idOnActivate != sc.activeSketch.c_id
    ) {
      if (sc.newSketch) {
        dispatch({ type: 'delete-node', id: sc.activeSketch.obj3d.name })
        sc.sid -= 1
      } else {
        dispatch({ type: "restore-sketch" })
      }
    }

    dispatch({ type: 'finish-sketch' })

    sc.activeSketch.deactivate()
    sc.render()
    dispatch({ type: "clear-dialog" })
  }

  switch (dialog.action) {
    case 'extrude':
      return <>
        <input className='w-10 border-t-0 border-l-0 border-r-0 border-b border-gray-50 text-gray-50' type="number" defaultValue="1" step="0.1" ref={ref} />
        <Icon.Flip className="btn text-gray-200 w-auto h-full p-3.5"
          onClick={() => ref.current.value *= -1}
        />
        <MdDone
          className="btn w-auto h-full p-3.5 text-green-500"
          onClick={extrude}
        />
        <MdClose className="btn w-auto h-full p-3.5 text-red-500"
          onClick={extrudeCancel}
        />
      </>
    case 'extrude-edit':
      return <>
        <input className='w-10 border-t-0 border-l-0 border-r-0 border-b border-gray-50 text-gray-50' type="number" defaultValue={dialog.target.userData.featureInfo[1]} step="0.1" ref={ref} />
        <Icon.Flip className="btn text-gray-200 w-auto h-full p-3.5"
          onClick={() => ref.current.value *= -1}
        />
        <MdDone
          className="btn w-auto h-full p-3.5 text-green-500"
          onClick={extrudeEdit}
        />
        <MdClose 
          className="btn w-auto h-full p-3.5 text-red-500"
          onClick={extrudeEditCancel}
        />
      </>
    case 'sketch':
      return <>
        <MdDone
          className="btn w-auto h-full p-3.5 text-green-500"
          onClick={sketchDone}
        />
        <MdClose className="btn w-auto h-full p-3.5 text-red-500"
          onClick={sketchCancel}
        />
      </>
    default:
      return null
  }
}





