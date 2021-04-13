import * as THREE from '../node_modules/three/src/Three';
import { color } from './shared'

const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 2,
  color: color.dimension,
})


const pointMaterial = new THREE.PointsMaterial({
  color: color.dimension,
  size: 4,
})


export async function drawDimension(cc) {
  //////////
  let selection
  if (cc == 'd') {
    selection = await this.awaitSelection({ point: 2 }, { point: 1, line: 1 })
  } else {
    selection = await this.awaitSelection({ line: 2 })
  }

  /////////

  if (selection == null) return;

  let line;
  if (cc == 'd') {
    line = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position',
        new THREE.Float32BufferAttribute(Array(3 * 8).fill(-0.001), 3)
      ),
      lineMaterial.clone()
    );
  } else {
    line = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position',
        new THREE.Float32BufferAttribute(Array((divisions + 2) * 2 * 3).fill(-0.001), 3)
      ),
      lineMaterial.clone()
    );
  }




  const point = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(3, 3)
    ),
    pointMaterial.clone()
  )

  line.userData.ids = selection.map(e => e.name)

  line.layers.enable(2)
  point.layers.enable(2)


  //////////////
  let dimVal, ptLineOrder;

  if (cc == 'd') {
    if (selection.every(e => e.userData.type == 'point')) {
      for (let i = 0; i < 3; i++) {
        dimVal += (selection[0].geometry.attributes.position.array[i] - selection[1].geometry.attributes.position.array[i]) ** 2
      }
      dimVal = Math.sqrt(dimVal)
    } else {
      ptLineOrder = selection[0].userData.type == 'point' ? [0, 1] : [1, 0]
      const ptArr = selection[ptLineOrder[0]].geometry.attributes.position.array
      const lineArr = selection[ptLineOrder[1]].geometry.attributes.position.array
      p1.set(lineArr[0], lineArr[1])
      p2.set(lineArr[3], lineArr[4])
      p3.set(ptArr[0], ptArr[1])
      dir = p2.clone().sub(p1).normalize()
      disp = p3.clone().sub(p1)
      proj = dir.multiplyScalar(disp.dot(dir))
      perpOffset = disp.clone().sub(proj)
      dimVal = Math.sqrt(perpOffset.x ** 2 + perpOffset.y ** 2)
    }
  } else {
    dimVal = getAngle(selection)
  }
  ////////////




  this.obj3d.children[1].add(line).add(point)
  const onMove = this._onMoveDimension(point, line)

  point.label = document.createElement('div');
  point.label.textContent = dimVal.toFixed(3);
  point.label.contentEditable = true;
  this.labelContainer.append(point.label)

  let onEnd, onKey;
  let add = await new Promise((res) => {
    onEnd = (e) => {
      if (cc == 'd') {
        point.userData.offset = hyp2.toArray() // save offset vector from hyp2
      } else {
        point.userData.offset = vecArr[5].toArray()
      }
      res(true)
    }
    onKey = (e) => e.key == 'Escape' && res(false)

    this.canvas.addEventListener('pointermove', onMove)
    this.canvas.addEventListener('pointerdown', onEnd)
    window.addEventListener('keydown', onKey)
  })

  this.canvas.removeEventListener('pointermove', onMove)
  this.canvas.removeEventListener('pointerdown', onEnd)
  window.removeEventListener('keydown', onKey)
  point.geometry.computeBoundingSphere()
  line.geometry.computeBoundingSphere()

  if (add) {
    if (cc == 'd') {
      if (ptLineOrder) {
        this.constraints.set(++this.c_id, //???
          [
            'pt_line_distance', dimVal,
            [selection[ptLineOrder[0]].name, -1, selection[ptLineOrder[1]].name, -1]
          ]
        )
      } else {
        this.constraints.set(++this.c_id, //???
          [
            'pt_pt_distance', dimVal,
            [selection[0].name, selection[1].name, -1, -1]
          ]
        )
      }
    } else {
      this.constraints.set(++this.c_id,
        [
          'angle', dimVal,
          [-1, -1, selection[0].name, selection[1].name]
        ]
      )
    }



    selection[0].userData.constraints.push(this.c_id)
    selection[1].userData.constraints.push(this.c_id)

    this.updateOtherBuffers()

    line.name = this.c_id
    line.userData.type = 'dimension'
    point.name = this.c_id
    point.userData.type = 'dimension'


    point.label.addEventListener('focus', this.updateDim(this.c_id))


  } else {

    this.obj3d.children[1].children.splice(this.obj3d.children[1].length - 2, 2).forEach(
      e => {
        e.geometry.dispose()
        e.material.dispose()
      }
    )
    this.labelContainer.removeChild(this.labelContainer.lastChild);
    sc.render()
  }

  return
}



