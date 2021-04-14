


import * as THREE from '../node_modules/three/src/Three';
import { TrackballControls } from '../lib/trackball'
import { Sketch } from './Sketch'
import Stats from '../lib/stats.module.js';

import { extrude } from './extrude'
import { onHover, onPick, setHover } from './mouseEvents';
import { _vec2, _vec3, color, awaitSelection, ptObj } from './shared'

import { AxesHelper } from './axes'


import CSG from "../lib/three-csg"


const eq = (a1, a2) => {
  if (a1.length != a2.length) return false
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) return false
  }
  return true
}

window.loader = new THREE.ObjectLoader();
window.id = 0

export class Scene {
  constructor(store) {

    this.store = store;
    this.canvas = document.querySelector('#c');

    this.rect = this.canvas.getBoundingClientRect().toJSON()

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

    const size = 1;
    const near = 0;
    const far = 100;
    this.camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
    this.camera.zoom = 0.1;
    const cameraDist = 50
    const xzAngle = 30 * Math.PI / 180
    this.camera.position.set(
      cameraDist * Math.sin(xzAngle),
      cameraDist * Math.tan(30 * Math.PI / 180),
      cameraDist * Math.cos(xzAngle)
    );

    const controls = new TrackballControls(this.camera, this.canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    this.obj3d = new THREE.Scene()

    // this.obj3d.background = new THREE.Color(color.background);
    const helpersGroup = new THREE.Group();
    helpersGroup.name = "helpers";
    this.obj3d.add(helpersGroup);


    for (let i = 0; i < 4; i++) {
      const freePt = ptObj()
      freePt.matrixAutoUpdate = false
      freePt.material.size = 4
      freePt.material.color.set(color.selpoint)
      freePt.visible = false
      freePt.depthTest = false
      freePt.userData.type = 'selpoint'

      helpersGroup.add(freePt);
    }
    this.fptIdx = 0;
    this.fptObj = {}


    const planeGeom = new THREE.PlaneGeometry(5, 5)
    const pxy = new THREE.Mesh(
      planeGeom,
      new THREE.MeshBasicMaterial({
        color: color.plane,
        opacity: 0.02,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        toneMapped: false
      })
    );
    pxy.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(planeGeom),
        new THREE.LineBasicMaterial({ color: color.planeBorder })
      )
    )
    pxy.userData.type = 'plane'
    pxy.layers.enable(1)
    pxy.children[0].layers.disable(1)
    const pyz = pxy.clone().rotateY(Math.PI / 2);
    const pxz = pxy.clone().rotateX(-Math.PI / 2);
    helpersGroup.add(pxy);
    [pxz, pyz].forEach(e => {
      e.traverse(f => f.material = f.material.clone())
      helpersGroup.add(e);
    });

    this.axes = new AxesHelper(this.camera.zoom)
    this.axes.visible = false
    helpersGroup.add(this.axes);


    const dist = 15
    const light1 = new THREE.PointLight(color.lighting, 0.7);
    light1.position.set(dist, dist, dist);
    helpersGroup.add(light1);
    const light2 = new THREE.PointLight(color.lighting, 0.7);
    light2.position.set(-dist, -dist, -dist);
    helpersGroup.add(light2);


    this.render = render.bind(this);
    this.addSketch = addSketch.bind(this);
    this.extrude = extrude.bind(this);
    this.onHover = onHover.bind(this);
    this.onPick = onPick.bind(this);
    this.setHover = setHover.bind(this);
    this.awaitSelection = awaitSelection.bind(this);

    this.obj3d.addEventListener('change', this.render);
    controls.addEventListener('change', this.render);
    controls.addEventListener('start', this.render);
    window.addEventListener('resize', this.render);


    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.getElementById('stats').appendChild(this.stats.dom);


