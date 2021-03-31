

import React, { useEffect, useState } from 'react';
import './app.scss'

import { Provider, useDispatch, useSelector } from 'react-redux'
// import { sc } from './index'

export const Root = ({ store }) => (
  <Provider store={store}>
    <App></App>
  </Provider>
);



function treeId2Obj(id) {
  // return sc.scene.getObjectById(parseInt(id.slice(1)))
  return sc.getObjectByName(id)
}

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
        <button onClick={() => treeId2Obj(activeSketch).deactivate()}>
          Exit sketch
        </button> :
        <button onClick={sc.addSketch}> addsketch </button>
      }
      <button onClick={() => sc.extrude(treeId2Obj(activeSketch))}> extrude </button>
      {/* <button onClick={() => setState('')}> test </button> */}
    </div>

    <div className='feature-tree'>
      {treeEntries.map((entId, idx) => (
        <div key={idx}
          onClick={() => {
            console.log('here',treeId2Obj(entId))
            if (activeSketch) {
              treeId2Obj(activeSketch).deactivate()
            }
            treeId2Obj(entId).activate()
          }
          }
        >{entId}</div>
      ))}
    </div>

  </>
}

