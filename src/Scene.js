


import * as THREE from '../node_modules/three/src/Three';
import { TrackballControls } from '../lib/trackball'
import { Sketch } from './Sketch'
import Stats from '../lib/stats.module.js';

import { extrude, flipBufferGeometryNormals } from './extrude'
import { onHover, onPick, clearSelection } from './mouseEvents';
import { _vec2, _vec3, color, awaitSelection, ptObj, setHover } from './shared'

import { AxesHelper } from './axes'


import CSG from "../lib/three-csg"

import { STLExporter } from '../node_modules/three/examples/jsm/exporters/STLExporter'




window.loader = new THREE.ObjectLoader();
window.STLexp = new STLExporter();

window.id = 0
window.sid = 1
window.mid = 1


const pointMaterial = new THREE.PointsMaterial({
  color: color.selpoint,
  size: 4,
})

export class Scene {
  constructor(store) {
    this.sid = 1
    this.mid = 1

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
      const freePt = new THREE.Points(
        new THREE.BufferGeometry().setAttribute('position',
          new THREE.Float32BufferAttribute(3, 3)
        ),
        pointMaterial.clone()
      )

      freePt.matrixAutoUpdate = false
      freePt.visible = false
      freePt.depthTest = false
      freePt.userData.type = 'selpoint'
      helpersGroup.add(freePt);
    }
    this.selpoints = this.obj3d.children[0].children
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
    this.clearSelection = clearSelection.bind(this);
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
      'sv2', JSON.stringify([id, this.sid, this.mid, this.store.getState().treeEntries])
    )

  }
  
  saveString() {
    return JSON.stringify([id, this.sid, this.mid, this.store.getState().treeEntries])
  }

  loadState() {  //uglyyy
    const [curid, cursid, curmid, state] = JSON.parse(
      localStorage.getItem('sv2')
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

    this.store.dispatch({ type: 'restore-state', state })
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

  // clearSelection() {
  //   for (let x = 0, obj; x < this.selected.length; x++) {
  //     obj = this.selected[x]
  //     if (obj.userData.type == 'selpoint') {
  //       obj.visible = false
  //     } else {
  //       setHover(obj, 0)
  //     }
  //   }
  //   this.selected = []

  //   for (let x = 0; x < this.hovered.length; x++) {

  //     const obj = this.hovered[x]
  //     setHover(obj, 0)


  //   }

  // }


  boolOp(m1, m2, op, refresh = false) {
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

    const vertices = new THREE.Points(mesh.geometry, new THREE.PointsMaterial({ size: 0 }));
    vertices.userData.type = 'point'
    vertices.layers.enable(1)

    mesh.add(vertices)

    if (!refresh) {
      sc.obj3d.add(mesh)

      this.store.dispatch({
        type: 'set-entry-visibility', obj: {
          [m1.name]: false,
          [m2.name]: false,
          [mesh.name]: true,
        }
      })

      this.store.dispatch({
        type: 'rx-boolean', mesh, deps: [m1.name, m2.name]
      })
    } else {
      return mesh
    }

  }

  refreshNode(id) {
    let curId
    let que = [id]
    let idx = 0

    const { byId, tree } = this.store.getState().treeEntries
    while (idx < que.length) {
      curId = que[idx++]

      if (byId[curId].userData) {
        const info = byId[curId].userData.featureInfo
        let newNode
        if (info.length == 2) {
          newNode = this.extrude(byId[info[0]], info[1], true)
        } else if (info.length == 3) {
          newNode = this.boolOp(byId[info[0]], byId[info[1]], info[2], true)
        }
        byId[curId].geometry.copy(newNode.geometry)
      }

      for (let k in tree[curId]) {
        que.push(k)
      }
    }
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
  this.store.dispatch({ type: 'rx-sketch', obj: sketch })

  sketch.activate()

  this.render()


}

window.sc = new Scene(store)
sc.loadState()



// sc.camera.layers.enable(1)
// rc.layers.set(1)