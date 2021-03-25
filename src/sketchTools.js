import * as THREE from '../node_modules/three/src/Three'


export function sketchLine(mouseLoc) {
  this.p1Geom = new THREE.BufferGeometry().setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(3), 3)
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

  this.lineGeom = new THREE.BufferGeometry().setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(6), 3)
  );
  this.line = new THREE.Line(this.lineGeom,
    new THREE.LineBasicMaterial().copy(this.lineMaterial)
  );
  this.line.matrixAutoUpdate = false;
  this.line.frustumCulled = false;
  this.line.constraints = new Set()



  this.lineGeom.attributes.position.set(mouseLoc)
  this.p1Geom.attributes.position.set(mouseLoc)

  this.toPush = [this.p1, this.p2, this.line];

  if (this.subsequent) {

    this.constraints.set(this.c_id,
      [
        'coincident', -1,
        [this.children[this.children.length - 2], this.p1, -1, -1]
      ]
    )

    this.p1.constraints.add(this.c_id)
    this.children[this.children.length - 2].constraints.add(this.c_id)
    this.c_id += 1

  }

}