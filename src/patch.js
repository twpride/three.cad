// import { LineSegments } from '../objects/LineSegments.js';
// import { LineBasicMaterial } from '../materials/LineBasicMaterial.js';
// import { Float32BufferAttribute } from '../core/BufferAttribute.js';
// import { BufferGeometry } from '../core/BufferGeometry.js';

import { LineSegments, MeshBasicMaterial, Float32BufferAttribute, BufferGeometry, Mesh, DoubleSide } from '../node_modules/three/src/Three'

class Patch extends Mesh {

  constructor(s = 1) {

    const positions = [
      0.5 * s, 0, 0, 
      0.3 * s, 0.08*s, 0,
      0.3 * s, -0.08*s, 0
    ];

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));


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

    return this;
  }

}


export { Patch };
