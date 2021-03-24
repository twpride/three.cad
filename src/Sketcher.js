
import { Matrix4 } from 'three';

import * as THREE from '../node_modules/three/src/Three'

const factor = Math.tan(Math.PI / 3)

function get2PtArc(p1, p2, divisions = 36) {

  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const dist = Math.sqrt(dx ** 2 + dy ** 2)
  const midAngle = (Math.atan2(dy, dx) - Math.PI / 2) % (2 * Math.PI)
  let a1 = midAngle - Math.PI / 6
  let a2 = midAngle + Math.PI / 6

  a1 = a1 < 0 ? a1 + 2 * Math.PI : a1
  a2 = a2 < 0 ? a2 + 2 * Math.PI : a1
  const cx = (p1[0] + p2[0] - dy * factor) / 2
  const cy = (p1[1] + p2[1] + dx * factor) / 2

  const radius = dist
  const deltaAngle = Math.PI / 3
  let points = new Float32Array((divisions + 1) * 3)

  for (let d = 0; d <= divisions; d++) {
    const angle = a1 + (d / divisions) * deltaAngle;
    points[3 * d] = cx + radius * Math.cos(angle);
    points[3 * d + 1] = cy + radius * Math.sin(angle);
  }
  return [points, [cx, cy]];
}


function get3PtArc(p1, p2, c, divisions = 36) {

  const v1 = [p1[0] - c[0], p1[1] - c[1]]
  const v2 = [p2[0] - c[0], p2[1] - c[1]]

  let a1 = Math.atan2(v1[1], v1[0])
  let a2 = Math.atan2(v2[1], v2[0])

  const radius = Math.sqrt(v1[0] ** 2 + v1[1] ** 2)

  const deltaAngle = a2 - a1

  let points = new Float32Array((divisions + 1) * 3)

  for (let d = 0; d <= divisions; d++) {
    const angle = a1 + (d / divisions) * deltaAngle;
    points[3 * d] = c[0] + radius * Math.cos(angle);
    points[3 * d + 1] = c[1] + radius * Math.sin(angle);
  }
  return points;
}


export class Sketcher extends THREE.Group {
  constructor(camera, domElement, plane) {
    super()
    this.camera = camera;
    this.domElement = domElement;
    this.plane = plane;
    this.matrixAutoUpdate = false;
    this.sketchNormal = new THREE.Vector3(0, 0, 1)
    this.orientSketcher(plane)

    this.add(new THREE.PlaneHelper(this.plane, 1, 0xffff00));

    this.colorPt = new THREE.Color('white')
    this.selected = new Set()

    this.geomGroup = new THREE.Group();
    scene.add(this.geomGroup);

    this.lineMaterial = new THREE.LineBasicMaterial({
      linewidth: 3,
      color: 0x555555,
    })
    this.pointMaterial = new THREE.PointsMaterial({
      color: 0x555555,
      size: 3,
    })


    this.onKeyPress = this.onKeyPress.bind(this);

    this.onClick_1 = this.onClick_1.bind(this);
    this.onClick_2 = this.onClick_2.bind(this);
    this.beforeClick_2 = this.beforeClick_2.bind(this);
    this.beforeClick_3 = this.beforeClick_3.bind(this);
    this.onPick = this.onPick.bind(this);
    this.onHover = this.onHover.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onRelease = this.onRelease.bind(this);

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 0.4;
    this.raycaster.params.Points.threshold = 0.2;


    window.addEventListener('keydown', this.onKeyPress)
    domElement.addEventListener('pointerdown', this.onPick)
    domElement.addEventListener('pointermove', this.onHover)


    this.mode = ""

    this.linkedObjs = new Map()
    this.l_id = 0;

    this.constraints = new Map()
    this.c_id = 0;

    this.objIdx = new Map()

    this.max_pts = 1000
    this.ptsBuf = new Float32Array(this.max_pts * 2).fill(NaN)

    this.max_links = 1000
    this.linksBuf = new Float32Array(this.max_links * 5).fill(NaN) // [0]:type, [1]:pt1, [2]:pt2, [3]:pt3, [4]:pt4

    this.max_constraints = 1000
    this.constraintsBuf = new Float32Array(this.max_constraints * 6).fill(NaN) // [0]:type, [1]:val, [2]:pt1, [3]:pt2, [4]:lk1, [5]:lk2

    this.subsequent = false;
    this.ptsBufPt = 0;
    this.endBufPt = 0;

    this.linkNum = {
      'line': 0,
      'arc': 1
    }

    this.contraintNum = {
      'coincident': 0,
      'parallel': 1
    }
  }

