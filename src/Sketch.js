

import * as THREE from '../node_modules/three/src/Three';

import { _vec2, _vec3, raycaster, awaitSelection, ptObj, setHover } from './shared'

import { drawOnClick1, drawOnClick2, drawPreClick2, drawOnClick3, drawPreClick3, drawClear, drawPoint } from './drawEvents'
import { onHover, onDrag, onPick, onRelease } from './mouseEvents'
import { setCoincident, setOrdinate, setTangent } from './constraintEvents'
import { get3PtArc } from './drawArc'
import { replacer, reviver } from './utils'
import { AxesHelper } from './sketchAxes'
import { drawDimension, _onMoveDimension, setDimLines, updateDim } from './drawDimension';



class Sketch {


  constructor(scene, preload) {


    // [0]:x, [1]:y, [2]:z
    this.ptsBuf = new Float32Array(this.max_pts * 3).fill(NaN)

    // [0]:type, [1]:pt1, [2]:pt2, [3]:pt3, [4]:pt4
    this.linksBuf = new Float32Array(this.max_links * 5).fill(NaN)

    // [0]:type, [1]:val, [2]:pt1, [3]:pt2, [4]:lk1, [5]:lk2
    this.constraintsBuf = new Float32Array(this.max_constraints * 6).fill(NaN)


    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    this.labelContainer = document.getElementById('labels')

    if (preload === undefined) {

      this.obj3d = new THREE.Group()
      this.obj3d.name = "s" + scene.sid++
      this.obj3d.userData.type = "sketch"
      this.obj3d.matrixAutoUpdate = false;

      this.objIdx = new Map()

      this.linkedObjs = new Map()
      this.l_id = 0;

      this.constraints = new Map()
      this.c_id = 1;

      this.obj3d.add(new THREE.Group());

      this.geomStartIdx = this.obj3d.children.length
      this.obj3d.userData.geomStartIdx = this.geomStartIdx
      this.dimGroup = this.obj3d.children[this.geomStartIdx - 1]

      this.labels = []


      const p1 = ptObj()
      p1.matrixAutoUpdate = false;
      p1.userData.constraints = []
      this.obj3d.add(p1)
      this.updatePointsBuffer()





    } else {


      this.obj3d = preload.obj3d
      this.obj3d.inverse = preload.obj3d.matrix.clone().invert()

      this.objIdx = JSON.parse(preload.objIdx, reviver)

      this.linkedObjs = JSON.parse(preload.linkedObjs, reviver)
      this.l_id = preload.l_id;

      this.constraints = JSON.parse(preload.constraints, reviver)
      this.c_id = preload.c_id;

      this.geomStartIdx = this.obj3d.userData.geomStartIdx
      this.dimGroup = this.obj3d.children[this.geomStartIdx - 1]

      this.updatePointsBuffer()
      this.updateOtherBuffers()

      this.plane.applyMatrix4(this.obj3d.matrix)
    }


    this.scene = scene;
    this.camera = scene.camera
    this.canvas = scene.canvas
    this.rect = scene.rect
    this.store = scene.store;






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

    this.drawPreClick3 = drawPreClick3.bind(this);
    this.drawOnClick3 = drawOnClick3.bind(this);

    this.drawDimension = drawDimension.bind(this)
    this._onMoveDimension = _onMoveDimension.bind(this)
    this.setDimLines = setDimLines.bind(this)
    this.updateDim = updateDim.bind(this)

    this.awaitSelection = awaitSelection.bind(this);

    this.onHover = onHover.bind(this);
    this.onPick = onPick.bind(this);
    this.onDrag = onDrag.bind(this);
    this.onRelease = onRelease.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.setHover = setHover.bind(this);

  }


  activate() {
    console.log('activatee')
    window.addEventListener('keydown', this.onKeyPress)
    this.canvas.addEventListener('pointerdown', this.onPick)
    this.canvas.addEventListener('pointermove', this.onHover)
    this.store.dispatch({ type: 'set-active-sketch', activeSketchId: this.obj3d.name })

    this.setDimLines()

    this.obj3d.traverse(e => e.layers.enable(2))
    this.obj3d.visible = true
    this.scene.axes.matrix = this.obj3d.matrix
    this.scene.axes.visible = true
    this.scene.activeSketch = this

    window.sketcher = this
  }

