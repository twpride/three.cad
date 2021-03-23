
import { Matrix4 } from 'three';

import * as THREE from '../node_modules/three/src/Three'

const factor = Math.tan(Math.PI / 3)

function get2PtArc(p1, p2, divisions = 36) {

  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const dist = Math.sqrt(dx ** 2 + dy ** 2)
  const angle = (Math.atan2(dy, dx) - Math.PI / 2) % (2 * Math.PI)
  let a1 = angle - Math.PI / 6
  let a2 = angle + Math.PI / 6

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

    this.pointsGroup = new THREE.Group() //0
    this.add(this.pointsGroup)

    this.arcPtsGroup = new THREE.Group() //1
    this.add(this.arcPtsGroup)

    this.linesGroup = new THREE.Group() //2
    this.add(this.linesGroup)

    this.arcsGroup = new THREE.Group() //3
    this.add(this.arcsGroup)

    this.geom = [
      this.pointsGroup.children,
      this.arcPtsGroup.children,
      this.linesGroup.children,
      this.arcsGroup.children
    ]

    this.ptsArr = this.pointsGroup.children
    this.arcPtsArr = this.arcPtsGroup.children
    this.linesArr = this.linesGroup.children
    this.arcsArr = this.arcsGroup.children




    window.lg = this.linesArr
    window.pg = this.ptsArr

    this.colorPt = new THREE.Color('white')
    this.selected = new Set()


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

    this.pickThreshold = 0.1

    window.addEventListener('keydown', this.onKeyPress)
    domElement.addEventListener('pointerdown', this.onPick)
    domElement.addEventListener('pointermove', this.onHover)


    this.mode = ""

    this.constraints = {}

    this.max_lines = 1000
    this.ptsBuf = new Float32Array(this.max_lines * 2)

    this.max_arcs = 1000
    this.arcBuf = new Float32Array(this.max_arcs * 2 * 3)

    this.max_constraints = 1000
    this.contraintsBuf = new Int32Array(this.max_constraints * 5)
    this.contraintsValBuf = new Float32Array(this.max_constraints)

    this.subsequent = false;
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
        this.domElement.addEventListener('pointerdown', this.onClick_1)
        this.mode = "line"
        break;
      case 'a':
        this.domElement.addEventListener('pointerdown', this.onClick_1)
        this.mode = "arc"
        break;
      case 'd':
        this.delete()
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
    const hoverPts = this.raycaster.intersectObjects(this.ptsArr)
    // const hoverPts = this.raycaster.intersectObjects(this.arcPtsArr)

    if (hoverPts.length) {
      let minDist = hoverPts[0].distanceToRay
      let idx = 0

      for (let i = 1; i < hoverPts.length; i++) {
        if (hoverPts[i].distanceToRay <= minDist) {
          minDist = hoverPts[i].distanceToRay
          idx = i
        }
      }

      hoverPts[idx].object.material.color.set(0xff0000)
      this.hovered = hoverPts[idx].object
      this.dispatchEvent({ type: 'change' })
      return
    }

    // const hoverLines = this.raycaster.intersectObjects(this.linesArr)
    // if (hoverLines.length) {
    //   hoverLines[0].object.material.color.set(0xff0000)
    //   this.hovered = hoverLines[0].object
    //   this.dispatchEvent({ type: 'change' })
    //   return
    // }

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
        this.grabPtIdx = this.ptsArr.indexOf(
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
    this.ptsArr[this.grabPtIdx].geometry.attributes.position.set(mouseLoc);
    this.solve()
    this.dispatchEvent({ type: 'change' })
  }


  onRelease() {
    this.domElement.removeEventListener('pointermove', this.onDrag)
    this.domElement.removeEventListener('pointerup', this.onRelease)
    this.ptsArr[this.grabPtIdx].geometry.computeBoundingSphere()
    // this.grabbedObject = null
  }



  delete() {
    const deleteArr = []
    for (let obj of this.selected) {
      const idx = obj.parent.children.indexOf(obj)
      if (obj.parent == this.linesGroup) {
        deleteArr.push([2, idx])
        deleteArr.push([0, idx * 2])
        deleteArr.push([0, idx * 2 + 1])
      } else if (obj.parent == this.pointsGroup) {
        deleteArr.push([0, idx])
        deleteArr.push([0, idx + (idx % 2 == 0 ? 1 : -1)])
        deleteArr.push([2, Math.floor(idx / 2)])
      } else if (obj.parent == this.arcsGroup) {

      } else if (obj.parent == this.arcPtsGroup) {

      }
    }

    deleteArr.sort((a, b) => a[0] == b[0] ? b[1] - a[1] : b[0] - a[0]);

    let li, idx;
    for (let i = 0; i < deleteArr.length; i++) {
      if (deleteArr[i][0] == li && deleteArr[i][1] == idx) {
        continue
      } else {
        [li, idx] = deleteArr[i]
      }
      const obj = this.geom[li][idx]
      obj.geometry.dispose()
      obj.material.dispose()
      obj.parent.children.splice(idx, 1)
      obj.parent = null;
    }

    this.selected.clear()
    this.dispatchEvent({ type: 'change' })
  }

  clear() {
    if (this.mode == "") return

    if (this.mode == "line") {
      this.domElement.removeEventListener('pointerdown', this.onClick_1)
      this.domElement.removeEventListener('pointermove', this.beforeClick_2);
      this.domElement.removeEventListener('pointerdown', this.onClick_2);

      const lastLine = this.linesArr[this.linesArr.length - 1]
      this.linesGroup.remove(lastLine)
      lastLine.geometry.dispose()

      const lastPoints = this.ptsArr.slice(this.ptsArr.length - 2)
      this.pointsGroup.remove(...lastPoints)
      lastPoints.forEach(obj => obj.geometry.dispose())

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

    if (this.subsequent) {
      // this.constraints[constraint++] = [
        // [this.ptsArr[this.ptsArr.length-1], this.p1]
      // ]

    }

    this.p2Geom = new THREE.BufferGeometry().setAttribute('position',
      new THREE.BufferAttribute(new Float32Array(3), 3)
    )
    this.p2 = new THREE.Points(
      this.p2Geom,
      new THREE.PointsMaterial().copy(this.pointMaterial)
    );
    this.p2.matrixAutoUpdate = false;

    if (this.mode == "line") {
      this.lineGeom = new THREE.BufferGeometry().setAttribute('position',
        new THREE.BufferAttribute(new Float32Array(6), 3)
      );
      this.lineGeom.attributes.position.set(mouseLoc)
      this.line = new THREE.Line(this.lineGeom,
        new THREE.LineBasicMaterial().copy(this.lineMaterial)
      );
      this.line.frustumCulled = false;


      this.linesGroup.add(this.line)
      this.pointsGroup.add(this.p1)
      this.pointsGroup.add(this.p2)
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

      this.arcsGroup.add(this.arc)
      this.arcPtsGroup.add(this.p1)
      this.arcPtsGroup.add(this.p2)
      this.arcPtsGroup.add(this.p3)

    }



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


    for (let i = 0, p = 0; i < this.ptsArr.length; i++) {
      this.ptsBuf[p++] = this.ptsArr[i].geometry.attributes.position.array[0]
      this.ptsBuf[p++] = this.ptsArr[i].geometry.attributes.position.array[1]
    }

    buffer = Module._malloc(this.ptsBuf.length * this.ptsBuf.BYTES_PER_ELEMENT)
    Module.HEAPF32.set(this.ptsBuf, buffer >> 2)


    Module["_solver"](this.ptsArr.length / 2, buffer)


    let ptr = buffer >> 2;


    for (let i = 0; i < this.ptsArr.length * 2; i += 4) {
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



