

import React from 'react';
import './app.scss'

import { Provider, useDispatch, useSelector } from 'react-redux'
import { renderInst } from './index'

export const Root = ({ store }) => (
  <Provider store={store}>
    <App></App>
  </Provider>
);

const App = () => {
  const dispatch = useDispatch()
  const sketches = useSelector(state => state.sketches)

  return <>
    <button onClick={() => dispatch({ type: 'toggle', payload: true })}> true</button>
    <button onClick={() => dispatch({ type: 'toggle', payload: false })}> false </button>
    <button onClick={renderInst.addSketch}> addsketch </button>

    <div className='feature-tree'>
      {sketches.map((e, idx) => (
        <div key={idx}>{e}</div>
      ))}
    </div>

  </>
}

