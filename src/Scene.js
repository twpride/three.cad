


// import * as THREE from 'three/src/Three';
import * as THREE from '../node_modules/three/src/Three';
// import { OrbitControls } from './utils/OrbitControls'
import { TrackballControls } from './utils/trackball'
import { Sketch } from './sketcher/Sketch'
import Stats from './utils/stats.module.js';

import { add3DPoint } from './datums'
import { extrude } from './extrude'
import { onHover, onPick } from './utils/mouseEvents';
import { _vec2, _vec3, color } from './utils/static'
import { Vector3 } from 'three/src/Three';
import {AxesHelper} from './utils/axes'

import CSG from "./utils/three-csg.js"

const eq = (a1, a2) => {
  if (a1.length != a2.length) return false
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) return false
  }
  return true
}

window.loader = new THREE.ObjectLoader();
window.nid = 0

export class Scene {
  constructor(store) {

    this.store = store;
    this.canvas = document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

    const size = 1;
    const near = 0;
    const far = 100;
    this.camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
    this.camera.zoom = 0.1;
    this.camera.position.set(50, 50, 50);

    // const controls = new OrbitControls(camera, view1Elem);
    const controls = new TrackballControls(this.camera, this.canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    this.obj3d = new THREE.Scene()

    this.obj3d.background = new THREE.Color(0x888888);
    const helpersGroup = new THREE.Group();
    helpersGroup.name = "helpersGroup";
    this.obj3d.add(helpersGroup);
    const axesHelper = new AxesHelper(0.4);
    helpersGroup.add(axesHelper);

    // console.log(color)
    const pxy = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({
        color: color.d,
        opacity: 0.2,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        toneMapped: false
      })
    );

    pxy.name = 'd' + nid++
    helpersGroup.add(pxy);

    const pyz = pxy.clone().rotateY(Math.PI / 2);
    pyz.material = pyz.material.clone();

    const pxz = pxy.clone().rotateX(-Math.PI / 2);
    pxz.material = pxz.material.clone();

    helpersGroup.add(pyz);
    helpersGroup.add(pxz);




    const intensity = 1;
    const light1 = new THREE.DirectionalLight(color.lighting, intensity);
    light1.position.set(10, 10, 10);
    this.obj3d.add(light1);

    const light2 = new THREE.DirectionalLight(color.lighting, intensity);
    light2.position.set(-10, -10, -5);
    this.obj3d.add(light2);
    const ambient = new THREE.AmbientLight(color.lighting, intensity);
    this.obj3d.add(ambient);



    this.render = render.bind(this);
    this.addSketch = addSketch.bind(this);
    this.extrude = extrude.bind(this);
    this.onHover = onHover.bind(this);
    this.onPick = onPick.bind(this);

    this.obj3d.addEventListener('change', this.render);
    controls.addEventListener('change', this.render);
    controls.addEventListener('start', this.render);
    window.addEventListener('resize', this.render);


    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.getElementById('stats').appendChild(this.stats.dom);


    this.hovered = [];
    this.selected = [];

    this.render();
  }

  resizeCanvas(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  saveState() {

    localStorage.setItem(
      'sv', JSON.stringify([nid, this.store.getState()])
    )

  }

  loadState() {  //uglyyy
    const [curNid, state] = JSON.parse(
      localStorage.getItem('sv')
    )

    window.nid = curNid

    const entries = state.treeEntries.byNid
    for (let k in entries) {

      if (k[0] == 's') { 

        entries[k].obj3d = loader.parse(entries[k].obj3d)
        this.obj3d.add(entries[k].obj3d)
        entries[k] = new Sketch(this.camera, this.canvas, this.store, state.treeEntries.byNid[k])
        entries[k].obj3d.addEventListener('change', this.render) // !! took 3 hours to realize

      } else if (k[0] == 'm') {

        entries[k] = loader.parse(state.treeEntries.byNid[k])
        this.obj3d.add(entries[k])

      }
    }

    this.store.dispatch({ type: 'restore-state', state })
  }

}

function render() {
  this.stats.begin();
  if (this.resizeCanvas(this.renderer)) {
    const canvas = this.renderer.domElement;
    this.camera.left = -canvas.clientWidth / canvas.clientHeight;
    this.camera.right = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }
  this.renderer.render(this.obj3d, this.camera);
  this.stats.end();
}



async function addSketch() {
  let references = this.selected.slice()

  if (references.length == 0) {
    while (references.length < 3) {
      let pt;
      try {
        pt = await new Promise((res, rej) => {
          this.canvas.addEventListener('pointerdown', () => res(this.hovered[0]), { once: true })
          window.addEventListener('keydown', (e) => rej(e), { once: true })
        })

        if (pt.name[0] == 'p') {
          references.push(pt)
        } else if (pt.name[0] == 'd') {
          references = [pt]
          break;
        }

      } catch (e) {
        if (e.key == 'Escape') {
          console.log('cancelled')
          return;
        }
      }
    }
  }

  const sketch = new Sketch(this.camera, this.canvas, this.store)

  if (references.length == 1 && references[0].name[0] == 'd') {
    this.obj3d.add(sketch.obj3d)
    sketch.obj3d.matrix = references[0].matrix
    sketch.plane.applyMatrix4(sketch.obj3d.matrix)
    sketch.obj3d.inverse = sketch.obj3d.matrix.clone().invert()

  } else if (references.length == 3) {
    this.obj3d.add(sketch.obj3d)
    sketch.align(
      ...references.map(
        el => new Vector3(...el.geometry.attributes.position.array).applyMatrix4(el.matrixWorld)
      )
    )

  } else {
    console.log('cancelled')
    return;
  }

  sketch.activate()
  sketch.obj3d.addEventListener('change', this.render);
  this.render()
  this.store.dispatch({ type: 'rx-sketch', obj: sketch })

}

window.sc = new Scene(store);







//  //Create a bsp tree from each of the meshes

// let bspA = CSG.fromMesh( mm[0] )                        
// let bspB = CSG.fromMesh( mm[2] )

// // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect

// let bspResult = bspA.subtract(bspB)

// //Get the resulting mesh from the result bsp, and assign meshA.material to the resulting mesh

// let meshResult = CSG.toMesh( bspResult, mm[0].matrix,  mm[0].material )

// sc.add(meshResult)