  deactivate() {
    window.removeEventListener('keydown', this.onKeyPress)
    this.canvas.removeEventListener('pointerdown', this.onPick)
    this.canvas.removeEventListener('pointermove', this.onHover)
    this.store.dispatch({ type: 'finish-sketch' })
    this.labelContainer.innerHTML = ""
    this.obj3d.visible = false
    this.obj3d.traverse(e => e.layers.disable(2))
    this.scene.axes.visible = false
    this.scene.activeSketch = null
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
    this.command(e.key)
  }

  command(key) {

    switch (key) {
      case 'Escape':
        drawClear.call(this)
        document.activeElement.blur()
        break;
      case 'l':
        if (this.mode == 'line') {
          drawClear.call(this)
        }
        this.mode = "line"
        this.canvas.addEventListener('pointerdown', this.drawOnClick1, { once: true })
        break;
      case 'a':
        this.mode = "arc"
        this.canvas.addEventListener('pointerdown', this.drawOnClick1, { once: true })
        break;
      case 'p':
        this.mode = "point"
        this.canvas.addEventListener('pointerdown', this.drawOnClick1, { once: true })
        break;
      case 'd':
        drawClear.call(this)
        this.drawDimension()
        break;
      case 'c':
        drawClear.call(this)
        setCoincident.call(this)
        break;
      case 'v':
        drawClear.call(this)
        setOrdinate.call(this, 0)
        break;
      case 'h':
        drawClear.call(this)
        setOrdinate.call(this, 1)
        break;
      case 't':
        drawClear.call(this)
        setTangent.call(this)
        break;
      case 'Delete':
        this.deleteSelected()
        break;
      case 'Backspace':
        this.deleteSelected()
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

    this.selected
      .filter(e => e.userData.type == 'dimension')
      .forEach(e => this.constraints.has(e.name) && this.deleteConstraints(e.name))

    const toDelete = this.selected
      .filter(e => e.userData.type == 'line')
      .sort((a, b) => b.id - a.id)
      .map(obj => {
        return this.delete(obj)
      })

    if (toDelete.length) {
      this.updatePointsBuffer(toDelete[toDelete.length - 1])
    }

    this.updateOtherBuffers()

    this.selected = []
    this.scene.render()
  }

  delete(obj) {
    if (!obj) return
    if (obj.userData.type == 'dimension') {
      this.deleteConstraints(obj.name)
      return
    }

    let link = this.linkedObjs.get(obj.userData.l_id)
    if (!link) return;
    link = link[1]

    let i = this.objIdx.get(link[0]) || this.updatePoint // hacky, see drawEvent.js for updatePoint def

    for (let j = 0; j < link.length; j++) {
      const obj = this.obj3d.children[i + j]
      // obj.geometry.dispose()
      // obj.material.dispose()

      obj.traverse((ob) => {
        if (ob.geometry) ob.geometry.dispose()
        if (ob.material) ob.material.dispose()
      })

      // collect all coincident constraints to be reconnected
      // after deleting this point
      let arr = []  
      let cons
      for (let c_id of obj.userData.constraints.slice()) { 
        // i hate js, slice is important because deleteContraints mutates constraints array
        cons = this.constraints.get(c_id)
        if (cons[0] == 'points_coincident') {
          arr.push(cons[2][0] == obj.name ?
            cons[2][1] : cons[2][0]
          )
        }
        this.deleteConstraints(c_id)
      }

      for (let i = 0; i < arr.length - 1; i++) {
        setCoincident.call(this,[
          this.obj3d.children[this.objIdx.get(arr[i])],
          this.obj3d.children[this.objIdx.get(arr[i+1])]
        ])
      }

      obj.userData.constraints = []
    }

    this.obj3d.children.splice(i, link.length)

    this.linkedObjs.delete(obj.userData.l_id)

    return i
  }


  deleteConstraints(c_id) {
    for (let idx of this.constraints.get(c_id)[2]) { // clean on contraint references
      if (idx == -1) continue
      const ob = this.obj3d.children[this.objIdx.get(idx)]
      if (ob) {
        ob.userData.constraints.splice(ob.userData.constraints.indexOf(c_id), 1)
      }
    }
    this.constraints.delete(c_id)

    for (let i = 0; i < this.dimGroup.children.length; i++) {
      if (this.dimGroup.children[i].name == c_id) {
        this.dimGroup.children.splice(i, i + 2).forEach(
          e => {
            if (e.label) e.label.remove()
            e.geometry.dispose()
            e.material.dispose()
          }
        )
        break
      }
    }
  }

  updateOtherBuffers() {
    let i = 0
    for (let [key, obj] of this.constraints) {
      this.constraintsBuf.set(
        [
          this.constraintNum[obj[0]], obj[1],
          ...obj[2].map(ele => this.objIdx.get(ele) ?? 0),
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


  updateBoundingSpheres() {

    for (let x = this.geomStartIdx; x < this.obj3d.children.length; x++) { // geometry boundign spheres
      const obj = this.obj3d.children[x]
      obj.geometry.computeBoundingSphere()
    }

    for (let x = 0; x < this.dimGroup.children.length; x++) { // dimension bounding sphere
      const obj = this.dimGroup.children[x]
      obj.geometry.computeBoundingSphere()
    }
  }
  getLocation(e) {

    raycaster.setFromCamera(
      _vec2.set(
        (e.clientX - this.rect.left) / this.rect.width * 2 - 1,
        - (e.clientY - this.rect.top) / this.rect.height * 2 + 1
      ),
      this.camera
    );


    raycaster.ray.intersectPlane(this.plane, _vec3).applyMatrix4(this.obj3d.inverse)

    return _vec3
  }

  getScreenXY(arr) {
    return _vec3.set(...arr).applyMatrix4(this.obj3d.matrix).project(this.camera)
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
      this.linkedObjs.size, links_buffer,
      this.geomStartIdx
    )

    /*
      - loop to update all the children that are points
      - we also sneak in updating lines children as well, by checking when ptsBuf[ptr] is NaN
    */

    for (let i = this.geomStartIdx, ptr = (pts_buffer >> 2) + this.geomStartIdx * 3; i < this.obj3d.children.length; i += 1, ptr += 3) {

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

      let points

      points = get3PtArc(
        p1.geometry.attributes.position.array,
        p2.geometry.attributes.position.array,
        c.geometry.attributes.position.array
      );

      arc.geometry.attributes.position.set(points)
      arc.needsUpdate = true;
    }

    this.setDimLines()
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
      points_coincident: 0,
      pt_pt_distance: 1,
      pt_plane_distance: 2,
      pt_line_distance: 3,
      pt_face_distance: 4,
      pt_in_plane: 5,
      pt_on_line: 6,
      pt_on_face: 7,
      equal_length_lines: 8,
      length_ratio: 9,
      eq_len_pt_line_d: 10,
      eq_pt_ln_distances: 11,
      equal_angle: 12,
      equal_line_arc_len: 13,
      symmetric: 14,
      symmetric_horiz: 15,
      symmetric_vert: 16,
      symmetric_line: 17,
      at_midpoint: 18,
      horizontal: 19,
      vertical: 20,
      diameter: 21,
      pt_on_circle: 22,
      same_orientation: 23,
      angle: 24,
      parallel: 25,
      perpendicular: 26,
      arc_line_tangent: 27,
      cubic_line_tangent: 28,
      equal_radius: 29,
      proj_pt_distance: 30,
      where_dragged: 31,
      curve_curve_tangent: 32,
      length_difference: 33,
    },
    max_pts: 1000,
    max_links: 1000,
    max_constraints: 1000,
  }
)



export { Sketch }


