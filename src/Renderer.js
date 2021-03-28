


import * as THREE from 'three/src/Three';
// import { OrbitControls } from './utils/OrbitControls'
import { TrackballControls } from './utils/trackball'
import { Sketcher } from './sketcher/Sketcher'
import Stats from './utils/stats.module.js';

import { add3DPoint } from './datums'


export function Renderer(store) {
  this.store = store
  // this.stats = new Stats();
  // this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  // document.getElementById('stats').appendChild(this.stats.dom);

  this.canvas = document.querySelector('#c');
  this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

  this.scene = new THREE.Scene();
  this.raycaster = new THREE.Raycaster();

  window.scene = this.scene;
  this.scene.background = new THREE.Color(0x888888);
  // this.scene.background = new THREE.Color(0xffffff);

  const helpersGroup = new THREE.Group();
  helpersGroup.name= "helpersGroup"
  this.scene.add(helpersGroup);
  const axesHelper = new THREE.AxesHelper(5);
  helpersGroup.add(axesHelper);

  const size = 1;
  const near = 0;
  const far = 100;
  this.camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
  this.camera.zoom = 0.1;
  this.camera.position.set(0, 0, 50);

  // const controls = new OrbitControls(camera, view1Elem);
  const controls = new TrackballControls(this.camera, this.canvas);
  controls.target.set(0, 0, 0);
  controls.update()



  const color = 0xFFFFFF;
  const intensity = 1;
  const light1 = new THREE.DirectionalLight(color, intensity);
  light1.position.set(10, 10, 10);
  this.scene.add(light1);

  const light2 = new THREE.DirectionalLight(color, intensity);
  light2.position.set(-10, -10, -5);
  this.scene.add(light2);
  const ambient = new THREE.AmbientLight(color, intensity);
  this.scene.add(ambient);




  // this.defaultPlanes = [
  //   new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
  //   new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  //   new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
  // ]

  // this.defaultPlanes.forEach(pl => {
  //   const helper = new THREE.PlaneHelper(pl, 10, 0xffffff)
  //   this.scene.add(helper);
  // })








  const unsubscribe = store.subscribe(handleChange.bind(this))

  let state;
  function handleChange() {
    let prevState = state
    state = store.getState()

    // if (prevState.sketches.length < state.sketches.length) {


    // }

    // if (state.toggle) {
    //   window.addEventListener('keydown', this.sketcher.onKeyPress)
    //   canvas.addEventListener('pointerdown', this.sketcher.onPick)
    //   canvas.addEventListener('pointermove', this.sketcher.onHover)
    //   canvas.removeEventListener('pointerdown', this.add3DPoint)
    // } else {
    //   window.removeEventListener('keydown', this.sketcher.onKeyPress)
    //   canvas.removeEventListener('pointerdown', this.sketcher.onPick)
    //   canvas.removeEventListener('pointermove', this.sketcher.onHover)
    //   canvas.addEventListener('pointerdown', this.add3DPoint)
    // }

  }



  this.hovered = []
  this.selected = new Set()

  this.render = render.bind(this)
  this.resizeCanvas = resizeCanvas.bind(this)
  this.addSketch = addSketch.bind(this)
  // this.waitPoint = waitPoint.bind(this)

  controls.addEventListener('change', this.render);
  controls.addEventListener('start', this.render);
  window.addEventListener('resize', this.render);
  this.render()
}

function render() {
  // this.stats.begin();
  if (this.resizeCanvas(this.renderer)) {
    const canvas = this.renderer.domElement;
    this.camera.left = -canvas.clientWidth / canvas.clientHeight;
    this.camera.right = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }
  this.renderer.render(scene, this.camera);
  // this.stats.end();
}

function resizeCanvas(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}


async function addSketch() {

  const result = []
  for (let i = 0; i < 3; i++) {
    const pt = await new Promise((res, rej) => {
      this.canvas.addEventListener('pointerdown', (e) => res(getPoint(e, this.camera)), { once: true })
    })
    result.push(pt)
  }

  const sketcher = new Sketcher(this.camera, this.canvas, this.store)
  this.scene.add(sketcher)

  sketcher.align(...result)



  window.addEventListener('keydown', sketcher.onKeyPress)
  this.canvas.addEventListener('pointerdown', sketcher.onPick)
  this.canvas.addEventListener('pointermove', sketcher.onHover)

  sketcher.addEventListener('change', this.render);

  window.sketcher = sketcher

  this.render()
  this.store.dispatch({ type: 'rx-new-sketch', idx: this.scene.children.length - 1 })

}



function getPoint(e, camera) {
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    - (e.clientY / window.innerHeight) * 2 + 1
  )
  return new THREE.Vector3(mouse.x, mouse.y, 0).unproject(camera)
}

window.renderInst = new Renderer(store);