

import React, { useEffect, useState } from 'react';
import './app.css'

import { Provider, useDispatch, useSelector } from 'react-redux'
// import { sc } from './index'
import { BsPencilSquare } from 'react-icons/bs'
import { FaCube, FaCheck } from 'react-icons/fa'
import { MdAdd, MdEdit, MdDone } from 'react-icons/md'

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
      [MdAdd, sc.addSketch, 'Sketch']
    ,
    [FaCube, () => sc.extrude(treeEntries.byNid[activeSketchNid]), 'Extrude']
  ]

  return <div className='absolute left-0 w-1/6 flex flex-col'>
    {
      btnz.map(([Icon, fcn, txt]) => (
        <div className="btn flex items-center justify-end p-1 text-xs w-16"
          onClick={fcn}
        >
          <div>{txt}</div>
          <Icon className="w-4 h-4 ml-1" />
        </div>
      ))
    }



    <div className=''>
      {treeEntries.allNids.map((entId, idx) => (
        <div className='bg-gray-50 flex justify-between'
          key={idx}>
          <div className='btn'
            onClick={() => {
              activeSketchNid && treeEntries.byNid[activeSketchNid].deactivate()
              treeEntries.byNid[entId].activate()
            }}
          >
            <MdEdit />
          </div>
          <div class="btn">{entId}</div>
        </div>
      ))}
    </div>
  </div>
}

