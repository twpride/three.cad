import * as THREE from '../node_modules/three/src/Three';
import { color } from './shared'

const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 1,
  color: color.dimension,
})


const pointMaterial = new THREE.PointsMaterial({
  color: color.dimension,
  size: 4,
})

let dimVal
export async function drawDimension() {
  let selection = await this.awaitSelection({ point: 2 }, { point: 1, line: 1 }, { line: 2 })
  if (selection == null) return;

  let line, constraint, dimType
  if (selection.every(e => e.userData.type == 'line')) {
    line = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position',
        new THREE.Float32BufferAttribute(Array((divisions + 2) * 2 * 3).fill(-0.001), 3)
      ),
      lineMaterial.clone()
    );

    dimVal = getAngle(selection)

    constraint = [
      'angle', dimVal,
      [-1, -1, selection[0].name, selection[1].name]
    ]

    dimType = 'a'
  } else {
    line = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position',
        new THREE.Float32BufferAttribute(Array(3 * 8).fill(-0.001), 3)
      ),
      lineMaterial.clone()
    );

    let ptLineOrder
    if (selection.every(e => e.userData.type == 'point')) {
      dimVal = 0;
      for (let i = 0; i < 3; i++) {
        dimVal += (selection[0].geometry.attributes.position.array[i] - selection[1].geometry.attributes.position.array[i]) ** 2
      }
      dimVal = Math.sqrt(dimVal)

      constraint = [
        'pt_pt_distance', dimVal,
        // 'smart_dist', dimVal,
        [selection[0].name, selection[1].name, -1, -1]
      ]

    } else {
      ptLineOrder = selection[0].userData.type == 'point' ? [0, 1] : [1, 0]
      const ptArr = selection[ptLineOrder[0]].geometry.attributes.position.array
      const lineArr = selection[ptLineOrder[1]].geometry.attributes.position.array
      p1.set(lineArr[0], lineArr[1])
      p2.set(lineArr[3], lineArr[4])
      tagPos.set(ptArr[0], ptArr[1])
      dir = p2.clone().sub(p1).normalize()
      disp = tagPos.clone().sub(p1)
      proj = dir.multiplyScalar(disp.dot(dir))
      perpOffset = disp.clone().sub(proj)
      dimVal = Math.sqrt(perpOffset.x ** 2 + perpOffset.y ** 2)

      constraint = [
        'pt_line_distance', dimVal,
        [selection[ptLineOrder[0]].name, -1, selection[ptLineOrder[1]].name, -1]
      ]
    }


    dimType = 'd'
  }

  const point = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(3, 3)
    ),
    pointMaterial.clone()
  )
  line.userData.ids = selection.map(e => e.name)

  line.userData.type = 'dimension'
  line.userData.dimType = dimType
  point.userData.type = 'dimension'
  point.userData.dimType = dimType
  line.layers.enable(2)
  point.layers.enable(2)

  this.dimGroup.add(line).add(point)
  const onMove = this._onMoveDimension(point, line, true)
  point.label = document.createElement('div');
  point.label.textContent = dimVal.toFixed(3);
  point.label.contentEditable = true;
  this.labelContainer.append(point.label)

  let onEnd, onKey;
  let add = await new Promise((res) => {
    onEnd = () => {
      if (point.userData.dimType == 'a') {
        point.userData.offset = vecArr[5].toArray()
      } else {
        point.userData.offset = hyp2.toArray() // save offset vector from hyp2
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

    if (line.userData.dimType == 'h') {
      constraint[0] = 'h_dist'
      constraint[1] = p2.x - p1.x
    } else if (line.userData.dimType == 'v') {
      constraint[0] = 'v_dist'
      constraint[1] = p2.y - p1.y
    }

    this.constraints.set(++this.c_id, constraint)

    selection[0].userData.constraints.push(this.c_id)
    selection[1].userData.constraints.push(this.c_id)

    this.updateOtherBuffers()
    line.name = this.c_id


    point.name = this.c_id
    point.label.addEventListener('focus', this.updateDim(this.c_id))

  } else {

    this.dimGroup.children.splice(this.dimGroup.children.length - 2, 2).forEach(
      e => {
        e.geometry.dispose()
        e.material.dispose()
      }
    )
    this.labelContainer.removeChild(this.labelContainer.lastChild);
    sc.render()
  }
  if (this.mode == "dimension") {
    this.drawDimension()
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


const tagPos = new THREE.Vector2()
let ids
export function _onMoveDimension(point, line, initial) {

  ids = line.userData.ids

  let _p1 = this.obj3d.children[this.objIdx.get(ids[0])].geometry.attributes.position.array
  let _p2 = this.obj3d.children[this.objIdx.get(ids[1])].geometry.attributes.position.array

  let loc;

  let update;
  if (line.userData.dimType == 'a') {
    update = updateAngle
  } else {
    update = updateDistance
  }

  return (e) => {
    loc = this.getLocation(e)

    tagPos.set(loc.x, loc.y)

    update(
      line,
      point,
      _p1, _p2, null, initial
    )
    sc.render()
  }
}

export function setDimLines() {
  const restoreLabels = this.labelContainer.childElementCount == 0;
  const dims = this.dimGroup.children
  let point, dist
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

    let _p1 = this.obj3d.children[this.objIdx.get(ids[0])].geometry.attributes.position.array
    let _p2 = this.obj3d.children[this.objIdx.get(ids[1])].geometry.attributes.position.array

    let update;
    if (dims[i].userData.dimType == 'a') {
      update = updateAngle
    } else {
      update = updateDistance
    }

    update(
      // dims[i].geometry.attributes.position,
      // dims[i + 1].geometry.attributes.position,
      dims[i],
      dims[i + 1],
      _p1,
      _p2,
      dims[i + 1].userData.offset
    )
  }

}



const p1 = new THREE.Vector2()
let mdpt
const p1x = new THREE.Vector2()
const p2 = new THREE.Vector2()
let disp, hyp1, hyp2
let proj, proj1, proj2
let p1e, p2e
let p1eArr, p2eArr, tagPosArr
let dir, linedir, perpOffset
let dp1e, dp2e, dp12

function updateDistance(line, point, _p1, _p2, offset, initial) {

  const linegeom = line.geometry.attributes.position
  const pointgeom = point.geometry.attributes.position

  if (offset) {
    if (_p1.length < _p2.length) { // corner case when p1 is pt and p2 is line
      tagPos.set(_p1[0] + offset[0], _p1[1] + offset[1])
    } else {
      tagPos.set(_p2[0] + offset[0], _p2[1] + offset[1])
    }
  }

  let phantom = null
  if (_p1.length == _p2.length) {
    p1.set(_p1[0], _p1[1])
    p2.set(_p2[0], _p2[1])

    if (initial) {
      if (
        (tagPos.x - p1.x) * (tagPos.x - p2.x) > 0 &&
        (tagPos.y - p1.y) * (tagPos.y - p2.y) < 0
      ) {
        line.userData.dimType = 'v'
        point.userData.dimType = 'v'
        // point.label.textContent = Math.abs(p1.y - p2.y).toFixed(3);
        point.label.textContent = (p2.y - p1.y).toFixed(3);
      } else if (
        (tagPos.x - p1.x) * (tagPos.x - p2.x) < 0 &&
        (tagPos.y - p1.y) * (tagPos.y - p2.y) > 0
      ) {
        line.userData.dimType = 'h'
        point.userData.dimType = 'h'
        // point.label.textContent = Math.abs(p1.x - p2.x).toFixed(3);
        point.label.textContent = (p2.x - p1.x).toFixed(3);
      } else {
        line.userData.dimType = 'd'
        point.userData.dimType = 'd'
        point.label.textContent = dimVal.toFixed(3);
      }
    }


    switch (line.userData.dimType) {
      case 'v':
        phantom = [_p1[0] + 1, _p1[1]]
        break;
      case 'h':
        phantom = [_p1[0], _p1[1] + 1]
        break;
      default:
        dir = p2.clone().sub(p1).normalize()
        hyp2 = tagPos.clone().sub(p2) // note that this value is used to calculate tag-p2 offset
        proj = dir.multiplyScalar(hyp2.dot(dir))
        perpOffset = hyp2.clone().sub(proj)

        p1e = p1.clone().add(perpOffset)
        p1eArr = p1e.toArray()
        p2e = p2.clone().add(perpOffset)
        p2eArr = p2e.toArray()
        tagPosArr = tagPos.toArray()

        dp1e = p1e.distanceToSquared(tagPos)
        dp2e = p2e.distanceToSquared(tagPos)
        dp12 = p1e.distanceToSquared(p2e)
        linegeom.array.set(p1.toArray(), 0)

        break;
    }

  }


  if (_p1.length != _p2.length || phantom) {
    if (phantom) {
      p1.set(_p1[0], _p1[1])
      p1x.set(...phantom)
      p2.set(_p2[0], _p2[1])
    } else if (_p1.length > _p2.length) { // when p1 is line, p2 is point
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

    hyp1 = tagPos.clone().sub(mdpt)
    proj1 = dir.clone().multiplyScalar(hyp1.dot(dir))

    hyp2 = tagPos.clone().sub(p2) // note that this value is used to calculate tag-p2 offset
    proj2 = dir.clone().multiplyScalar(hyp2.dot(dir))

    p1eArr = tagPos.clone().sub(proj1).toArray()
    p2eArr = tagPos.clone().sub(proj2).toArray()
    tagPosArr = tagPos.toArray()

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
    linegeom.array.set(tagPosArr, 18)
  } else {
    if (dp1e > dp2e) {
      linegeom.array.set(p2eArr, 18)
    } else {
      linegeom.array.set(p1eArr, 18)
    }
  }
  linegeom.array.set(tagPosArr, 21)

  linegeom.needsUpdate = true;

  pointgeom.array.set(tagPosArr)
  pointgeom.needsUpdate = true;


}


const divisions = 12
const vecArr = Array(6)
for (let k = 0; k < vecArr.length; k++) vecArr[k] = new THREE.Vector2();
const a = Array(3)
const _vec2 = new THREE.Vector2()
let arr, i, j, centerScalar, r_cross_s, center, tagRadius
let dA, tagtoMidline, shift, tA1, tA2, a1, deltaAngle;

function updateAngle(linegeom, pointgeom, _l1, _l2, offset) {
  /*
                          l2:[x0,y0,z0,x1,y1,z1]
                          /
            tagPos:tag-""/-. 
                   |        \
    vecArr[5][1]-->|___.    _|__ l1:[x0,y0,z0,x1,y1,z1]
    vecArr[5][0]----^  ^--center

    vecArr = [
      0: _l1 origin
      1: _l1 disp
      2: _l2 origin
      3: _l2 disp
      4: center
      5: tag offset from center
    ]
  */

  for (i = 0; i < 4;) {
    arr = i == 0 ? _l1 : _l2
    vecArr[i++].set(arr[0], arr[1])
    vecArr[i++].set(arr[3] - arr[0], arr[4] - arr[1])
  }

  // https://stackoverflow.com/questions/563198/
  r_cross_s = vecArr[3].cross(vecArr[1]);
  if (r_cross_s === 0) {
    centerScalar = 0.5
  } else {
    centerScalar = _vec2.subVectors(vecArr[0], vecArr[2]).cross(vecArr[3]) / r_cross_s;
  }
  center = vecArr[4].addVectors(vecArr[0], vecArr[1].clone().multiplyScalar(centerScalar))

  if (offset) {
    tagPos.set(center.x + offset[0], center.y + offset[1])
  }

  vecArr[5].subVectors(tagPos, center) // tag offset
  tagRadius = vecArr[5].length()

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

  for (j = 1, i = 0; j < vecArr.length; j += 2, i++) {
    a[i] = Math.atan2(vecArr[j].y, vecArr[j].x)
  }

  dA = unreflex(a[1] - a[0])
  tagtoMidline = unreflex(a[2] - (a[0] + dA / 2))
  shift = Math.abs(tagtoMidline) < Math.PI / 2 ? 0 : Math.PI;
  tA1 = unreflex(a[2] - (a[0] + shift))
  tA2 = unreflex(a[2] - (a[0] + dA + shift))

  if (dA * tA1 < 0) { // if dA and tA1 are not the same sign
    a1 = a[0] + tA1 + shift
    deltaAngle = dA - tA1
  } else if (dA * tA2 > 0) {
    a1 = a[0] + shift
    deltaAngle = dA + tA2
  } else {
    a1 = a[0] + shift
    deltaAngle = dA
  }

  j = 0;
  linegeom.array[j++] = center.x + tagRadius * Math.cos(a1)
  linegeom.array[j++] = center.y + tagRadius * Math.sin(a1)
  j++
  let angle = a1 + (1 / divisions) * deltaAngle
  linegeom.array[j++] = center.x + tagRadius * Math.cos(angle)
  linegeom.array[j++] = center.y + tagRadius * Math.sin(angle)
  j++
  for (i = 2; i <= divisions; i++) {
    linegeom.array[j++] = linegeom.array[j - 4]
    linegeom.array[j++] = linegeom.array[j - 4]
    j++
    angle = a1 + (i / divisions) * deltaAngle
    linegeom.array[j++] = center.x + tagRadius * Math.cos(angle)
    linegeom.array[j++] = center.y + tagRadius * Math.sin(angle)
    j++
  }
  for (i = 0; i < 2; i++) {
    linegeom.array[j++] = vecArr[2 * i].x
    linegeom.array[j++] = vecArr[2 * i].y
    j++
    linegeom.array[j++] = center.x + tagRadius * Math.cos(a[i] + shift)
    linegeom.array[j++] = center.y + tagRadius * Math.sin(a[i] + shift)
    j++
  }

  linegeom.needsUpdate = true;
  pointgeom.array.set(tagPos.toArray())
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


export function onDimMoveEnd(point) {
  if (point.userData.dimType == 'a') {
    point.userData.offset = vecArr[5].toArray()
  } else {
    point.userData.offset = hyp2.toArray() // save offset vector from hyp2
  }
}