

import React, { useEffect, useState } from 'react';
import './app.scss'

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

    <div className='buttons-group'>
      {activeSketchNid ?
        <button onClick={() => treeEntries.byNid[activeSketchNid].deactivate()}>
          Exit sketch
        </button> :
        <button onClick={sc.addSketch}> addsketch </button>
      }
      <button onClick={() => sc.extrude(treeEntries.byNid[activeSketchNid])}> extrude </button>
      {/* <button onClick={() => setState('')}> test </button> */}
    </div>

    <div className='feature-tree'>
      { treeEntries.allNids.map((entId, idx) => (
        <div key={idx}
          onClick={() => {
            if (activeSketchNid) {
              treeEntries.byNid[activeSketchNid].deactivate()
            }
            treeEntries.byNid[entId].activate()
          }
          }
        >{entId}</div>
      ))}
    </div>

  </>
}

