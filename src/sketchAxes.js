// import { LineSegments } from '../objects/LineSegments.js';
// import { LineBasicMaterial } from '../materials/LineBasicMaterial.js';
// import { Float32BufferAttribute } from '../core/BufferAttribute.js';
// import { BufferGeometry } from '../core/BufferGeometry.js';

import { LineSegments, LineBasicMaterial, Float32BufferAttribute, BufferGeometry } from '../node_modules/three/src/Three'

class AxesHelper extends LineSegments {

  constructor(s = 1) {

    const vertices = [
      0, 0, 0, 0.5 * s, 0, 0,
      0.5 * s, 0, 0, 0.3 * s, 0.08*s, 0,

      0, 0, 0, 0, s, 0,
    ];


    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    const material = new LineBasicMaterial({ color: 0xff0000, toneMapped: false, linewidth:2 });

    super(geometry, material);

    // this.type = 'AxesHelper';

  }

}


export { AxesHelper };
