

import * as THREE from '../../node_modules/three/src/Three';

import { drawOnClick1, drawOnClick2, drawPreClick2, drawClear } from './drawEvents'
import { onHover, onDrag, onPick, onRelease } from './pickEvents'
import { addDimension, setCoincident } from './constraintEvents'
import { get3PtArc } from './sketchArc'
import { extrude } from './extrude'


const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 2,
  color: 0x555555,
})


const pointMaterial = new THREE.PointsMaterial({
  color: 0x555555,
  size: 4,
})

class Sketcher extends THREE.Group {
  constructor(camera, domElement, store) {
    super()
    this.camera = camera;
    this.domElement = domElement;
    this.matrixAutoUpdate = false;
    this.store = store;

    this.sub = new THREE.Group();
    this.add(this.sub);

    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.sketchNormal = new THREE.Vector3(0, 0, 1)


    const axesHelper = new THREE.AxesHelper(2);
    this.sub.add(axesHelper);




    // [0]:x, [1]:y, [2]:z
    this.objIdx = new Map()
    this.max_pts = 1000
    this.ptsBuf = new Float32Array(this.max_pts * 3).fill(NaN)

    // [0]:type, [1]:pt1, [2]:pt2, [3]:pt3, [4]:pt4
    this.linkedObjs = new Map()
    this.l_id = 0;
    this.max_links = 1000
    this.linksBuf = new Float32Array(this.max_links * 5).fill(NaN)
    this.linkNum = {
      'line': 0,
      'arc': 1
    }

    // [0]:type, [1]:val, [2]:pt1, [3]:pt2, [4]:lk1, [5]:lk2
    this.constraints = new Map()
    this.c_id = 0;
    this.max_constraints = 1000
    this.constraintsBuf = new Float32Array(this.max_constraints * 6).fill(NaN)
    this.contraintNum = {
      'coincident': 0,
      'distance': 1
    }


    this.drawOnClick1 = drawOnClick1.bind(this);
    this.drawPreClick2 = drawPreClick2.bind(this);
    this.drawOnClick2 = drawOnClick2.bind(this);

    this.onHover = onHover.bind(this);
    this.onPick = onPick.bind(this);
    this.onDrag = onDrag.bind(this);
    this.onRelease = onRelease.bind(this);

    this.onKeyPress = this.onKeyPress.bind(this);

    // window.addEventListener('keydown', this.onKeyPress)
    // domElement.addEventListener('pointerdown', this.onPick)
    // domElement.addEventListener('pointermove', this.onHover)

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 0.8;
    this.raycaster.params.Points.threshold = 1.5;
    this.selected = new Set()
    this.hovered = []

    this.mode = ""
    this.subsequent = false;
    this.target = new THREE.Vector3();
  }




  align(origin, x_dir, y_dir) {
    // this.updateWorldMatrix(true, false);

    const up = new THREE.Vector3().subVectors(y_dir, origin).normalize();

    const _m1 = new THREE.Matrix4()

    const te = _m1.elements;

    const _x = new THREE.Vector3().subVectors(x_dir, origin).normalize();

    const _z = new THREE.Vector3().crossVectors(_x, up).normalize();

    const _y = new THREE.Vector3().crossVectors(_z, _x);

    te[0] = _x.x; te[4] = _y.x; te[8] = _z.x;
    te[1] = _x.y; te[5] = _y.y; te[9] = _z.y;
    te[2] = _x.z; te[6] = _y.z; te[10] = _z.z;

    this.quaternion.setFromRotationMatrix(_m1);

    const parent = this.parent;
    _m1.extractRotation(parent.matrixWorld);
    const _q1 = new THREE.Quaternion().setFromRotationMatrix(_m1);
    this.quaternion.premultiply(_q1.invert());

    this.updateMatrix();
    this.matrix.setPosition(origin)

    this.plane.applyMatrix4(this.matrix)

    this.inverse = this.matrix.clone().invert()

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
        this.domElement.addEventListener('pointerdown', this.drawOnClick1)
        this.mode = "line"
        break;
      case 'a':
        this.domElement.addEventListener('pointerdown', this.drawOnClick1)
        this.mode = "arc"
        break;
      case 'x':
        this.deleteSelected()
        break;
      case 'c':

        setCoincident.call(this)

        this.mode = ""
        break;
      case 'e':
        extrude.call(this)
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
    let minI = this.children.length;

    for (let obj of this.selected) {
      minI = Math.min(minI, this.delete(obj))
    }

    // this.updatePointsBuffer(minI)
    this.updatePointsBuffer()
    this.updateOtherBuffers()

    this.selected.clear()
    this.dispatchEvent({ type: 'change' })
  }

  deleteConstraints(c_id) {
    for (let ob of this.constraints.get(c_id)[2]) {
      if (ob == -1) continue
      ob.constraints.delete(c_id)
    }
    this.constraints.delete(c_id)
  }

  updateOtherBuffers() {
    let i = 0
    for (let [key, obj] of this.constraints) {
      this.constraintsBuf.set(
        [
          this.contraintNum[obj[0]], obj[1],
          ...obj[2].map(ele => this.objIdx.get(ele.id) ?? -1),
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
          ...obj[1].map(ele => this.objIdx.get(ele.id) ?? -1),
        ],
        (i) * 5
      )
      i++
    }

  }

  delete(obj) {
    let link = this.linkedObjs.get(obj.l_id)
    if (!link) return Infinity;
    link = link[1]

    let i = this.children.indexOf(link[0])

    for (let j = 0; j < link.length; j++) {
      const obj = this.children[i + j]
      obj.geometry.dispose()
      obj.material.dispose()

      for (let c_id of obj.constraints) {
        this.deleteConstraints(c_id)
      }
    }

    this.children.splice(i, link.length)

    this.linkedObjs.delete(obj.l_id)

    return i
  }

  updatePointsBuffer(startingIdx = 0) {
    for (let i = startingIdx; i < this.children.length; i++) {
      const obj = this.children[i]
      this.objIdx.set(obj.id, i)
      if (obj.type == "Points") {
        this.ptsBuf.set(obj.geometry.attributes.position.array, 3 * i)
      }
    }
  }


  getLocation(e) {
    this.raycaster.setFromCamera(
      new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
      ),
      this.camera
    );

    this.raycaster.ray.intersectPlane(this.plane, this.target).applyMatrix4(this.inverse)

    return this.target.toArray()
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
      this.children.length, pts_buffer,
      this.constraints.size, constraints_buffer,
      this.linkedObjs.size, links_buffer)

    /*
    - loop to update all the children that are points
    - we skip first triplet because it refers to a non-geometry child
    - we also sneak in updating lines children as well, by checking when ptsBuf[ptr] is NaN
    */

    for (let i = 1, ptr = (pts_buffer >> 2) + 3; i < this.children.length; i += 1, ptr += 3) {

      const pos = this.children[i].geometry.attributes.position;
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
      const [p1, p2, c, arc] = obj[1]

      const points = get3PtArc(
        p1.geometry.attributes.position.array,
        p2.geometry.attributes.position.array,
        c.geometry.attributes.position.array
      );

      arc.geometry.attributes.position.set(points)
      arc.needsUpdate = true;
    }


    this.dispatchEvent({ type: 'change' })
  }

}




export { Sketcher, lineMaterial, pointMaterial }