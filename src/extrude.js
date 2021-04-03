import * as THREE from 'three/src/Three';
import { color, ptObj } from './utils/shared'
export function extrude(sketch) {

  let constraints = sketch.constraints;
  let linkedObjs = sketch.linkedObjs;
  let children = sketch.obj3d.children;
  let objIdx = sketch.objIdx;
  let visited = new Set()
  let v2s = []
  let offSetPts = []
  


  function findPair(node) {
    if (node.userData.construction) return;
    visited.add(node)
    let linkedObj = linkedObjs.get(node.userData.l_id)
    let arr;
    if (linkedObj[0] == 'line') {
      arr = children[objIdx.get(linkedObj[1][2])].geometry.attributes.position.array
    } else if (linkedObj[0] == 'arc') {
      arr = children[objIdx.get(linkedObj[1][3])].geometry.attributes.position.array
    }
    for (let i = 0; i < arr.length; i += 3) {
      v2s.push(new THREE.Vector2(arr[i], arr[i + 1]))
    }

    offSetPts.push(arr[0], arr[1]) //make work points for sketch creation
    // offSetPts.push(arr[arr.length - 3], arr[arr.length - 2])

    for (let i = 0; i < 2; i++) {
      let d = children[
        objIdx.get(
          linkedObj[1][i]
        )
      ]
      if (d == -1 || d == node) continue;
      if (d == children[1]) {
        console.log('pair found')
      };
      findTouching(d)
    }

  }


  function findTouching(node) {
    for (let t of node.userData.constraints) {
      if (constraints.get(t)[0] != 'points_coincident') continue
      for (let c of constraints.get(t)[2]) {
        if (c == -1) continue;
        const d = children[objIdx.get(c)]
        if (d == node) continue;
        if (d == children[1]) {
          console.log('loop found')
        } else {
          if (!visited.has(d)) {
            findPair(d)
          }
        };
      }
    }
  }


  findPair(children[1])

  const shape = new THREE.Shape(v2s);
  const extrudeSettings = { depth: 8, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const phong = new THREE.MeshPhongMaterial({
    color: color.m,
    emissive: color.emissive,
    flatShading: true
  });
  const mesh = new THREE.Mesh(geometry, phong)
  // mesh.name = "Extrude"
  mesh.name = 'm' + nid++

  for (let i = 0; i < offSetPts.length; i += 2) {
    if (
      offSetPts[i] == offSetPts[i - 2] &&
      offSetPts[i + 1] == offSetPts[i - 1]
    ) continue;
    mesh.add(
      ptObj([offSetPts[i], offSetPts[i + 1], 8])
    )
  }


  mesh.matrixAutoUpdate = false;
  mesh.matrix.multiply(sketch.obj3d.matrix)
  this.obj3d.add(mesh)


  this.render()

  // sketch.visible = false
  this.store.dispatch({ type: 'rx-extrusion', mesh, sketch })
}



