import {ptObj, lineObj} from './shared'

export function drawLine(mouseLoc) {

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

  return [p1, p2, line];
}

export function drawLine2(mouseLoc, toPush) {

  const [p1, p2, line] = toPush

  p2.geometry.attributes.position.set(mouseLoc);
  p2.geometry.attributes.position.needsUpdate = true;
  p2.geometry.computeBoundingSphere();

  line.geometry.attributes.position.set(mouseLoc, 3)
  line.geometry.attributes.position.needsUpdate = true;
  line.geometry.computeBoundingSphere();

}