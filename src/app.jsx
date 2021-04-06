

import React, { useEffect, useReducer, useRef, useState } from 'react';
import './app.css'

import { Provider, useDispatch, useSelector } from 'react-redux'
import { FaCube, FaEdit } from 'react-icons/fa'
import { MdEdit, MdDone, MdVisibilityOff, MdVisibility, MdDelete } from 'react-icons/md'
import * as Icon from "./icons";
import { color } from './utils/shared'

export const Root = ({ store }) => (
  <Provider store={store}>
    <App></App>
  </Provider>
);




const App = () => {
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
      [FaEdit, sc.addSketch, 'Sketch']
    ,
    [FaCube, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Extrude'],
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
    [Icon.Dimension, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Dimension'],
    [Icon.Line, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Line'],
    [Icon.Arc, () => sc.extrude(treeEntries.byId[activeSketchId]), 'Arc'],
  ]

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  return <>
    <div className='absolute flex ml-auto mr-auto left-0 right-0 justify-center'>
    {/* <div className='absolute flex justify-center'> */}
      {
        btnz.map(([Icon, fcn, txt], idx) => (
          <div className="btn flex items-center justify-start p-1 text-lg" key={idx}
            onClick={fcn}
          >
            <Icon className="w-6 h-6" />
            <div className="ml-2">{txt}</div>
          </div>
        ))
      }
    </div>

    <div className='absolute left-0 top-36 w-40 flex flex-col'>
      {treeEntries.allIds.map((entId, idx) => (
        <TreeEntry key={idx} entId={entId} />
      ))}
    </div>

  </>

}

const TreeEntry = ({ entId }) => {

  const treeEntries = useSelector(state => state.treeEntries.byId)
  const dispatch = useDispatch()

  const activeSketchId = useSelector(state => state.activeSketchId)

  let obj3d, entry;

  entry = treeEntries[entId]

  if (entId[0] == "s") {
    obj3d = treeEntries[entId].obj3d
  } else {
    obj3d = treeEntries[entId]
  }

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const vis = obj3d.visible

  return <div className='bg-gray-50 flex justify-between w-full'>
    <div className="btn"
      onPointerEnter={() => {
        if (entId[0] == 'm') {
          entry.material.color.set(color.hover)
          sc.render()
        }
      }}
      onPointerLeave={() => {
        const obj = entry
        if (entId[0] == 'm' && !sc.selected.includes(obj)) {
          obj.material.color.set(color.mesh)
          sc.render()
        }
      }}
      onPointerDown={() => {
        if (entId[0] == 'm') {
          sc.selected.push(
            entry
          )
          sc.render()
        }
      }}
    >
      {entId}
    </div>
    <div className='flex'>
      <div className='btn'
        onClick={() => {
          activeSketchId && treeEntries[activeSketchId].deactivate()
          entry.activate()
          sc.clearSelection()
          sc.activeSketch = entry;
        }}
      >
        <MdEdit />
      </div>

      <div className='btn'
        onClick={() => {
          dispatch({ type: 'delete-node', id: entId })
        }}
      >
        <MdDelete />
      </div>
      {
        vis ?
          <div className='btn'
            onClick={() => {
              obj3d.visible = false;
              sc.render()
              forceUpdate()
            }}
          >
            <MdVisibility />
          </div>
          :
          <div className='btn'
            onClick={() => {
              obj3d.visible = true;
              sc.render()
              forceUpdate()
            }}
          >
            <MdVisibilityOff />
          </div>
      }
    </div>

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

