

import React, { useEffect, useReducer, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { MdDone, MdClose } from 'react-icons/md'
import { GiVerticalFlip } from 'react-icons/gi'
import * as Icon from "./icons";


export const Dialog = ({ dd }) => {
  if (!dd) return null

  const dispatch = useDispatch()
  const treeEntriesById = useSelector(state => state.treeEntries.byId)
  const activeSketchId = useSelector(state => state.treeEntries.activeSketchId)

  const ref = useRef()
  useEffect(() => {
    ref.current.focus()
  }, [])

  const extrude = () => {
    if (sc.activeSketch) {
      sc.extrude(sc.activeSketch, ref.current.value)
    } else if (sc.selected.length === 1 && sc.selected[0].userData.type == 'sketch') {
      sc.extrude(treeEntriesById[sc.selected[0].name], ref.current.value)
    } else {
      console.log('invalid selection')
    }
  }


  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  return <div className='dialog w-40 h-10 flex items-center bg-gray-700'>
    <input className='w-1/2' type="number" {...useNumField(1)} step="0.1" ref={ref} />
    <MdDone
      onClick={extrude}
      className="btn w-auto h-full p-2" />
    <MdClose className="btn w-auto h-full p-2" />
    <Icon.Flip className="btn w-auto h-full p-2" />
  </div>
}


export const useNumField = (initValue = 0) => {
  const [value, setValue] = useState(initValue);
  const onChange = e => setValue(e.target.value);
  return { value, onChange };
}