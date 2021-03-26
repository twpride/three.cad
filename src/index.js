

import * as THREE from '../node_modules/three/src/Three';
import { OrbitControls } from './OrbitControls'
import { TrackballControls } from './trackball'
import { Sketcher } from './sketcher/Sketcher'
import Stats from './stats.module.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'

import { App } from './app.jsx'

function main(store) {

  var stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.getElementById('stats').appendChild(stats.dom);

  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb0b0b0);

  const helpersGroup = new THREE.Group();
  scene.add(helpersGroup);
  const axesHelper = new THREE.AxesHelper(5);
  helpersGroup.add(axesHelper);

  const size = 1;
  const near = 5;
  const far = 50;
  const camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
  camera.zoom = 0.1;
  camera.position.set(0, 0, 30);

  // const controls = new OrbitControls(camera, view1Elem);
  const controls = new TrackballControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update()



  const color = 0xFFFFFF;
  const intensity = 1;
  const light1 = new THREE.DirectionalLight(color, intensity);
  light1.position.set(10, 10, 10);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(color, intensity);
  light2.position.set(-10, -10, -5);
  scene.add(light2);

  const ambient = new THREE.AmbientLight(color, intensity);
  scene.add(ambient);


  const sketchPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const sketcher = new Sketcher(camera, canvas, sketchPlane)
  window.sketcher = sketcher
  scene.add(sketcher)


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    stats.begin();
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.left = -canvas.clientWidth / canvas.clientHeight;
      camera.right = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    stats.end();
  }
  controls.addEventListener('change', render);
  controls.addEventListener('start', render);
  sketcher.addEventListener('change', render);
  window.addEventListener('resize', render);
  render();
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}

const store = createStore(todos, ['Use Redux'])

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs'
})

console.log(store.getState())


// main(store);
main();


// document.addEventListener('DOMContentLoaded', () => {

//   const root = document.getElementById('react');
//   ReactDOM.render(
//     React.createElement(App, { store: store }, null)
//     , root
//   );

// });