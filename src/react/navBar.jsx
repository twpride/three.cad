

import React, { useEffect, useReducer } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { FaCube, FaEdit } from 'react-icons/fa'
import { BsBoxArrowUp } from 'react-icons/bs'
import { MdDone, MdSave, MdFolder } from 'react-icons/md'
import * as Icon from "./icons";


export const NavBar = () => {
  const dispatch = useDispatch()
  const treeEntriesById = useSelector(state => state.treeEntries.byId)
  const activeSketchId = useSelector(state => state.treeEntries.activeSketchId)


  const boolOp = (code) => {
    if (sc.selected.length != 2 || !sc.selected.every(e => e.userData.type == 'mesh')) return
    const [m1, m2] = sc.selected
    const mesh = sc.subtract(m1, m2, code)
    dispatch({ type: 'rx-boolean', mesh, deps: [m1.name, m2.name] })
    sc.render()
    forceUpdate()
  }
  const extrude = () => {
    // sc.extrude(treeEntriesById[activeSketchId])
    sc.extrude(sc.activeSketch)
  }

  const addSketch = () => {
    sc.addSketch()
    console.log(!!sc.activeSketch,'state')
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

  useEffect(() => {
    console.log(treeEntriesById)
  }, [treeEntriesById])


  const btnz = [
    [MdDone, () => {
      // treeEntriesById[activeSketchId].deactivate()
      // dispatch({ type: 'update-descendents', sketch})
      sc.activeSketch.deactivate()
      sc.render()
      forceUpdate()
      // sc.activeDim = this.activeSketch.obj3d.children[1].children
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
    [FaEdit, addSketch, 'Sketch [s]']
    ,
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
      activeSketchId?
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
