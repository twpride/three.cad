
import ReactDOM from 'react-dom'
import React from 'react'
import { Root } from './app.jsx'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    React.createElement(Root, { store: store }, null)
    , document.getElementById('react')
  );
});
