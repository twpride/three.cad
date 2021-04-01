

import * as THREE from '../../node_modules/three/src/Three';

import { drawOnClick1, drawOnClick2, drawPreClick2, drawClear } from './drawEvents'
import { onHover, onDrag, onPick, onRelease } from '../utils/mouseEvents'
import { addDimension, setCoincident } from './constraintEvents'
import { get3PtArc } from './drawArc'
import { _vec2, _vec3, raycaster } from '../utils/static'
import { replacer, reviver } from '../utils/mapJSONReplacer'
import {AxesHelper} from '../utils/axes'




class Sketch {


  constructor(camera, canvas, store, preload) {


    // [0]:x, [1]:y, [2]:z
    this.ptsBuf = new Float32Array(this.max_pts * 3).fill(NaN)

    // [0]:type, [1]:pt1, [2]:pt2, [3]:pt3, [4]:pt4
    this.linksBuf = new Float32Array(this.max_links * 5).fill(NaN)

    // [0]:type, [1]:val, [2]:pt1, [3]:pt2, [4]:lk1, [5]:lk2
    this.constraintsBuf = new Float32Array(this.max_constraints * 6).fill(NaN)


    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    if (preload === undefined) {

      this.obj3d = new THREE.Group()
      this.obj3d.name = "s" + nid++
      this.obj3d.matrixAutoUpdate = false;

      this.objIdx = new Map()

      this.linkedObjs = new Map()
      this.l_id = 0;

      this.constraints = new Map()
      this.c_id = 0;

      this.sub = new THREE.Group();
      this.obj3d.add(this.sub);
      const axesHelper = new AxesHelper(2);
      this.sub.add(axesHelper);

    } else {


      this.obj3d = preload.obj3d
      this.obj3d.inverse = preload.obj3d.matrix.clone().invert()

      this.objIdx = JSON.parse(preload.objIdx, reviver)

      this.linkedObjs = JSON.parse(preload.linkedObjs, reviver)
      this.l_id = preload.l_id;

      this.constraints = JSON.parse(preload.constraints, reviver)
      this.c_id = preload.c_id;


      this.updatePointsBuffer()
      this.updateOtherBuffers()

      this.plane.applyMatrix4(this.obj3d.matrix)
    }

    this.camera = camera;
    this.canvas = canvas;
    this.store = store;






    this.bindHandlers()

    this.selected = []
    this.hovered = []
    this.mode = ""
    this.subsequent = false;
  }

  toJSON() {
    return {
      obj3d: this.obj3d,

      objIdx: JSON.stringify(this.objIdx, replacer),

      linkedObjs: JSON.stringify(this.linkedObjs, replacer),
      l_id: this.l_id,

      constraints: JSON.stringify(this.constraints, replacer),
      c_id: this.c_id,
    }
  }


  bindHandlers() {
    this.drawOnClick1 = drawOnClick1.bind(this);
    this.drawPreClick2 = drawPreClick2.bind(this);
    this.drawOnClick2 = drawOnClick2.bind(this);

    this.onHover = onHover.bind(this);
    this.onPick = onPick.bind(this);
    this.onDrag = onDrag.bind(this);
    this.onRelease = onRelease.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

  }


  activate() {
    window.addEventListener('keydown', this.onKeyPress)
    this.canvas.addEventListener('pointerdown', this.onPick)
    this.canvas.addEventListener('pointermove', this.onHover)
    this.store.dispatch({ type: 'set-active-sketch', sketch: this.obj3d.name })

    window.sketcher = this
  }

  deactivate() {
    window.removeEventListener('keydown', this.onKeyPress)
    this.canvas.removeEventListener('pointerdown', this.onPick)
    this.canvas.removeEventListener('pointermove', this.onHover)
    this.store.dispatch({ type: 'exit-sketch' })
  }


