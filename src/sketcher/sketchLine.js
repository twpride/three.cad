import * as THREE from '../../node_modules/three/src/Three';
import {ptObj, lineObj} from '../utils/static'

export function sketchLine(mouseLoc) {

  const p1 = ptObj()
  
  p1.matrixAutoUpdate = false;
  p1.userData.constraints = []

  const p2 = ptObj()
  p2.matrixAutoUpdate = false;
  p2.userData.constraints = []

  const line = lineObj()
  line.matrixAutoUpdate = false;
  line.frustumCulled = false;
  line.userData.constraints = []


  line.geometry.attributes.position.set(mouseLoc)
  p1.geometry.attributes.position.set(mouseLoc)

  if (this.subsequent) {

    this.constraints.set(++this.c_id,
      [
        'coincident', -1,
        [this.sketch.children[this.sketch.children.length - 2].name, p1.name, -1, -1]
      ]
    )

    p1.userData.constraints.push(this.c_id)
    this.sketch.children[this.sketch.children.length - 2].userData.constraints.push(this.c_id)

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