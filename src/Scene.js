import * as THREE from '../node_modules/three/src/Three';

import { Sketch } from './Sketch'
import { extrude, flipBufferGeometryNormals } from './extrude'
import { onHover, onPick, clearSelection } from './mouseEvents';
import { _vec2, _vec3, color, awaitSelection, setHover, custPtMat } from './shared'
import { AxesHelper } from './axes'


import { TrackballControls } from '../extlib/trackball'
import CSG from "../extlib/three-csg"
import { STLExporter } from '../extlib/stl'


let stats
if (process.env.NODE_ENV !== 'production') {
  const { default: d } = require('../extlib/stats.module.js')
  stats = new d();
  // document.getElementById('stats').appendChild(stats.dom);
}


window.loader = new THREE.ObjectLoader();
window.STLexp = new STLExporter();

window.id = 0



export default class Scene {
  constructor(store) {
    this.sid = 1
    this.mid = 1

    this.canvas = document.querySelector('#c');

    this.rect = this.canvas.getBoundingClientRect().toJSON()

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.store = store

    const size = 1;
    const near = -1;
    const far = 1000;
    this.camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
    this.camera.zoom = 0.008;
    const cameraDist = 500
    const xzAngle = 30 * Math.PI / 180
    this.camera.position.set(
      cameraDist * Math.sin(xzAngle),
      cameraDist * Math.tan(30 * Math.PI / 180),
      cameraDist * Math.cos(xzAngle)
    );

    this.camera.layers.enable(3)

    this.controls = new TrackballControls(this.camera, this.canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.update();








    this.obj3d = new THREE.Scene()   ///////

    // this.obj3d.background = new THREE.Color(color.background);
    const helpersGroup = new THREE.Group();
    helpersGroup.name = "helpers";
    this.obj3d.add(helpersGroup);


    for (let i = 0; i < 4; i++) {
      const freePt = new THREE.Points(
        new THREE.BufferGeometry().setAttribute('position',
          new THREE.Float32BufferAttribute(3, 3)
        ),
        // pointMaterial.clone()
        custPtMat.clone()
      )

      freePt.matrixAutoUpdate = false
      freePt.visible = false
      freePt.renderOrder = 1
      // freePt.depthTest = false
      freePt.userData.type = 'selpoint'
      helpersGroup.add(freePt);
    }
    this.selpoints = this.obj3d.children[0].children
    this.fptIdx = 0;
    this.fptObj = {}


    const planeGeom = new THREE.PlaneGeometry(50, 50)
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


    const dist = 500
    const light1 = new THREE.PointLight(color.lighting, 0.5);
    light1.position.set(dist * 1, dist * 2, dist * 3);
    helpersGroup.add(light1)
    const light2 = new THREE.PointLight(color.lighting, 0.5);
    light2.position.set(-dist * 1, -dist * 2, -dist * 3);
    helpersGroup.add(light2);


    this.render = render.bind(this)
    this.addSketch = addSketch.bind(this)
    this.onHover = onHover.bind(this)
    this.onPick = onPick.bind(this)
    this.clearSelection = clearSelection.bind(this)
    this.setHover = setHover.bind(this)
    this.awaitSelection = awaitSelection.bind(this)
    this.extrude = this.extrude.bind(this)


    this.obj3d.addEventListener('change', this.render);
    this.controls.addEventListener('change', this.render);
    this.controls.addEventListener('start', this.render);
    window.addEventListener('resize', this.render);

    if (process.env.NODE_ENV !== 'production') {
      this.stats = stats
    }



    this.hovered = [];
    this.activeSketch = null;

    this.selected = [];
    this.mode = '';
    this.store.subscribe(this.reduxCallback.bind(this))

    this.render();
  }

  reduxCallback() {
    const currSelected = this.store.getState().ui.selectedList
    const currMode = this.store.getState().ui.mode
    if (currSelected !== this.selected) {
      this.selected = currSelected
    }
    if (currMode !== this.mode) {
      this.mode = currMode
    }

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


  clearScene() {
    const deleted = this.obj3d.children.splice(1)

    for (let i = 0; i < deleted.length; i++) {
      deleted[i].traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
    }
  }

  newPart() {
    this.clearScene()
    window.id = 0
    this.sid = 1
    this.mid = 1
  }

  loadState(file) {  //uglyyy

    this.clearScene()

    const [curid, cursid, curmid, state] = JSON.parse(
      file
    )

    window.id = curid
    this.sid = cursid
    this.mid = curmid

    const entries = state.byId
    for (let k in entries) {

      if (k[0] == 's') {
        entries[k].obj3d = loader.parse(entries[k].obj3d)
        this.obj3d.add(entries[k].obj3d)
        entries[k] = new Sketch(this, entries[k])
        entries[k].obj3d.addEventListener('change', this.render) // !! took 3 hours to realize

      } else if (k[0] == 'e') {

        entries[k] = loader.parse(state.byId[k])


        if (entries[k].userData.inverted) {
          flipBufferGeometryNormals(entries[k].geometry)
        }

        this.obj3d.add(entries[k])

      } else {
        entries[k] = loader.parse(state.byId[k])

        this.obj3d.add(entries[k])

      }
    }

    return state
  }

  loadSketch(string) {
    let entry = JSON.parse(string)
    entry.obj3d = loader.parse(entry.obj3d)

    // this.obj3d.add(entry.obj3d)

    entry = new Sketch(this, entry)
    entry.obj3d.addEventListener('change', this.render)

    return entry
  }

  extrude(sketch, depth) {
    const mesh = extrude(sketch, depth)
    mesh.name = 'e' + this.mid++

    this.obj3d.add(mesh)

    return mesh
  }

  boolOp(m1, m2, op) {
    let bspA = CSG.fromMesh(m1)
    let bspB = CSG.fromMesh(m2)
    m1.visible = false
    m2.visible = false
    m1.traverse(e => e.layers.disable(1))
    m2.traverse(e => e.layers.disable(1))


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

    let mesh = CSG.toMesh(bspResult, m1.matrix, m1.material)
    mesh.userData.type = 'mesh'
    mesh.userData.featureInfo = [m1.name, m2.name, op]

    mesh.name = `(${m1.name} ${opChar} ${m2.name})`
    mesh.layers.enable(1)

    const vertices = new THREE.Points(mesh.geometry, new THREE.PointsMaterial());
    vertices.visible = false
    vertices.userData.type = 'point'
    vertices.layers.enable(1)

    mesh.add(vertices)

    return mesh

  }

  refreshNode(id, { byId, tree }) {
    let curId
    let que = [id]
    let idx = 0

    while (idx < que.length) {
      curId = que[idx++]

      if (byId[curId].userData) { // if it is a mesh
        const info = byId[curId].userData.featureInfo
        let newNode
        if (info.length == 2) {
          newNode = extrude(byId[info[0]], info[1])
        } else if (info.length == 3) {
          newNode = this.boolOp(byId[info[0]], byId[info[1]], info[2])
        }
        byId[curId].geometry.copy(newNode.geometry)
        byId[curId].geometry.parameters = newNode.geometry.parameters // took 2 hours to figure out
        byId[curId].userData.inverted = newNode.userData.inverted
      }

      for (let k in tree[curId]) {
        que.push(k)
      }
    }

  }

}


let idx, x, y, ele, pos, dims, matrix;
function render() {
  if (process.env.NODE_ENV !== 'production') {
    this.stats.begin();
  }


  if (this.resizeCanvas(this.renderer)) {
    const canvas = this.renderer.domElement;
    this.camera.left = -canvas.clientWidth / canvas.clientHeight;
    this.camera.right = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    this.controls.handleResize()
    Object.assign(this.rect, this.canvas.getBoundingClientRect().toJSON())

  }


  if (this.axes) this.axes.resize(this.camera.zoom, this.canvas.clientHeight)

  this.renderer.render(this.obj3d, this.camera);

  if (this.activeSketch) {
    dims = this.activeSketch.dimGroup.children
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


  if (process.env.NODE_ENV !== 'production') {
    this.stats.end();
  }
}


function addSketch() {

  let sketch;

  if (this.selected.length == 3 && this.selected.every(e => e.userData.type == 'selpoint')) {
    sketch = new Sketch(this)
    this.obj3d.add(sketch.obj3d)
    sketch.align(
      ...this.selected.map(
        el => new THREE.Vector3(...el.geometry.attributes.position.array).applyMatrix4(el.matrixWorld)
      )
    )
  } else if (this.selected.length && this.selected[0].userData.type == 'plane') {
    sketch = new Sketch(this)
    sketch.obj3d.matrix = this.selected[0].matrix
    sketch.plane.applyMatrix4(sketch.obj3d.matrix)
    sketch.obj3d.inverse = sketch.obj3d.matrix.clone().invert()
    this.obj3d.add(sketch.obj3d)

  } else {
    return
  }

  this.newSketch = true

  this.clearSelection()
  sketch.obj3d.addEventListener('change', this.render);
  return sketch
}

window.sce = new Scene(store)