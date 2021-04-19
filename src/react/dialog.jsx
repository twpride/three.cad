

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

  const extrudeEdit = () => {


    dialog.target.userData.featureInfo[1] = ref.current.value

    sc.refreshNode(dialog.target.name, treeEntries)
    dispatch({ type: 'set-modified', status: true })

    dispatch({ type: "clear-dialog" })

    sc.render()
  }


  switch (dialog.action) {
    case 'extrude':
      return <>
        <input className='w-16 border-t-0 border-l-0 border-r-0 border-b border-gray-50 text-gray-50 mr-2' type="number" defaultValue="1" step="0.1" ref={ref} />
        <Icon.Flip className="btn w-auto h-full p-3.5"
          onClick={() => ref.current.value *= -1}
        />
        <MdDone
          className="btn w-auto h-full p-3.5"
          onClick={extrude}
        />
        <MdClose className="btn w-auto h-full p-3.5 mr-6"
          onClick={() => {
            if (sc.activeSketch == dialog.target) { // if extrude dialog launched from sketch mode we set dialog back to the sketch dialog
              dispatch({ type: 'set-dialog', action: 'sketch' })
            } else {
              dispatch({ type: "clear-dialog" })
            }
          }}
        />
      </>
    case 'extrude-edit':
      return <>
        <input className='w-16 border-t-0 border-l-0 border-r-0 border-b border-gray-50 text-gray-50 mr-2' type="number" defaultValue={dialog.target.userData.featureInfo[1]} step="0.1" ref={ref} />
        <Icon.Flip className="btn w-auto h-full p-3.5"
          onClick={() => ref.current.value *= -1}
        />
        <MdDone
          className="btn w-auto h-full p-3.5"
          onClick={extrudeEdit}
        />
        <MdClose className="btn w-auto h-full p-3.5 mr-6"
          onClick={() => dispatch({ type: "clear-dialog" })}
        />
      </>
    case 'sketch':
      return <>
        <MdDone
          className="btn w-auto h-full p-3.5"
          onClick={() => {
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
          }}
        />
        <MdClose className="btn w-auto h-full p-3.5 mr-6"
          onClick={() => {
            if (sc.activeSketch.hasChanged
              || sc.activeSketch.idOnActivate != id
              || sc.activeSketch.c_idOnActivate != sc.activeSketch.c_id
            ) {
              dispatch({ type: "restore-sketch" })
              // dispatch({ type: 'set-modified', status: false })
            }
            
            dispatch({ type: 'finish-sketch' })

            sc.activeSketch.deactivate()
            sc.render()
            dispatch({ type: "clear-dialog" })
          }}
        />
      </>
    default:
      return null
  }
}





