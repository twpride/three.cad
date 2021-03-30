


import * as THREE from 'three/src/Three';
// import { OrbitControls } from './utils/OrbitControls'
import { TrackballControls } from './utils/trackball'
import { Sketcher } from './sketcher/Sketcher'
import Stats from './utils/stats.module.js';

import { add3DPoint } from './datums'
import { extrude } from './extrude'
import { onHover, onPick } from './utils/mouseEvents';
import { _vec2, _vec3 } from './utils/static'
import { Vector3 } from 'three/src/Three';

const eq = (a1, a2) => {
  if (a1.length != a2.length) return false
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) return false
  }
  return true
}


export class Scene extends THREE.Scene {
  constructor(store) {
    super()
    this.name = 'Scene'
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


    this.background = new THREE.Color(0x888888);
    const helpersGroup = new THREE.Group();
    helpersGroup.name = "helpersGroup";
    this.add(helpersGroup);
    const axesHelper = new THREE.AxesHelper(0.4);
    helpersGroup.add(axesHelper);

    const pxy = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.2,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        toneMapped: false
      })
    );
    pxy.name = "Plane"
    helpersGroup.add(pxy);

    const pyz = pxy.clone().rotateY(Math.PI / 2);
    pyz.material = pyz.material.clone();

    const pxz = pxy.clone().rotateX(-Math.PI / 2);
    pxz.material = pxz.material.clone();

    helpersGroup.add(pyz);
    helpersGroup.add(pxz);




    const color = 0xFFFFFF;
    const intensity = 1;
    const light1 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(10, 10, 10);
    this.add(light1);

    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(-10, -10, -5);
    this.add(light2);
    const ambient = new THREE.AmbientLight(color, intensity);
    this.add(ambient);



    this.render = render.bind(this);
    this.resizeCanvas = resizeCanvas.bind(this);
    this.addSketch = addSketch.bind(this);
    this.extrude = extrude.bind(this);
    this.onHover = onHover.bind(this);
    this.onPick = onPick.bind(this);

    this.addEventListener('change', this.render);
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
}

function render() {
  this.stats.begin();
  if (this.resizeCanvas(this.renderer)) {
    const canvas = this.renderer.domElement;
    this.camera.left = -canvas.clientWidth / canvas.clientHeight;
    this.camera.right = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }
  this.renderer.render(this, this.camera);
  this.stats.end();
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
  let references = this.selected.slice()

  if (references.length == 0) {
    while (references.length < 3) {
      let pt;
      try {
        pt = await new Promise((res, rej) => {
          this.canvas.addEventListener('pointerdown', () => res(this.hovered[0]), { once: true })
          window.addEventListener('keydown', (e) => rej(e), { once: true })
        })

        if (pt.type == 'Points') {
          references.push(pt)
        } else if (pt.name == 'Plane') {
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

  const sketcher = new Sketcher(this.camera, this.canvas, this.store)

  if (references.length == 1 && references[0].name == 'Plane') {
    this.add(sketcher)
    sketcher.matrix = references[0].matrix
    sketcher.plane.applyMatrix4(sketcher.matrix)
    sketcher.inverse = sketcher.matrix.clone().invert()

  } else if (references.length == 3) {
    this.add(sketcher)
    sketcher.align(
      ...references.map(
        el => new Vector3(...el.geometry.attributes.position.array).applyMatrix4(el.matrixWorld)
      )
    )

  } else {
    console.log('cancelled')
    return;
  }

  sketcher.activate()
  sketcher.addEventListener('change', this.render);
  this.render()
  this.store.dispatch({ type: 'rx-sketch', obj: sketcher })

  window.sketcher = sketcher
}

window.sc = new Scene(store);

