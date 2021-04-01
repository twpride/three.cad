

import React, { useEffect, useState } from 'react';
import './app.css'

import { Provider, useDispatch, useSelector } from 'react-redux'
// import { sc } from './index'

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

  return <>

    <div className='absolute left-0 flex flex-col'>
    {/* <div className='buttons-group'> */}
      {activeSketchNid ?
        <div
        className='btn-blue'
         onClick={() => treeEntries.byNid[activeSketchNid].deactivate()}>
          Exit sketch
        </div> :
        <div 
        className='btn-blue'
        onClick={sc.addSketch}> addsketch </div>
      }
      <button onClick={() => sc.extrude(treeEntries.byNid[activeSketchNid])}> extrude </button>
      {/* <button onClick={() => setState('')}> test </button> */}
    </div>


    <div className='absolute right-0'>
      {treeEntries.allNids.map((entId, idx) => (
        <div className='text-red-700 text-4xl' key={idx}
          onClick={() => {
            if (activeSketchNid) {
              treeEntries.byNid[activeSketchNid].deactivate()
            }
            treeEntries.byNid[entId].activate()
          }
          }
        >
          {entId}
        </div>
      ))}
    </div>

  </>
}

