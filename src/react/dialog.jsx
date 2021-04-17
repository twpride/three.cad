

import React, { useEffect, useReducer, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { MdDone, MdClose } from 'react-icons/md'
import * as Icon from "./icons";




export const Dialog = () => {

  const dialog = useSelector(state => state.ui.dialog)
  const dispatch = useDispatch()

  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    ref.current.focus()
  }, [dialog])

  const extrude = () => {
    sc.extrude(dialog.target, ref.current.value)
    sc.render()

    dispatch({ type: "clear-dialog" })

  }

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  switch (dialog.action) {
    case 'extrude':
      return <>
        <input className='w-16 border-t-0 border-l-0 border-r-0 border-b border-gray-50 text-gray-50 mr-6' type="number" defaultValue="1" step="0.1" ref={ref} />
        <Icon.Flip className="btn w-auto h-full p-3.5"
          onClick={() => ref.current.value *= -1}
        />
        <MdDone
          className="btn w-auto h-full p-3.5"
          onClick={extrude}
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
            if (sc.activeSketch.hasChanged || sc.activeSketch.idOnActivate != id) {
              console.log(sc.activeSketch)
              for (let k in sc.store.getState().treeEntries.tree[sc.activeSketch.obj3d.name]) {
                console.log('circlllles',k)
                sc.refreshNode(k)
              }
              sc.render()
            }
            // dispatch({ type: 'update-descendents', sketch})

            sc.activeSketch.deactivate()
            dispatch({ type: "clear-dialog" })
          }}
        />
        <MdClose className="btn w-auto h-full p-3.5 mr-6"
          onClick={() => {
            if (sc.activeSketch.hasChanged || sc.activeSketch.idOnActivate != id) {
              console.log('has changed')
              dispatch({ type: "cancel-sketch" })
              sc.render()
            }

            sc.activeSketch.deactivate()
            dispatch({ type: "clear-dialog" })
          }
          }
        />
      </>
    default:
      return null
  }
}





