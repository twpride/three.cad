

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
  const activeSketch = useSelector(state => state.activeSketch)

  // const [state, setState] = useState('x')
  // useEffect(()=>{
  //   console.log('hereeee')
  // },[state])

  useEffect(() => {
    if (!activeSketch) {
      sc.canvas.addEventListener('pointermove', sc.onHover)
      sc.canvas.addEventListener('pointerdown', sc.onPick)
      return () => { 
        sc.canvas.removeEventListener('pointermove', sc.onHover) 
        sc.canvas.removeEventListener('pointerdown', sc.onPick) 
      }
    }
  }, [activeSketch])

  return <>

    <div className='buttons-group'>
      {activeSketch ?
        <button onClick={() => activeSketch.deactivate()}>
          Exit sketch
        </button> :
        <button onClick={sc.addSketch}> addsketch </button>
      }
      <button onClick={() => sc.extrude(activeSketch)}> extrude </button>
      {/* <button onClick={() => setState('')}> test </button> */}
    </div>

    <div className='feature-tree'>
      { treeEntries.allIds.map((entId, idx) => (
        <div key={idx}
          onClick={() => {
            if (activeSketch) {
              activeSketch.deactivate()
            }
            treeEntries.byId[entId].activate()
          }
          }
        >{entId}</div>
      ))}
    </div>

  </>
}

