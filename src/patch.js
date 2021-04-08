// import { LineSegments } from '../objects/LineSegments.js';
// import { LineBasicMaterial } from '../materials/LineBasicMaterial.js';
// import { Float32BufferAttribute } from '../core/BufferAttribute.js';
// import { BufferGeometry } from '../core/BufferGeometry.js';

import { LineSegments, MeshBasicMaterial, Float32BufferAttribute, BufferGeometry, Mesh, DoubleSide } from '../node_modules/three/src/Three'


import * as THREE from '../node_modules/three/src/Three';

class Patch extends THREE.Mesh {

  constructor(s = 1) {




    const positions = [
      0.5, 0,
      0.3, 0.08,
      0.3, -0.08,
    ];

    const shape = new THREE.Shape()

    shape.moveTo(positions[0], positions[1])

    for (let i = 2; i < positions.length; i += 2) {
      shape.lineTo(positions[i], positions[i+1])
    }

    console.log(shape)

    const geometry = new THREE.ShapeGeometry( shape );;


    super(
      geometry,
      new MeshBasicMaterial({
        color: 0x0000ff,
        opacity: 0.2,
        side: DoubleSide,
        transparent: true,
        depthWrite: false,
        toneMapped: false
      })
    )

    this.scale.set( 1, 1, 1 );
    return this;
  }

}


export { Patch };