export function updateDim(c_id) {
  return (ev_focus) => {
    let value = ev_focus.target.textContent
    document.addEventListener('keydown', (e) => {
      if (e.key == 'Enter') {
        e.preventDefault()
        const ent = this.constraints.get(c_id)
        ent[1] = parseFloat(ev_focus.target.textContent)
        value = ent[1]
        this.constraints.set(c_id, ent)
        this.updateOtherBuffers()
        this.solve()
        sc.render()
        ev_focus.target.blur()
        this.updateBoundingSpheres()
      } else if (e.key == 'Escape') {
        ev_focus.target.textContent = value
        getSelection().empty()
        ev_focus.target.blur()
      }
    })
  }
}


let ids, _p1, _p2
export function _onMoveDimension(point, line) {

  ids = line.userData.ids

  _p1 = this.obj3d.children[this.objIdx.get(ids[0])].geometry.attributes.position.array
  _p2 = this.obj3d.children[this.objIdx.get(ids[1])].geometry.attributes.position.array

  let loc;

  return (e) => {
    loc = this.getLocation(e)

    p3.set(loc.x, loc.y)

    update(
      line.geometry.attributes.position,
      point.geometry.attributes.position,
      _p1, _p2
    )



    sc.render()
  }
}

export function setDimLines() {

  const restoreLabels = this.labelContainer.childElementCount == 0;

  const dims = this.obj3d.children[1].children

  let point, dist;
  for (let i = 0; i < dims.length; i += 2) {
    if (restoreLabels) {
      point = dims[i + 1]  // point node is at i+1
      dist = this.constraints.get(point.name)[1]
      point.label = document.createElement('div');
      point.label.textContent = dist.toFixed(3);
      point.label.contentEditable = true;
      this.labelContainer.append(point.label)

      point.label.addEventListener('focus', this.updateDim(this.c_id))
    }

    ids = dims[i].userData.ids

    _p1 = this.obj3d.children[this.objIdx.get(ids[0])].geometry.attributes.position.array
    _p2 = this.obj3d.children[this.objIdx.get(ids[1])].geometry.attributes.position.array


    let offset = dims[i + 1].userData.offset


    update(
      dims[i].geometry.attributes.position,
      dims[i + 1].geometry.attributes.position,
      _p1,
      _p2,
      offset
    )
  }

}


export function onDimMoveEnd(point) {
  if (hyp2) {
    point.userData.offset = hyp2.toArray() // save offset vector from hyp2
  } else {
    point.userData.offset = vecArr[5].clone().sub(vecArr[2]).toArray()
  }
}

const p1 = new THREE.Vector2()
let mdpt
const p1x = new THREE.Vector2()
const p2 = new THREE.Vector2()
const p3 = new THREE.Vector2()
let disp, hyp1, hyp2
let proj, proj1, proj2
let p1e, p2e
let p1eArr, p2eArr, p3Arr
let dir, linedir, perpOffset
let dp1e, dp2e, dp12

