

import React from 'react';
import { Provider } from 'react-redux';
import './app.scss'

export const Root = ({ store }) => (
  <Provider store={store}>
    <App></App>
  </Provider>
);


const App = () => {

  return <>
    <div>in the world where</div>
  </>
}