  orientSketcher() {

    const theta = this.sketchNormal.angleTo(this.plane.normal)
    const axis = this.sketchNormal.clone().cross(this.plane.normal).normalize()
    const rot = new THREE.Matrix4().makeRotationAxis(axis, theta)
    const trans = new THREE.Matrix4().makeTranslation(0, 0, this.plane.constant)

    this.matrix = rot.multiply(trans) // world matrix will auto update in next render
    this.inverse = this.matrix.clone().invert()

  }

  onKeyPress(e) {
    switch (e.key) {
      case 'Escape':
        this.clear()
        this.mode = ""
        break;
      case 'l':
        if (this.mode == 'line') {
          this.clear()
        }
        this.domElement.addEventListener('pointerdown', this.onClick_1)
        this.mode = "line"
        break;
      case 'a':
        this.domElement.addEventListener('pointerdown', this.onClick_1)
        this.mode = "arc"
        break;
      case 'd':
        this.deleteSelected()
        break;
      case '=':
        this.plane.applyMatrix4(new Matrix4().makeRotationY(0.1))
        this.orientSketcher()
        this.dispatchEvent({ type: 'change' })
        break;
      case '-':
        this.plane.applyMatrix4(new Matrix4().makeRotationY(-0.1))
        this.orientSketcher()
        this.dispatchEvent({ type: 'change' })
        break;
    }
  }


  onHover(e) {
    if (this.mode || e.buttons) return

    if (this.hovered && !this.selected.has(this.hovered)) {
      this.hovered.material.color.set(0x555555)
    }

    this.raycaster.setFromCamera(
      new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
      ),
      this.camera
    );

    const hoverPts = this.raycaster.intersectObjects(this.geomGroup.children)

    if (hoverPts.length) {
      let minDist = Infinity;
      let idx = 0
      for (let i = 0; i < hoverPts.length; i++) {
        if (hoverPts[i].distanceToRay && hoverPts[i].distanceToRay <= minDist) {
          minDist = hoverPts[i].distanceToRay
          idx = i
        }
      }

      hoverPts[idx].object.material.color.set(0xff0000)
      this.hovered = hoverPts[idx].object
      this.dispatchEvent({ type: 'change' })
      return
    }


