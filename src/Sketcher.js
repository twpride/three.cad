
import { Matrix4 } from 'three';

import * as THREE from '../node_modules/three/src/Three'

export class Sketcher extends THREE.Group {
  constructor(camera, domElement, plane) {
    super()
    this.camera = camera;
    this.domElement = domElement;
    this.scene = scene;
    this.plane = plane;
    this.matrixAutoUpdate = false;
    this.sketchNormal = new THREE.Vector3(0, 0, 1)
    this.orientSketcher(plane)


    this.add(new THREE.PlaneHelper(this.plane, 1, 0xffff00));


    this.linesGroup = new THREE.Group()
    this.linesArr = this.linesGroup.children
    this.pointsGroup = new THREE.Group()
    this.ptsArr = this.pointsGroup.children
    this.add(this.linesGroup)
    this.add(this.pointsGroup)

    window.lg = this.linesArr
    window.pg = this.ptsArr

    this.pickThreshold = 100
    this.grabbedObject = null

    this.lineMaterial = new THREE.LineBasicMaterial({
      linewidth: 3,
      color: 0x555,
    })
    this.pointMaterial = new THREE.PointsMaterial({
      color: 0xAAA,
      size: 3,
    })

    this.pointStart = this.pointStart.bind(this);
    this.pointEnd = this.pointEnd.bind(this);
    this.move = this.move.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.picker = this.picker.bind(this);
    this.grabbedMove = this.grabbedMove.bind(this);
    this.grabEnd = this.grabEnd.bind(this);
    this.raycaster = new THREE.Raycaster();


    window.addEventListener('keydown', this.keyHandler)
    domElement.addEventListener('pointerdown', this.picker)


    this.mode = ""


  }

  orientSketcher() {

    const theta = this.sketchNormal.angleTo(this.plane.normal)
    const axis = this.sketchNormal.clone().cross(this.plane.normal).normalize()
    const rot = new THREE.Matrix4().makeRotationAxis(axis, theta)
    const trans = new THREE.Matrix4().makeTranslation(0, 0, this.plane.constant)

    this.matrix = rot.multiply(trans) // world matrix will auto update in next render
    this.inverse = this.matrix.clone().invert()

  }