function updatex(linegeom, pointgeom, _p1, _p2, offset) {

  if (offset) {
    if (_p1.length < _p2.length) { // corner case when p1 is pt and p2 is line
      p3.set(_p1[0] + offset[0], _p1[1] + offset[1])
    } else {
      p3.set(_p2[0] + offset[0], _p2[1] + offset[1])
    }
  }


  if (_p1.length == _p2.length) {
    p1.set(_p1[0], _p1[1])
    p2.set(_p2[0], _p2[1])

    dir = p2.clone().sub(p1).normalize()
    hyp2 = p3.clone().sub(p2) // note that this value is used to calculate tag-p2 offset
    proj = dir.multiplyScalar(hyp2.dot(dir))
    perpOffset = hyp2.clone().sub(proj)

    p1e = p1.clone().add(perpOffset)
    p1eArr = p1e.toArray()
    p2e = p2.clone().add(perpOffset)
    p2eArr = p2e.toArray()
    p3Arr = p3.toArray()

    dp1e = p1e.distanceToSquared(p3)
    dp2e = p2e.distanceToSquared(p3)
    dp12 = p1e.distanceToSquared(p2e)

    linegeom.array.set(p1.toArray(), 0)


  } else {
    if (_p1.length > _p2.length) { // when p1 is line, p2 is point
      p1.set(_p1[0], _p1[1])
      p1x.set(_p1[3], _p1[4])
      p2.set(_p2[0], _p2[1])
    } else { // when p1 is point, p2 is line
      p1.set(_p2[0], _p2[1])
      p1x.set(_p2[3], _p2[4])
      p2.set(_p1[0], _p1[1])
    }

    linedir = p1x.clone().sub(p1)
    mdpt = p1.clone().addScaledVector(linedir, 0.5)
    linedir.normalize()

    disp = p2.clone().sub(mdpt)
    proj = linedir.multiplyScalar(disp.dot(linedir))

    dir = disp.clone().sub(proj)
    dp12 = dir.lengthSq()
    dir.normalize()


    hyp1 = p3.clone().sub(mdpt)
    proj1 = dir.clone().multiplyScalar(hyp1.dot(dir))

    hyp2 = p3.clone().sub(p2) // note that this value is used to calculate tag-p2 offset
    proj2 = dir.clone().multiplyScalar(hyp2.dot(dir))


    p1eArr = p3.clone().sub(proj1).toArray()
    p2eArr = p3.clone().sub(proj2).toArray()
    p3Arr = p3.toArray()

    dp1e = proj1.lengthSq()
    dp2e = proj2.lengthSq()

    linegeom.array.set(mdpt.toArray(), 0)

  }

  linegeom.array.set(p1eArr, 3)
  linegeom.array.set(p1eArr, 6)
  linegeom.array.set(p2eArr, 9)
  linegeom.array.set(p2eArr, 12)
  linegeom.array.set(p2.toArray(), 15)
  if (dp12 >= dp1e && dp12 >= dp2e) {
    linegeom.array.set(p3Arr, 18)
  } else {
    if (dp1e > dp2e) {
      linegeom.array.set(p2eArr, 18)
    } else {
      linegeom.array.set(p1eArr, 18)
    }
  }
  linegeom.array.set(p3Arr, 21)

  linegeom.needsUpdate = true;

  pointgeom.array.set(p3Arr)
  pointgeom.needsUpdate = true;


}

const divisions = 12
export function findIntersection(q, s, p, r) {
  /*
    Based on: https://stackoverflow.com/questions/563198/

    q+s  p+r
      \/__________ q+u*s
      /\  
     /  \
    p    q
    
    u = (q − p) × r / (r × s)
    when r × s = 0, the lines are either colinear or parallel

    function returns u
    for "real" intersection to exist, 0<u<1
  */
  const q_minus_p = q.clone().sub(p);
  const r_cross_s = r.cross(s);
  if (r_cross_s === 0) return null; //either colinear or parallel
  return q_minus_p.cross(r) / r_cross_s;
}



const vecArr = Array(6)
for (var i = 0; i < vecArr.length; i++) vecArr[i] = new THREE.Vector2();
const a = Array(3)

function update(linegeom, pointgeom, _l1, _l2, offset) {

  let i = 0;
  for (; i < 4;) {
    const arr = i == 0 ? _l1 : _l2
    vecArr[i++].set(arr[0], arr[1])
    vecArr[i++].set(arr[3] - arr[0], arr[4] - arr[1])
  }

  const centerScalar = findIntersection(...vecArr.slice(0, 4))
  const center = vecArr[4].addVectors(vecArr[0], vecArr[1].clone().multiplyScalar(centerScalar))

  if (offset) {
    p3.set(center.x + offset[0], center.y + offset[1])
  }

  vecArr[5].subVectors(p3, center)

  const tagRadius = vecArr[5].length()

  /*
    if tag is more than 90 deg away from midline, we shift everything by 180

    a: array that describes absolute angular position of angle start, angle end, and tag

       a[2]:      
        tag  a[1]:angle end
      \  |  /
       \ | /
     ___\|/___ a[0]+dA/2:midline
        / \
       /   \
      /     \
             a[0]:angle start 
  */

  for (let j = 1, i = 0; j < vecArr.length; j += 2, i++) {
    a[i] = Math.atan2(vecArr[j].y, vecArr[j].x)
  }

  let dA = unreflex(a[1] - a[0])


  let tagtoMidline = unreflex(a[2] - (a[0] + dA / 2))

  let shift = Math.abs(tagtoMidline) < Math.PI / 2 ? 0 : Math.PI;

  let tA1 = unreflex(a[2] - (a[0] + shift))
  let tA2 = unreflex(a[2] - (a[0] + dA + shift))


  let a1, deltaAngle;
  if (dA * tA1 < 0) {
    a1 = a[0] + tA1 + shift
    deltaAngle = dA - tA1
  } else if (dA * tA2 > 0) {
    a1 = a[0] + shift
    deltaAngle = dA + tA2
  } else {
    a1 = a[0] + shift
    deltaAngle = dA
  }

  let points = linegeom.array

  let d = 0;
  points[d++] = center.x + tagRadius * Math.cos(a1)
  points[d++] = center.y + tagRadius * Math.sin(a1)
  d++

  const angle = a1 + (1 / divisions) * deltaAngle
  points[d++] = center.x + tagRadius * Math.cos(angle)
  points[d++] = center.y + tagRadius * Math.sin(angle)
  d++

  for (i = 2; i <= divisions; i++) {
    points[d++] = points[d - 4]
    points[d++] = points[d - 4]
    d++
    const angle = a1 + (i / divisions) * deltaAngle
    points[d++] = center.x + tagRadius * Math.cos(angle)
    points[d++] = center.y + tagRadius * Math.sin(angle)
    d++
  }


  for (i = 0; i < 2; i++) {
    points[d++] = vecArr[2 * i].x
    points[d++] = vecArr[2 * i].y
    d++
    points[d++] = center.x + tagRadius * Math.cos(a[i] + shift)
    points[d++] = center.y + tagRadius * Math.sin(a[i] + shift)
    d++
  }

  linegeom.needsUpdate = true;

  pointgeom.array.set(p3.toArray())
  pointgeom.needsUpdate = true;


}


