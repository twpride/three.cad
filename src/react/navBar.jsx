

import React, { useEffect, useReducer } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { FaCube, FaEdit } from 'react-icons/fa'
import { MdDone } from 'react-icons/md'
import * as Icon from "./icons";



export const NavBar = () => {
  const dispatch = useDispatch()
  const treeEntries = useSelector(state => state.treeEntries)
  const activeSketchId = useSelector(state => state.activeSketchId)


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


  const btnz = [
    activeSketchId ?
      [MdDone, () => {
        treeEntries.byId[activeSketchId].deactivate()
        sc.activeSketch = null
        // sc.activeDim = this.activeSketch.obj3d.children[1].children
      }, 'Finish'] :
      [FaEdit, sc.addSketch, 'Sketch [s]']
    ,
    [FaCube, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Extrude [e]'],
    [Icon.Union, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Union'],
    [Icon.Subtract, () => {
      if (sc.selected.length != 2 || !sc.selected.every(e => e.userData.type == 'mesh')) return
      // console.log('here')
      const [m1, m2] = sc.selected
      const mesh = subtract(m1, m2)

      console.log(mesh, 'meshres')
      dispatch({ type: 'rx-boolean', mesh, deps: [m1.name, m2.name] })
      sc.render()
      forceUpdate()
    }, 'Subtract'],
    [Icon.Intersect, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Intersect'],
    [Icon.Dimension, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Dimension [d]'],
    [Icon.Line, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Line [l]'],
    [Icon.Arc, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Arc [a]'],
  ]

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  return <div className='topNav flex justify-center items-center bg-gray-800'>
    {
      btnz.map(([Icon, fcn, txt, shortcut], idx) => (
        <Icon className="btn w-auto h-full p-3" tooltip={txt}
          onClick={fcn} key={idx}
        />
      ))
    }
  </div>
}

const subtract = (m1, m2) => {
  //  //Create a bsp tree from each of the meshes
  // console.log(sc.selected.length != 2 || !sc.selected.every(e => e.userData.type == 'mesh'), "wtf")


  let bspA = BoolOp.fromMesh(m1)
  let bspB = BoolOp.fromMesh(m2)
  m1.visible = false
  m2.visible = false

  // // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect

  let bspResult = bspA.subtract(bspB)

  // //Get the resulting mesh from the result bsp, and assign meshA.material to the resulting mesh

  let meshResult = BoolOp.toMesh(bspResult, m1.matrix, m1.material)
  meshResult.userData.type = 'mesh'
  meshResult.name = `${m1.name}-${m2.name}`

  sc.obj3d.add(meshResult)

  return meshResult

}