    this.hovered = [];
    this.selected = [];
    this.activeSketch = null;

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
      'sv', JSON.stringify([id, this.store.getState()])
    )

  }

  loadState() {  //uglyyy
    const [curid, state] = JSON.parse(
      localStorage.getItem('sv')
    )

    window.id = curid

    const entries = state.treeEntries.byId
    for (let k in entries) {

      if (k[0] == 's') {
        entries[k].obj3d = loader.parse(entries[k].obj3d)
        this.obj3d.add(entries[k].obj3d)
        entries[k] = new Sketch(this, state.treeEntries.byId[k])
        entries[k].obj3d.addEventListener('change', this.render) // !! took 3 hours to realize

      } else if (k[0] == 'm') {

        entries[k] = loader.parse(state.treeEntries.byId[k])
        // console.log(entries[k])
        this.obj3d.add(entries[k])

      }
    }

    this.store.dispatch({ type: 'restore-state', state })
  }

  clearSelection() {
    for (let x = 0; x < this.selected.length; x++) {
      const obj = this.selected[x]
      if (obj.userData.type == 'plane') {
        obj.material.opacity = 0.05
        obj.children[0].material.color.set(color['planeBorder'])
      } else {
        obj.material.color.set(color[obj.userData.type])
      }
      if (obj.userData.type == 'selpoint') obj.visible = false
    }
    this.selected = []

    for (let x = 0; x < this.hovered.length; x++) {
      const obj = this.hovered[x]
      obj.material.color.set(color[obj.userData.type])
      if (obj.userData.type == 'plane') {
        obj.material.opacity = 0.05
        obj.children[0].material.color.set(color['planeBorder'])
      } else {
        obj.material.color.set(color[obj.userData.type])
      }
    }

    this.obj3d.dispatchEvent({ type: 'change' })
  }


  hover(obj) {

    if (typeof obj == 'object' && !this.selected.includes(obj)) {

      if (obj.userData.type == 'plane') {
        obj.material.opacity = 0.02
        obj.children[0].material.color.set(color['planeBorder'])
      } else {
        if (obj.userData.type == 'mesh') {
          obj.material.emissive.set(color.emissive)
        }
        obj.material.color.set(color[obj.userData.type])
      }

    }


    if (typeof obj == 'object' && !this.selected.includes(obj)) {

      if (obj.userData.type == 'plane') {
        obj.material.opacity = 0.02
        obj.children[0].material.color.set(color['planeBorder'])
      } else {
        if (obj.userData.type == 'mesh') {
          obj.material.emissive.set(color.emissive)
        }
        obj.material.color.set(color[obj.userData.type])
      }

    }


    obj.material.color.set(color[obj.userData.type])

    if (obj.userData.type == 'mesh') {
      obj.material.emissive.set(color.emissive)
    } else if (obj.userData.type == 'plane') {
      obj.material.opacity = 0.02
      obj.children[0].material.color.set(color['planeBorder'])
    }

    if (obj.userData.type == 'selpoint') {
      obj.visible = false
    }





    if (typeof obj == 'object') {

      if (obj.userData.type == 'plane') {
        obj.material.opacity = 0.06
        obj.children[0].material.color.set(hoverColor['planeBorder'])
      } else {
        if (obj.userData.type == 'mesh') {
          obj.material.emissive.set(hoverColor.emissive)
        }
        obj.material.color.set(hoverColor[obj.userData.type])
      }

    }







  }

  subtract(m1, m2, op) {
    let bspA = CSG.fromMesh(m1)
    let bspB = CSG.fromMesh(m2)
    m1.visible = false
    m2.visible = false
    m1.traverse(e => e.layers.disable(1))
    m2.traverse(e => e.layers.disable(1))

    // // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect

    let bspResult, opChar;
    switch (op) {
      case 's':
        bspResult = bspA.subtract(bspB)
        opChar = "-"
        break;
      case 'u':
        bspResult = bspA.union(bspB)
        opChar = "\u222a"
        break;
      case 'i':
        bspResult = bspA.intersect(bspB)
        opChar = "\u2229"
        break;
      default:
        break;
    }

    // //Get the resulting mesh from the result bsp, and assign meshA.material to the resulting mesh

    let mesh = CSG.toMesh(bspResult, m1.matrix, m1.material)
    mesh.userData.type = 'mesh'

    mesh.name = `(${m1.name}${opChar}${m2.name})`
    mesh.layers.enable(1)



    const vertices = new THREE.Points(mesh.geometry, new THREE.PointsMaterial({ size: 0 }));
    vertices.userData.type = 'point'
    vertices.layers.enable(1)

    // mesh.add(line)
    mesh.add(vertices)


    sc.obj3d.add(mesh)

    this.store.dispatch({
      type: 'set-entry-visibility', obj: {
        [m1.name]: false,
        [m2.name]: false,
        [mesh.name]: true,
      }
    })

    return mesh
  }
}


let idx, x, y, ele, pos, dims, matrix;
function render() {
  this.stats.begin();
  if (this.resizeCanvas(this.renderer)) {
    const canvas = this.renderer.domElement;
    this.camera.left = -canvas.clientWidth / canvas.clientHeight;
    this.camera.right = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    Object.assign(this.rect, this.canvas.getBoundingClientRect().toJSON())

  }


  if (this.axes) this.axes.resize(this.camera.zoom)

  this.renderer.render(this.obj3d, this.camera);

  if (this.activeSketch) {
    dims = this.activeSketch.obj3d.children[1].children
    matrix = this.activeSketch.obj3d.matrix

    for (idx = 1; idx < dims.length; idx += 2) {
      ele = dims[idx]

      pos = _vec3.set(
        ...ele.geometry.attributes.position.array
      ).applyMatrix4(matrix).project(this.camera)

      x = (pos.x * .5 + .5) * this.canvas.clientWidth + 10 + this.rect.left;
      y = (pos.y * -.5 + .5) * this.canvas.clientHeight + this.rect.top;

      ele.label.style.transform = `translate(0%, -50%) translate(${x}px,${y}px)`;
    }
  }








  this.stats.end();
}





async function addSketch() {

  let sketch;

  const references = await this.awaitSelection({ selpoint: 3 }, { plane: 1 });

  if (!references) return;

  if (references[0].userData.type == 'plane') {
    sketch = new Sketch(this)
    sketch.obj3d.matrix = references[0].matrix
    sketch.plane.applyMatrix4(sketch.obj3d.matrix)
    sketch.obj3d.inverse = sketch.obj3d.matrix.clone().invert()
    this.obj3d.add(sketch.obj3d)
  } else {
    sketch = new Sketch(this)
    this.obj3d.add(sketch.obj3d)
    sketch.align(
      ...references.map(
        el => new THREE.Vector3(...el.geometry.attributes.position.array).applyMatrix4(el.matrixWorld)
      )
    )
  }


  this.clearSelection()


  sketch.obj3d.addEventListener('change', this.render);
  console.log('render')
  this.store.dispatch({ type: 'rx-sketch', obj: sketch })

  sketch.activate()

  this.render()
}

window.sc = new Scene(store)
// sc.loadState()

// sc.camera.layers.enable(1)
// rc.layers.set(1)