const twoPi = Math.PI * 2
const negTwoPi = - Math.PI * 2
const negPi = - Math.PI

function unreflex(angle) {
  if (angle > Math.PI) {
    angle = negTwoPi + angle
  } else if (angle < negPi) {
    angle = twoPi + angle
  }
  return angle
}




export async function drawAngle() {
  /////////
  let selection = await this.awaitSelection({ line: 2 })
  //////////

  if (selection == null) return;

  const line = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(Array((divisions + 2) * 2 * 3).fill(-0.001), 3)
    ),
    lineMaterial.clone()
  );

  const point = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(3, 3)
    ),
    pointMaterial.clone()
  )

  line.userData.ids = selection.map(e => e.name)

  line.layers.enable(2)
  point.layers.enable(2)


  /////////////
  let angle = getAngle(selection)
  //////////




  this.obj3d.children[1].add(line).add(point)
  const onMove = this._onMoveDimension(point, line)

  point.label = document.createElement('div');
  point.label.textContent = angle.toFixed(3);
  point.label.contentEditable = true;
  this.labelContainer.append(point.label)

  let onEnd, onKey;
  let add = await new Promise((res) => {
    onEnd = (e) => {
      point.userData.offset = vecArr[5].toArray()
      res(true)
    }
    onKey = (e) => e.key == 'Escape' && res(false)

    this.canvas.addEventListener('pointermove', onMove)
    this.canvas.addEventListener('pointerdown', onEnd)
    window.addEventListener('keydown', onKey)
  })

  this.canvas.removeEventListener('pointermove', onMove)
  this.canvas.removeEventListener('pointerdown', onEnd)
  window.removeEventListener('keydown', onKey)
  point.geometry.computeBoundingSphere()
  line.geometry.computeBoundingSphere()

  if (add) {

    this.constraints.set(++this.c_id,
      [
        'angle', angle,
        [-1, -1, selection[0].name, selection[1].name]
      ]
    )







    selection[0].userData.constraints.push(this.c_id)
    selection[1].userData.constraints.push(this.c_id)

    this.updateOtherBuffers()

    line.name = this.c_id
    line.userData.type = 'dimension'
    point.name = this.c_id
    point.userData.type = 'dimension'

    point.label.addEventListener('focus', this.updateAng(this.c_id))

  } else {

    this.obj3d.children[1].children.splice(this.obj3d.children[1].length - 2, 2).forEach(
      e => {
        e.geometry.dispose()
        e.material.dispose()
      }
    )
    this.labelContainer.removeChild(this.labelContainer.lastChild);
    sc.render()
  }

  return
}


const getAngle = (Obj3dLines) => {
  for (let i = 0; i < 2; i++) {
    const arr = Obj3dLines[i].geometry.attributes.position.array
    vecArr[2 * i].set(...arr.slice(0, 2))
    vecArr[2 * i + 1].set(arr[3] - arr[0], arr[4] - arr[1])
  }
  const a1 = Math.atan2(vecArr[1].y, vecArr[1].x)
  const a2 = Math.atan2(vecArr[3].y, vecArr[3].x)

  let deltaAngle = Math.abs(a2 - a1)
  if (deltaAngle > Math.PI) {
    deltaAngle = Math.PI * 2 - deltaAngle
  }
  return deltaAngle / Math.PI * 180
}
