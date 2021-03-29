

import React from 'react';
import './app.scss'

import { Provider, useDispatch, useSelector } from 'react-redux'
// import { renderInst } from './index'

export const Root = ({ store }) => (
  <Provider store={store}>
    <App></App>
  </Provider>
);

const App = () => {
  const dispatch = useDispatch()
  const treeEntries = useSelector(state => state.treeEntries)

  return <>

    <div className='buttons-group'>
      <button onClick={() => dispatch({ type: 'toggle', payload: true })}> true</button>
      <button onClick={() => dispatch({ type: 'toggle', payload: false })}> false </button>
      <button onClick={renderInst.addSketch}> addsketch </button>
      <button onClick={()=>renderInst.extrude(4)}> extrude </button>
    </div>

    <div className='feature-tree'>
      {treeEntries.allIds.map((entId, idx) => (
        <div key={idx}
        onClick={()=>{
          renderInst.extrude(treeEntries.byId[entId])
        }}
        >{entId}</div>
      ))}
    </div>

  </>
}

