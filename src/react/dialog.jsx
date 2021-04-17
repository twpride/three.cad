

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
    forceUpdate()

  }

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  switch (dialog.action) {
    case 'extrude':
      return <>
        <input className='w-1/2' type="number" defaultValue="1" step="0.1" ref={ref} />
        <Icon.Flip className="btn w-auto h-full p-2"
          onClick={() => ref.current.value *= -1}
        />
        <MdDone
          className="btn w-auto h-full p-2"
          onClick={extrude}
        />
        <MdClose className="btn w-auto h-full p-2"
          onClick={() => dispatch({ type: "clear-dialog" })}
        />
      </>
    case 'sketch':
      return <>
        <MdDone
          className="btn w-auto h-full p-2"
          onClick={() => {
            // dispatch({ type: 'update-descendents', sketch})
            sc.activeSketch.deactivate()
            sc.render()
            forceUpdate()
          }}
        />
        <MdClose className="btn w-auto h-full p-2"
          onClick={() => dispatch({ type: "clear-dialog" })}
        />
      </>
    default:
      return null
  }
}





