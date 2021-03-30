

import React, { useEffect, useState } from 'react';
import './app.scss'

import { Provider, useDispatch, useSelector } from 'react-redux'
// import { renderInst } from './index'

export const Root = ({ store }) => (
  <Provider store={store}>
    <App></App>
  </Provider>
);



function treeId2Obj(id) {
  return renderInst.scene.getObjectById(parseInt(id.slice(1)))
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
      renderInst.canvas.addEventListener('pointermove', renderInst.onHover)
      return () => renderInst.canvas.removeEventListener('pointermove', renderInst.onHover)
    }
  }, [activeSketch])

  return <>

    <div className='buttons-group'>
      {activeSketch ?
        <button onClick={() => treeId2Obj(activeSketch).deactivate()}>
          Exit sketch
        </button> :
        <button onClick={renderInst.addSketch}> addsketch </button>
      }
      <button onClick={() => renderInst.extrude(treeId2Obj(activeSketch))}> extrude </button>
      {/* <button onClick={() => setState('')}> test </button> */}
    </div>

    <div className='feature-tree'>
      {treeEntries.allIds.map((entId, idx) => (
        <div key={idx}
          onClick={() => {
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