  align(origin, x_dir, y_dir) {
    const up = _vec3.subVectors(y_dir, origin).normalize();
    const te = _m1.elements;
    _x.subVectors(x_dir, origin).normalize();
    _z.crossVectors(_x, up).normalize();
    _y.crossVectors(_z, _x);

    te[0] = _x.x; te[4] = _y.x; te[8] = _z.x;
    te[1] = _x.y; te[5] = _y.y; te[9] = _z.y;
    te[2] = _x.z; te[6] = _y.z; te[10] = _z.z;

    this.obj3d.quaternion.setFromRotationMatrix(_m1);
    const parent = this.obj3d.parent;
    _m1.extractRotation(parent.matrixWorld);
    _q1.setFromRotationMatrix(_m1);
    this.obj3d.quaternion.premultiply(_q1.invert());
    this.obj3d.updateMatrix();
    this.obj3d.matrix.setPosition(origin)

    this.plane.applyMatrix4(this.obj3d.matrix)
    this.obj3d.inverse = this.obj3d.matrix.clone().invert()
  }



  onKeyPress(e) {
    switch (e.key) {
      case 'Escape':
        drawClear.bind(this)()
        this.mode = ""
        break;
      case 'l':
        if (this.mode == 'line') {
          drawClear.bind(this)()
        }
        this.canvas.addEventListener('pointerdown', this.drawOnClick1)
        this.mode = "line"
        break;
      case 'a':
        this.canvas.addEventListener('pointerdown', this.drawOnClick1)
        this.mode = "arc"
        break;
      case 'x':
        this.deleteSelected()
        break;
      case 'c':

        setCoincident.call(this)

        this.mode = ""
        break;

      case 'z':
        var string = JSON.stringify(this.toJSON());
        window.string = string;
        alert("Size of sample is: " + string.length);
        window.compressed = LZString.compress(string);
        alert("Size of compressed sample is: " + compressed.length);
        string = LZString.decompress(compressed);
        alert("Sample is: " + string);

        break;
    }
  }

  deleteSelected() {



    const toDelete = [...this.selected]
      .filter(e => e.type == 'Line')
      .sort((a, b) => b.id - a.id)
      .map(obj => {
        return this.delete(obj)
      })


    this.updatePointsBuffer(toDelete[toDelete.length - 1])
    this.updateOtherBuffers()

    this.selected = []
    this.obj3d.dispatchEvent({ type: 'change' })
  }

  delete(obj) {
    let link = this.linkedObjs.get(obj.userData.l_id)
    if (!link) return;
    link = link[1]

    let i = this.objIdx.get(link[0]) || this.updatePoint // hacky, see drawEvent.js for updatePoint def

    for (let j = 0; j < link.length; j++) {
      const obj = this.obj3d.children[i + j]
      obj.geometry.dispose()
      obj.material.dispose()

      for (let c_id of obj.userData.constraints) {
        this.deleteConstraints(c_id)
      }
    }

    this.obj3d.children.splice(i, link.length)

    this.linkedObjs.delete(obj.userData.l_id)

    return i
  }


  deleteConstraints(c_id) {
    for (let idx of this.constraints.get(c_id)[2]) { //////////
      if (idx == -1) continue
      const ob = this.obj3d.children[this.objIdx.get(idx)]
      if (ob) {
        // ob.constraints.delete(c_id)
        ob.userData.constraints.splice(ob.userData.constraints.indexOf(c_id), 1)
      }
    }
    this.constraints.delete(c_id)
  }

  updateOtherBuffers() {
    let i = 0
    for (let [key, obj] of this.constraints) {
      this.constraintsBuf.set(
        [
          this.constraintNum[obj[0]], obj[1],
          ...obj[2].map(ele => this.objIdx.get(ele) ?? -1),
        ],
        (i) * 6
      )
      i++
    }

    i = 0;
    for (let [key, obj] of this.linkedObjs) {
      this.linksBuf.set(
        [
          this.linkNum[obj[0]],
          ...obj[1].map(ele => this.objIdx.get(ele) ?? -1),
        ],
        (i) * 5
      )
      i++
    }

  }