    if (this.hovered) {
      this.hovered = null;
      this.dispatchEvent({ type: 'change' })
    }

  }



  onPick(e) {
    if (this.mode || e.buttons != 1) return

    if (this.hovered) {
      this.selected.add(this.hovered)
      if (this.hovered.type === "Points") {
        this.grabPtIdx = this.geomGroup.children.indexOf(
          this.hovered
        )
        this.domElement.addEventListener('pointermove', this.onDrag);
        this.domElement.addEventListener('pointerup', this.onRelease)
      }
    } else {
      for (let obj of this.selected) {
        obj.material.color.set(0x555555)
      }
      this.dispatchEvent({ type: 'change' })
      this.selected.clear()
    }
  }

  onDrag(e) {
    const mouseLoc = this.getLocation(e);
    this.geomGroup.children[this.grabPtIdx].geometry.attributes.position.set(mouseLoc);
    this.updatePointsBuffer()
    this.solve()
    // console.log(this.geomGroup.children[this.grabPtIdx].geometry.attributes.position.array)
    // this.geomGroup.children[this.grabPtIdx].geometry.attributes.position.needsUpdate = true;
    this.dispatchEvent({ type: 'change' })
  }


  onRelease() {
    this.domElement.removeEventListener('pointermove', this.onDrag)
    this.domElement.removeEventListener('pointerup', this.onRelease)
    this.geomGroup.children[this.grabPtIdx].geometry.computeBoundingSphere()
    // this.grabbedObject = null
  }



  deleteSelected() {
    let minI = this.geomGroup.children.length;

    for (let obj of this.selected) {
      minI = Math.min(minI, this.delete(obj))

    }

    this.updatePointsBuffer(minI)
    this.updateOtherBuffers()

    this.selected.clear()
    this.dispatchEvent({ type: 'change' })
  }

  deleteConstraints(c_id) {
    for (let ob of this.constraints.get(c_id)[0]) {
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
          this.contraintNum[obj[1]], obj[2],
          ...obj[0].map(ele => this.objIdx.get(ele.id) || -1),
        ],
        (i) * 6
      )
      i++
    }

    i = 0;
    for (let [key, obj] of this.linkedObjs) {
      this.linksBuf.set(
        [
          this.linkNum[obj[1]],
          ...obj[0].map(ele => this.objIdx.get(ele.id) ?? -1),
        ],
        (i) * 5
      )
      i++
    }

  }

  delete(obj) {

    const link = this.linkedObjs.get(obj.l_id)

    let i = this.geomGroup.children.indexOf(link[0][0])
    if (i == -1) return Infinity

    for (let j = 0; j < link[0].length; j++) {
      const obj = this.geomGroup.children[i + j]
      obj.geometry.dispose()
      obj.material.dispose()

      for (let c_id of obj.constraints) {
        this.deleteConstraints(c_id)
      }
    }

    this.geomGroup.children.splice(i, link[0].length)

    this.linkedObjs.delete(obj.l_id)

    return i
  }

  updatePointsBuffer(startingIdx = 0) {
    for (let i = startingIdx; i < this.geomGroup.children.length; i++) {
      const obj = this.geomGroup.children[i]
      this.objIdx.set(obj.id, i)
      if (obj.type == "Points") {
        this.ptsBuf[2 * i] = obj.geometry.attributes.position.array[0]
        this.ptsBuf[2 * i + 1] = obj.geometry.attributes.position.array[1]
      }
    }
  }


  clear() {
    if (this.mode == "") return

    if (this.mode == "line") {
      this.domElement.removeEventListener('pointerdown', this.onClick_1)
      this.domElement.removeEventListener('pointermove', this.beforeClick_2);
      this.domElement.removeEventListener('pointerdown', this.onClick_2);

      this.delete(this.geomGroup.children[this.geomGroup.children.length - 1])

      this.dispatchEvent({ type: 'change' })
      this.subsequent = false
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
    // return this.worldToLocal(this.raycaster.ray.intersectPlane(this.plane)).toArray()
    return this.raycaster.ray.intersectPlane(this.plane).applyMatrix4(this.inverse).toArray()
  }

  onClick_1(e) {
    if (e.buttons !== 1) return
    const mouseLoc = this.getLocation(e);

    this.p1Geom = new THREE.BufferGeometry().setAttribute('position',
      new THREE.BufferAttribute(new Float32Array(mouseLoc), 3)
    )
    this.p1 = new THREE.Points(this.p1Geom,
      new THREE.PointsMaterial().copy(this.pointMaterial)
    );
    this.p1.matrixAutoUpdate = false;
    this.p1.constraints = new Set()

    this.p2Geom = new THREE.BufferGeometry().setAttribute('position',
      new THREE.BufferAttribute(new Float32Array(3), 3)
    )
    this.p2 = new THREE.Points(
      this.p2Geom,
      new THREE.PointsMaterial().copy(this.pointMaterial)
    );
    this.p2.matrixAutoUpdate = false;
    this.p2.constraints = new Set()

    let toPush;

    if (this.mode == "line") {
      this.lineGeom = new THREE.BufferGeometry().setAttribute('position',
        new THREE.BufferAttribute(new Float32Array(6), 3)
      );
      this.lineGeom.attributes.position.set(mouseLoc)
      this.line = new THREE.Line(this.lineGeom,
        new THREE.LineBasicMaterial().copy(this.lineMaterial)
      );
      this.line.constraints = new Set()
      this.line.frustumCulled = false;

      toPush = [this.p1, this.p2, this.line];

      if (this.subsequent) {

        this.constraints.set(this.c_id,
          [
            [this.geomGroup.children[this.geomGroup.children.length - 2], this.p1, -1, -1],
            'coincident', -1
          ]
        )

        this.p1.constraints.add(this.c_id)
        this.geomGroup.children[this.geomGroup.children.length - 2].constraints.add(this.c_id)
        this.c_id += 1
      }

    } else if (this.mode == "arc") {

      this.arcGeom = new THREE.BufferGeometry().setAttribute('position',
        new THREE.BufferAttribute(new Float32Array(3 * 37), 3)
      )

      this.arc = new THREE.Line(this.arcGeom,
        new THREE.LineBasicMaterial().copy(this.lineMaterial)
      );
      this.arc.frustumCulled = false;

      this.p3Geom = new THREE.BufferGeometry().setAttribute('position',
        new THREE.BufferAttribute(new Float32Array(3), 3)
      )
      this.p3 = new THREE.Points(this.p3Geom,
        new THREE.PointsMaterial().copy(this.pointMaterial)
      );

      toPush = [this.p1, this.p2, this.p3, this.arc]
    }


    this.updatePoint = this.geomGroup.children.length
    this.geomGroup.add(...toPush)

    this.linkedObjs.set(this.l_id, [toPush, this.mode])

    for (let obj of toPush) {
      obj.l_id = this.l_id
    }
    this.l_id += 1


    this.domElement.removeEventListener('pointerdown', this.onClick_1)
    this.domElement.addEventListener('pointermove', this.beforeClick_2)
    this.domElement.addEventListener('pointerdown', this.onClick_2)
  }


  beforeClick_2(e) {
    const mouseLoc = this.getLocation(e);

    this.p2Geom.attributes.position.set(mouseLoc);
    this.p2Geom.attributes.position.needsUpdate = true;
    this.p2Geom.computeBoundingSphere()

    if (this.mode == "line") {
      this.lineGeom.attributes.position.set(mouseLoc, 3)
      this.lineGeom.attributes.position.needsUpdate = true;
    } else if (this.mode == 'arc') {
      const [points, center] = get2PtArc(
        this.p1Geom.attributes.position.array,
        this.p2Geom.attributes.position.array
      )
      this.arcGeom.attributes.position.set(
        points
      );
      this.arcGeom.attributes.position.needsUpdate = true;
      this.p3Geom.attributes.position.set(center);
      this.p3Geom.attributes.position.needsUpdate = true;
      this.p3Geom.computeBoundingSphere()

    }

    this.dispatchEvent({ type: 'change' })
  }

  onClick_2(e) {
    if (e.buttons !== 1) return;
    this.domElement.removeEventListener('pointermove', this.beforeClick_2);
    this.domElement.removeEventListener('pointerdown', this.onClick_2);


    if (this.mode == "line") {


      this.updatePointsBuffer(this.updatePoint)
      this.updateOtherBuffers()


      this.subsequent = true
      this.onClick_1(e)
    } else if (this.mode == "arc") {
      // this.domElement.addEventListener('pointermove', this.beforeClick_3)
    }
  }

  beforeClick_3(e) {
    const mouseLoc = this.getLocation(e);
    this.p3Geom.attributes.position.set(mouseLoc);
    this.p3Geom.attributes.position.needsUpdate = true;
    this.p3Geom.computeBoundingSphere()
  }


  solve() {

    for (let i = 0, p = 0; i < this.geomGroup.children.length; i++) {
      if (this.geomGroup.children[i].type == "Points") {
        this.ptsBuf[2 * i] = this.geomGroup.children[i].geometry.attributes.position.array[0]
        this.ptsBuf[2 * i + 1] = this.geomGroup.children[i].geometry.attributes.position.array[1]
      }
    }

    const pts_buffer = Module._malloc(this.ptsBuf.length * this.ptsBuf.BYTES_PER_ELEMENT)
    Module.HEAPF32.set(this.ptsBuf, pts_buffer >> 2)

    const constraints_buffer = Module._malloc(this.constraintsBuf.length * this.constraintsBuf.BYTES_PER_ELEMENT)
    Module.HEAPF32.set(this.constraintsBuf, constraints_buffer >> 2)

    const links_buffer = Module._malloc(this.linksBuf.length * this.linksBuf.BYTES_PER_ELEMENT)
    Module.HEAPF32.set(this.linksBuf, links_buffer >> 2)

    Module["_solver"](this.geomGroup.children.length, pts_buffer, this.constraints.size, constraints_buffer, this.linkedObjs.size, links_buffer)

    let ptr = pts_buffer >> 2;


    for (let i = 0; i < this.geomGroup.children.length; i += 1) {

      const pos = this.geomGroup.children[i].geometry.attributes.position;
      // console.log(pos.array)
      if (isNaN(Module.HEAPF32[ptr])) {
        pos.array[0] = Module.HEAPF32[ptr - 4]
        pos.array[1] = Module.HEAPF32[ptr - 3]
        pos.array[3] = Module.HEAPF32[ptr - 2]
        pos.array[4] = Module.HEAPF32[ptr - 1]
      } else {
        pos.array[0] = Module.HEAPF32[ptr]
        pos.array[1] = Module.HEAPF32[ptr + 1]
      }
      ptr += 2;

      pos.needsUpdate = true;
    }

    this.dispatchEvent({ type: 'change' })

    Module._free(pts_buffer)
  }

}



