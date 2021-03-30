import * as THREE from '../../node_modules/three/src/Three';
import {ptObj, lineObj} from '../utils/static'

export function sketchLine(mouseLoc) {

  const p1 = ptObj()
  
  p1.matrixAutoUpdate = false;
  p1.constraints = new Set()

  const p2 = ptObj()
  p2.matrixAutoUpdate = false;
  p2.constraints = new Set()

  const line = lineObj()
  line.matrixAutoUpdate = false;
  line.frustumCulled = false;
  line.constraints = new Set()


  line.geometry.attributes.position.set(mouseLoc)
  p1.geometry.attributes.position.set(mouseLoc)

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