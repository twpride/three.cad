

import React, { useEffect, useReducer, useRef, useState } from 'react';
import './app.css'

import { Provider, useDispatch, useSelector } from 'react-redux'
import { FaCube, FaEdit } from 'react-icons/fa'
import { MdEdit, MdDone, MdVisibilityOff, MdVisibility } from 'react-icons/md'
import { RiShape2Fill } from 'react-icons/ri'
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
  const activeSketchNid = useSelector(state => state.activeSketchNid)

  // const [state, setState] = useState('x')
  // useEffect(()=>{
  //   console.log('hereeee')
  // },[state])


  useEffect(() => {
    if (!activeSketchNid) {
      sc.canvas.addEventListener('pointermove', sc.onHover)
      sc.canvas.addEventListener('pointerdown', sc.onPick)
      return () => {
        sc.canvas.removeEventListener('pointermove', sc.onHover)
        sc.canvas.removeEventListener('pointerdown', sc.onPick)
      }
    }
  }, [activeSketchNid])


  const btnz = [
    activeSketchNid ?
      [MdDone, () => treeEntries.byNid[activeSketchNid].deactivate(), 'Finish'] :
      [FaEdit, sc.addSketch, 'Sketch']
    ,
    [FaCube, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Extrude'],
    [Icon.Union, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Union'],
    [Icon.Subtract, subtract, 'Subtract'],
    [Icon.Intersect, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Intersect'],
    [Icon.Dimension, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Dimension'],
    [Icon.Line, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Line'],
    [Icon.Arc, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Arc'],
  ]

  return <div className='absolute left-0 w-1/6 flex flex-col'>
    {
      btnz.map(([Icon, fcn, txt], idx) => (
        <div className="btn flex items-center justify-end p-1 text-lg w-36" key={idx}
          onClick={fcn}
        >
          <div>{txt}</div>
          <Icon className="w-6 h-6 ml-1" />
        </div>
      ))
    }

    <div className=''>
      {treeEntries.allNids.map((entId, idx) => (
        <TreeEntry key={idx} entId={entId} />
      ))}
    </div>

  </div>

}

const TreeEntry = ({ entId }) => {

  const treeEntries = useSelector(state => state.treeEntries.byNid)

  const activeSketchNid = useSelector(state => state.activeSketchNid)

  let obj3d, entry;
  
  entry = treeEntries[entId]

  if (entId[0] == "s") {
    obj3d = treeEntries[entId].obj3d
  } else {
    obj3d = treeEntries[entId]
  }

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const vis = obj3d.visible

  return <div className='bg-gray-50 flex justify-between'>
    <div className='btn'
      onClick={() => {
        activeSketchNid && treeEntries[activeSketchNid].deactivate()
        entry.activate()
      }}
    >
      <MdEdit />
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
          obj.material.color.set(color.m)
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
  </div>

}

const subtract = () => {
  //  //Create a bsp tree from each of the meshes
  console.log(sc.selected.length !=2 || !sc.selected.every(e=>e.name && e.name[0]=='m'),"wtf")
  if (sc.selected.length !=2 || !sc.selected.every(e=>e.name && e.name[0]=='m')) return
  console.log('here')
  const [m1, m2] = sc.selected

  let bspA = BoolOp.fromMesh( m1 )                        
  let bspB = BoolOp.fromMesh( m2 )
  m1.visible = false
  m2.visible = false

  // // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect

  let bspResult = bspA.subtract(bspB)

  // //Get the resulting mesh from the result bsp, and assign meshA.material to the resulting mesh

  let meshResult = BoolOp.toMesh( bspResult, m1.matrix,  m1.material )

  sc.obj3d.add(meshResult)
  sc.render()

}

