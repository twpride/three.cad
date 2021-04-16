

import React, { useEffect, useReducer } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { FaEdit } from 'react-icons/fa'
import { MdDone, MdSave, MdFolder } from 'react-icons/md'
import * as Icon from "./icons";


export const NavBar = ({ setDialog }) => {
  const dispatch = useDispatch()
  const activeSketchId = useSelector(state => state.treeEntries.activeSketchId)


  const boolOp = (code) => {
    if (sc.selected.length != 2 || !sc.selected.every(e => e.userData.type == 'mesh')) return
    const [m1, m2] = sc.selected
    sc.boolOp(m1, m2, code)
    sc.render()
    forceUpdate()
  }
  const extrude = () => { setDialog(true) }

  const addSketch = () => {
    sc.addSketch()
    console.log(!!sc.activeSketch, 'state')
    forceUpdate()
  }

  useEffect(() => {
    if (!activeSketchId) {
      sc.canvas.addEventListener('pointermove', sc.onHover)
      sc.canvas.addEventListener('pointerdown', sc.onPick)
      return () => {
        sc.canvas.removeEventListener('pointermove', sc.onHover)
        sc.canvas.removeEventListener('pointerdown', sc.onPick)
      }
    }
  }, [activeSketchId])

  // useEffect(() => {
  //   console.log(treeEntriesById)
  // }, [treeEntriesById])


  const btnz = [
    [MdDone, () => {
      sc.activeSketch.deactivate()
      // dispatch({ type: 'update-descendents', sketch})
      sc.render()
      forceUpdate()
    }, 'Finish'],
    [Icon.Extrude, extrude, 'Extrude [e]'],
    [Icon.Dimension, () => sc.activeSketch.command('d'), 'Dimension [d]'],
    [Icon.Line, () => sc.activeSketch.command('l'), 'Line [l]'],
    [Icon.Arc, () => sc.activeSketch.command('a'), 'Arc [a]'],
    [Icon.Coincident, () => sc.activeSketch.command('c'), 'Coincident [c]'],
    [Icon.Vertical, () => sc.activeSketch.command('v'), 'Vertical [v]'],
    [Icon.Horizontal, () => sc.activeSketch.command('h'), 'Horizontal [h]'],
    [Icon.Tangent, () => sc.activeSketch.command('t'), 'Tangent [t]'],
  ]


  const btnz2 = [
    [FaEdit, addSketch, 'Sketch [s]'],
    [Icon.Extrude, extrude, 'Extrude [e]'],
    [Icon.Union, () => boolOp('u'), 'Union'],
    [Icon.Subtract, () => boolOp('s'), 'Subtract'],
    [Icon.Intersect, () => boolOp('i'), 'Intersect'],
    [MdSave, () => boolOp('i'), 'Save [ctrl+s]'],
    [MdFolder, () => boolOp('i'), 'Load'],
    [Icon.Stl, () => boolOp('i'), 'Export STL'],
  ]

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  return <div className='topNav flex justify-center items-center bg-gray-700'>
    {
      activeSketchId ?
        btnz.map(([Icon, fcn, txt, shortcut], idx) => (
          <Icon className="btn w-auto h-full p-3.5" tooltip={txt}
            onClick={fcn} key={idx}
          />
        ))
        :
        btnz2.map(([Icon, fcn, txt, shortcut], idx) => (
          <Icon className="btn w-auto h-full p-3.5" tooltip={txt}
            onClick={fcn} key={idx}
          />
        ))
    }
  </div>
}
