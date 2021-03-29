import * as THREE from '../../node_modules/three/src/Three';
import {lineMaterial, pointMaterial} from '../utils/static'

export function sketchLine(mouseLoc) {

  const p1Geom = new THREE.BufferGeometry().setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(3), 3)
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

  const lineGeom = new THREE.BufferGeometry().setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(6), 3)
  );
  const line = new THREE.Line(lineGeom,
    new THREE.LineBasicMaterial().copy(lineMaterial)
  );
  line.matrixAutoUpdate = false;
  line.frustumCulled = false;
  line.constraints = new Set()


  lineGeom.attributes.position.set(mouseLoc)
  p1Geom.attributes.position.set(mouseLoc)

  if (this.subsequent) {

    this.constraints.set(++this.c_id,
      [
        'coincident', -1,
        [this.children[this.children.length - 2].id, p1.id, -1, -1]
      ]
    )

    p1.constraints.add(this.c_id)
    this.children[this.children.length - 2].constraints.add(this.c_id)

  }



  return [p1, p2, line];
}

export function sketchLine2(mouseLoc, toPush) {

  const [p1, p2, line] = toPush

  p2.geometry.attributes.position.set(mouseLoc);
  p2.geometry.attributes.position.needsUpdate = true;
  p2.geometry.computeBoundingSphere();

  line.geometry.attributes.position.set(mouseLoc, 3)
  line.geometry.attributes.position.needsUpdate = true;
}