  keyHandler(e) {
    switch (e.key) {
      case 'Escape':
        this.clear()
        this.mode = ""
        break;
      case 'l':
        this.addLine()
        this.mode = "line"
        break;
      case 'b':
        this.solve()
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


  picker(e) {
    if (this.mode || e.buttons != 1) return
    this.raycaster.setFromCamera(
      new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
      ),
      this.camera
    );

    // console.log(this.ptsArr)
    const candidates = this.raycaster.intersectObjects(this.ptsArr)
    // console.log(candidates)


    if (!candidates.length) return;

    let minDist = candidates[0].distanceToRay
    let idx = 0

    for (let i = 1; i < candidates.length; i++) {
      if (candidates.distanceToRay < minDist) {
        minDist = candidates.distanceToRay
        idx = i
      }
    }

    if (minDist < this.pickThreshold) {
      this.grabPtIdx = this.ptsArr.indexOf(
        candidates[idx].object
      )
    } else {
      return
    }

    this.domElement.addEventListener('pointermove', this.grabbedMove);
    this.domElement.addEventListener('pointerup', this.grabEnd);
  }

  grabbedMove(e) {
    const mouseLoc = this.getLocation(e);

    this.moveLinePt(this.grabPtIdx, mouseLoc)

    this.dispatchEvent({ type: 'change' })
  }

  moveLinePt(ptIdx, absPos) {
    this.ptsArr[ptIdx].geometry.attributes.position.set(absPos);
    this.solve()
    // this.ptsArr[ptIdx].geometry.attributes.position.needsUpdate = true;

    // const lineIdx = Math.floor(ptIdx / 2)
    // const endPtIdx = (ptIdx % 2) * 3
    // this.linesArr[lineIdx].geometry.attributes.position.set(absPos, endPtIdx)
    // this.linesArr[lineIdx].geometry.attributes.position.needsUpdate = true;
  }

  grabEnd() {
    this.domElement.removeEventListener('pointermove', this.grabbedMove)
    this.domElement.removeEventListener('pointerup', this.grabEnd)
    this.ptsArr[this.grabPtIdx].geometry.computeBoundingSphere()
    // this.grabbedObject = null
  }


  addLine() {
    this.domElement.addEventListener('pointerdown', this.pointStart)
  }

  clear() {
    if (this.mode == "") return

    this.domElement.removeEventListener('pointerdown', this.pointStart)
    this.domElement.removeEventListener('pointermove', this.move);
    this.domElement.removeEventListener('pointerdown', this.pointEnd);
    this.domElement.removeEventListener('pointerdown', this.pointEnd);

    const lastLine = this.linesArr[this.linesArr.length - 1]
    this.linesGroup.remove(lastLine)
    lastLine.geometry.dispose()

    const lastPoints = this.ptsArr.slice(this.ptsArr.length - 2)
    this.pointsGroup.remove(...lastPoints)
    lastPoints.forEach(obj => obj.geometry.dispose())

    this.dispatchEvent({ type: 'change' })
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

  pointStart(e) {
    if (e.buttons !== 1) return
    const mouseLoc = this.getLocation(e);

    this.lineGeom = new THREE.BufferGeometry()
    this.lineGeom.setAttribute('position',
      new THREE.BufferAttribute(
        new Float32Array(6), 3
      )
    );
    this.lineGeom.attributes.position.set(mouseLoc)
    this.line = new THREE.LineSegments(this.lineGeom, this.lineMaterial);
    this.line.frustumCulled = false;
    this.linesGroup.add(this.line)

    this.p1Geom = new THREE.BufferGeometry()
    this.p1Geom.setAttribute('position',
      new THREE.BufferAttribute(
        new Float32Array(3), 3
      )
    );
    this.p1Geom.attributes.position.set(mouseLoc)
    this.p1 = new THREE.Points(this.p1Geom, this.pointMaterial);
    this.pointsGroup.add(this.p1)

    this.p2Geom = new THREE.BufferGeometry()
    this.p2Geom.setAttribute('position',
      new THREE.BufferAttribute(
        new Float32Array(3), 3
      )
    );
    this.p2 = new THREE.Points(this.p2Geom, this.pointMaterial);
    this.pointsGroup.add(this.p2)

    this.domElement.removeEventListener('pointerdown', this.pointStart)
    this.domElement.addEventListener('pointermove', this.move)
    this.domElement.addEventListener('pointerdown', this.pointEnd)
  }


  move(e) {
    const mouseLoc = this.getLocation(e);
    this.lineGeom.attributes.position.set(mouseLoc, 3)

    this.lineGeom.attributes.position.needsUpdate = true;
    this.p2Geom.attributes.position.set(mouseLoc);
    this.p2Geom.attributes.position.needsUpdate = true;
    this.p2Geom.computeBoundingSphere();
    this.dispatchEvent({ type: 'change' })
  }

  pointEnd(e) {
    if (e.buttons !== 1) return;
    this.domElement.removeEventListener('pointermove', this.move);
    this.domElement.removeEventListener('pointerdown', this.pointEnd);


    this.pointStart(e)
  }

  solve() {
    let ptsBuf = new Float32Array(this.ptsArr.length * 2)
    for (let i = 0, p = 0; i < this.ptsArr.length; i++) {
      ptsBuf[p++] = this.ptsArr[i].geometry.attributes.position.array[0]
      ptsBuf[p++] = this.ptsArr[i].geometry.attributes.position.array[1]
    }


    buffer = Module._malloc(ptsBuf.length * ptsBuf.BYTES_PER_ELEMENT)
    Module.HEAPF32.set(ptsBuf, buffer >> 2)
    Module["_solver"](this.ptsArr.length / 2, buffer)


    let ptr = buffer >> 2;


    for (let i = 0; i < ptsBuf.length; i += 4) {
      const pt1_pos = this.ptsArr[i >> 1].geometry.attributes.position;
      const pt2_pos = this.ptsArr[(i >> 1) + 1].geometry.attributes.position;
      const line_pos = this.linesArr[i >> 2].geometry.attributes.position;

      pt1_pos.array[0] = Module.HEAPF32[ptr]
      line_pos.array[0] = Module.HEAPF32[ptr++]

      pt1_pos.array[1] = Module.HEAPF32[ptr]
      line_pos.array[1] = Module.HEAPF32[ptr++]

      pt2_pos.array[0] = Module.HEAPF32[ptr]
      line_pos.array[3] = Module.HEAPF32[ptr++]

      pt2_pos.array[1] = Module.HEAPF32[ptr]
      line_pos.array[4] = Module.HEAPF32[ptr++]

      pt1_pos.needsUpdate = true;
      pt2_pos.needsUpdate = true;
      line_pos.needsUpdate = true;
    }

    this.dispatchEvent({ type: 'change' })

    Module._free(buffer)
  }

}