  updatePointsBuffer(startingIdx = 0) {
    for (let i = startingIdx; i < this.obj3d.children.length; i++) {
      const obj = this.obj3d.children[i]
      this.objIdx.set(obj.name, i)
      if (obj.type == "Points") {
        this.ptsBuf.set(obj.geometry.attributes.position.array, 3 * i)
      }
    }
  }

  getLocation(e) {
    raycaster.setFromCamera(
      _vec2.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
      ),
      this.camera
    );

    raycaster.ray.intersectPlane(this.plane, _vec3).applyMatrix4(this.obj3d.inverse)

    return _vec3.toArray()
  }

  solve() {

    const pts_buffer =
      Module._malloc(this.ptsBuf.length * this.ptsBuf.BYTES_PER_ELEMENT)
    Module.HEAPF32.set(this.ptsBuf, pts_buffer >> 2)

    const constraints_buffer =
      Module._malloc(this.constraintsBuf.length * this.constraintsBuf.BYTES_PER_ELEMENT)
    Module.HEAPF32.set(this.constraintsBuf, constraints_buffer >> 2)

    const links_buffer =
      Module._malloc(this.linksBuf.length * this.linksBuf.BYTES_PER_ELEMENT)
    Module.HEAPF32.set(this.linksBuf, links_buffer >> 2)

    Module["_solver"](
      this.obj3d.children.length, pts_buffer,
      this.constraints.size, constraints_buffer,
      this.linkedObjs.size, links_buffer)

    /*
    - loop to update all the children that are points
    - we skip first triplet because it refers to a non-geometry child
    - we also sneak in updating lines children as well, by checking when ptsBuf[ptr] is NaN
    */

    for (let i = 1, ptr = (pts_buffer >> 2) + 3; i < this.obj3d.children.length; i += 1, ptr += 3) {
    // for (let i = 0, ptr = (pts_buffer >> 2) + 3; i < this.obj3d.children.length; i += 1, ptr += 3) {

      const pos = this.obj3d.children[i].geometry.attributes.position;
      if (isNaN(Module.HEAPF32[ptr])) {
        pos.array[0] = Module.HEAPF32[ptr - 6]
        pos.array[1] = Module.HEAPF32[ptr - 5]
        pos.array[3] = Module.HEAPF32[ptr - 3]
        pos.array[4] = Module.HEAPF32[ptr - 2]
      } else {
        pos.array[0] = Module.HEAPF32[ptr]
        pos.array[1] = Module.HEAPF32[ptr + 1]
      }

      pos.needsUpdate = true;
    }

    Module._free(pts_buffer)
    Module._free(links_buffer)
    Module._free(constraints_buffer)

    /*
      arcs were not updated in above loop, we go through all arcs linkedObjs 
      and updated based on the control pts (which were updated in loop above)
    */
    for (let [k, obj] of this.linkedObjs) {
      if (obj[0] != 'arc') continue;
      const [p1, p2, c, arc] = obj[1].map(e => this.obj3d.children[this.objIdx.get(e)])

      const points = get3PtArc(
        p1.geometry.attributes.position.array,
        p2.geometry.attributes.position.array,
        c.geometry.attributes.position.array
      );

      arc.geometry.attributes.position.set(points)
      arc.needsUpdate = true;
    }


    this.obj3d.dispatchEvent({ type: 'change' })
  }



}

const _m1 = new THREE.Matrix4()
const _q1 = new THREE.Quaternion()
const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();


Object.assign(Sketch.prototype,
  {
    linkNum: {
      'line': 0,
      'arc': 1
    },
    constraintNum: {
      'coincident': 0,
      'distance': 1
    },
    max_pts: 1000,
    max_links: 1000,
    max_constraints: 1000,
  }
)



export { Sketch }