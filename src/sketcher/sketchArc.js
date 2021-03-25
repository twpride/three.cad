import * as THREE from 'three/src/Three'

import { get2PtArc, get3PtArc } from './geometry'
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