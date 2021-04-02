

import React, { useEffect, useReducer, useRef, useState } from 'react';
import './app.css'

import { Provider, useDispatch, useSelector } from 'react-redux'
import { FaCube, FaEdit } from 'react-icons/fa'
import { MdEdit, MdDone, MdVisibilityOff, MdVisibility } from 'react-icons/md'
import { RiShape2Fill } from 'react-icons/ri'
import { Union, Subtract, Intersect, Line, Arc } from './icons'
import { color } from './utils/static'

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
    [Union, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Union'],
    [Subtract, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Subtract'],
    [Intersect, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Intersect'],
    [Line, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Line'],
    [Arc, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Arc'],
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

  let entry;
  if (entId[0]=="s") {
    entry = treeEntries[entId].obj3d
  } else {
    entry = treeEntries[entId]
  }

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const vis = entry.visible 

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
            entry.visible = false;
            sc.render()
            forceUpdate()
          }}
        >
          <MdVisibility />
        </div>
        :
        <div className='btn'
          onClick={() => {
            entry.visible = true;
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

const DesignLeaf = () => {

}