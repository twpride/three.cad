
import * as THREE from '../../node_modules/three/src/Three';
import {lineMaterial, pointMaterial} from './Sketcher'

export function sketchArc(mouseLoc) {
  const p1Geom = new THREE.BufferGeometry().setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(mouseLoc), 3)
  )
  const p1 = new THREE.Points(p1Geom,
    new THREE.PointsMaterial().copy(pointMaterial)
  );
  p1.matrixAutoUpdate = false;
  p1.constraints = new Set()

  const p2Geom = new THREE.BufferGeometry().setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(3), 3)
  )
  const p2 = new THREE.Points(
    p2Geom,
    new THREE.PointsMaterial().copy(pointMaterial)
  );
  p2.matrixAutoUpdate = false;
  p2.constraints = new Set()

  const arcGeom = new THREE.BufferGeometry().setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(3 * 37), 3)
  )

  const arc = new THREE.Line(arcGeom,
    new THREE.LineBasicMaterial().copy(lineMaterial)
  );
  arc.frustumCulled = false;

  const p3Geom = new THREE.BufferGeometry().setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(3), 3)
  )
  const p3 = new THREE.Points(p3Geom,
    new THREE.PointsMaterial().copy(pointMaterial)
  );

  return [p1, p2, p3, arc]
}

export function sketchArc2(mouseLoc, toPush) {
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

export function get2PtArc(p1, p2, divisions = 36) {

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


export function get3PtArc(p1, p2, c, divisions = 36) {

  const v1 = [p1[0] - c[0], p1[1] - c[1]]
  const v2 = [p2[0] - c[0], p2[1] - c[1]]

  let a1 = Math.atan2(v1[1], v1[0])
  let a2 = Math.atan2(v2[1], v2[0])

  const radius = Math.sqrt(v1[0] ** 2 + v1[1] ** 2)

  let deltaAngle = a2 - a1
  if (deltaAngle <=0) deltaAngle += Math.PI*2
  // console.log(deltaAngle)
  
  let points = new Float32Array((divisions + 1) * 3)

  for (let d = 0; d <= divisions; d++) {
    const angle = a1 + (d / divisions) * deltaAngle;
    points[3 * d] = c[0] + radius * Math.cos(angle);
    points[3 * d + 1] = c[1] + radius * Math.sin(angle);
  }
  return points;
}