

import {
	Vector2
} from '../node_modules/three/src/Three';
import { ptObj, lineObj } from './shared'

const n = 30

export function drawArc(mouseLoc) {

  const p1 = ptObj(mouseLoc)
  p1.matrixAutoUpdate = false;
  p1.userData.constraints = []

  const p2 = ptObj()
  p2.matrixAutoUpdate = false;
  p2.userData.constraints = []

  const arc = lineObj(n)
  arc.frustumCulled = false;
  arc.userData.constraints = []

  const p3 = ptObj()
  p3.matrixAutoUpdate = false;
  p3.userData.constraints = []

  return [p1, p2, p3, arc]
}

export function drawArc2(mouseLoc, toPush) {
  const [p1, p2, p3, arc] = toPush

  p2.geometry.attributes.position.set(mouseLoc);
  p2.geometry.attributes.position.needsUpdate = true;
  p2.geometry.computeBoundingSphere();

  const [points, center] = get2PtArc(
    p1.geometry.attributes.position.array,
    p2.geometry.attributes.position.array
  )
  arc.geometry.attributes.position.set(
    points
  );
  arc.geometry.attributes.position.needsUpdate = true;
  p3.geometry.attributes.position.set(center);
  p3.geometry.attributes.position.needsUpdate = true;
  p3.geometry.computeBoundingSphere()
}



const mdpt1 = new Vector2()
const mdpt2 = new Vector2()
const bis1 = new Vector2()
const bis2 = new Vector2()
const _vec2 = new Vector2()
const _p1 = new Vector2()
const _p2 = new Vector2()
const _l12 = new Vector2()


export function drawArc3(p1, p2) {
  _p1.set(
    p1.geometry.attributes.position.array[0],
    p1.geometry.attributes.position.array[1]
  )
  _p2.set(
    p2.geometry.attributes.position.array[0],
    p2.geometry.attributes.position.array[1]
  )
  _l12.subVectors(_p2, _p1)
  bis1.set(-_l12.y, _l12.x)
  mdpt1.addVectors(_p1, _l12.multiplyScalar(0.5))
}

let r_cross_s, centerScalar, ccw, points
export function drawArc4(mouseLoc, toPush) {
  const [p1, p2, p3, arc] = toPush

  _vec2.set(mouseLoc.x - _p1.x, mouseLoc.y - _p1.y)

  ccw = _l12.cross(_vec2) < 0 ? 1 : 0;

  bis2.set(-_vec2.y, _vec2.x)
  mdpt2.addVectors(_p1, _vec2.multiplyScalar(0.5))

  // https://stackoverflow.com/questions/563198/
  r_cross_s = bis1.cross(bis2);
  if (r_cross_s === 0) {
    centerScalar = 0.5
  } else {
    centerScalar = _vec2.subVectors(mdpt2, mdpt1).cross(bis1) / r_cross_s;
  }

  p3.geometry.attributes.position.set(
    _vec2.addVectors(mdpt2, bis2.multiplyScalar(centerScalar)).toArray()
  );

  p3.geometry.attributes.position.needsUpdate = true;
  p3.geometry.computeBoundingSphere()

  if (ccw) {
    points = get3PtArc(
      p1.geometry.attributes.position.array,
      p2.geometry.attributes.position.array,
      p3.geometry.attributes.position.array
    )
    p1.userData.start = true
    p2.userData.start = false
  } else {
    points = get3PtArc(
      p2.geometry.attributes.position.array,
      p1.geometry.attributes.position.array,
      p3.geometry.attributes.position.array
    )
    p2.userData.start = true
    p1.userData.start = false
  }

  arc.geometry.attributes.position.set(
    points
  );
  arc.geometry.attributes.position.needsUpdate = true;
  arc.userData.ccw = ccw;

  return ccw
}

export function get2PtArc(p1, p2, divisions = n) {

  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const dist = Math.sqrt(dx ** 2 + dy ** 2)
  const midAngle = (Math.atan2(dy, dx) - Math.PI / 2) % (2 * Math.PI)
  let a1 = midAngle - Math.PI / 6
  let a2 = midAngle + Math.PI / 6

  a1 = a1 < 0 ? a1 + 2 * Math.PI : a1
  a2 = a2 < 0 ? a2 + 2 * Math.PI : a1

  const factor = Math.tan(Math.PI / 3)
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


export function get3PtArc(p1, p2, c, divisions = n) {

  const v1 = [p1[0] - c[0], p1[1] - c[1]]
  const v2 = [p2[0] - c[0], p2[1] - c[1]]

  let a1 = Math.atan2(v1[1], v1[0])
  let a2 = Math.atan2(v2[1], v2[0])

  const radius = Math.sqrt(v1[0] ** 2 + v1[1] ** 2)


  let deltaAngle = a2 - a1
  if (deltaAngle <= 0) deltaAngle += Math.PI * 2

  // let deltaAngle = a2 - a1
  // if (deltaAngle > Math.PI ){
  //   deltaAngle = - Math.PI*2 + deltaAngle
  // } else if (deltaAngle < -Math.PI) {
  //   deltaAngle =  Math.PI*2 + deltaAngle
  // }

  // let deltaAngle = Math.abs(a2 - a1)
  // if (deltaAngle > Math.PI){
  //   deltaAngle = Math.PI*2 - deltaAngle
  // }


  let points = new Float32Array((divisions + 1) * 3)

  for (let d = 0; d <= divisions; d++) {
    const angle = a1 + (d / divisions) * deltaAngle;
    points[3 * d] = c[0] + radius * Math.cos(angle);
    points[3 * d + 1] = c[1] + radius * Math.sin(angle);
  }
  return points;
}


export function getAngleArc(a1, a2, c, radius, divisions = n) {


  let deltaAngle = a2 - a1

  let points = new Float32Array((divisions + 1) * 3)

  for (let d = 0; d <= divisions; d++) {
    const angle = a1 + (d / divisions) * deltaAngle;
    points[3 * d] = c[0] + radius * Math.cos(angle);
    points[3 * d + 1] = c[1] + radius * Math.sin(angle);
  }
  return points;
}