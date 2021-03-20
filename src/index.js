// class MinMaxGUIHelper {
//   constructor(obj, minProp, maxProp, minDif) {
//     this.obj = obj;
//     this.minProp = minProp;
//     this.maxProp = maxProp;
//     this.minDif = minDif;
//   }
//   get min() {
//     return this.obj[this.minProp];
//   }
//   set min(v) {
//     this.obj[this.minProp] = v;
//     this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
//   }
//   get max() {
//     return this.obj[this.maxProp];
//   }
//   set max(v) {
//     this.obj[this.maxProp] = v;
//     this.min = this.min;  // this will call the min setter
//   }
// }

// const gui = new GUI();
// gui.add(camera, 'zoom', 0.01, 1, 0.01).listen();
// const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
// gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
// gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');

import * as THREE from '../node_modules/three/src/Three';
import { OrbitControls } from './OrbitControls'
import { TrackballControls } from './trackball'
import { Sketcher } from './Sketcher'
import GUI from '../node_modules/dat.gui/src/dat/gui/GUI.js'
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';

import { KeyboardController } from './utils'



function main() {

  const Controller = new KeyboardController()

  var stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  const canvas = document.querySelector('#c');
  const view1Elem = document.querySelector('#view1');
  const view2Elem = document.querySelector('#view2');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const scene = new THREE.Scene();
  window.scene = scene;
  scene.background = new THREE.Color('pink');

  const helpersGroup = new THREE.Group();
  scene.add(helpersGroup);


  const size = 1;
  const near = 5;
  const far = 50;
  const camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
  camera.zoom = 0.1;
  camera.position.set(0, 0, 20);
  const controls = new OrbitControls(camera, view1Elem);
  // const controls = new TrackballControls(camera, view1Elem);
  controls.target.set(0, 0, 0);
  controls.update()
  const cameraHelper = new THREE.CameraHelper(camera);
  helpersGroup.add(cameraHelper);


  const camera2 = new THREE.PerspectiveCamera(
    60,  // fov
    2,   // aspect
    0.1, // near
    500, // far
  );
  camera2.position.set(16, 28, 40);
  camera2.lookAt(0, 5, 0);
  const controls2 = new OrbitControls(camera2, view2Elem);
  controls2.target.set(0, 5, 0);
  controls2.update();



  const axesHelper = new THREE.AxesHelper(5);
  helpersGroup.add(axesHelper);

  const sketchPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const sketcher = new Sketcher(camera, view1Elem, sketchPlane)
  scene.add(sketcher)

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }





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

  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    // return the aspect
    return width / height;
  }

  function render() {
    stats.begin();
    resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(true);
    {
      const aspect = setScissorForElement(view1Elem);
      camera.left = -aspect;
      camera.right = aspect;
      camera.updateProjectionMatrix();
      cameraHelper.update();
      cameraHelper.visible = false;
      renderer.render(scene, camera);
    }
    {
      const aspect = setScissorForElement(view2Elem);
      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();
      cameraHelper.visible = true;
      renderer.render(scene, camera2);
    }

    stats.end();

    // requestAnimationFrame(render);
  }
  // requestAnimationFrame(render);


  controls.addEventListener('change', render);
  controls.addEventListener('start', render);
  controls2.addEventListener('change', render);
  sketcher.addEventListener('change', render);
  window.addEventListener('resize', render);
  render();
}

main();
