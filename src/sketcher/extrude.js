import * as THREE from '../../node_modules/three/src/Three';
import { pointMaterial } from '../utils/static'
export function extrude(sketch) {

  let constraints = sketch.constraints;
  let linkedObjs = sketch.linkedObjs;
  let children = sketch.children;
  let objIdx = sketch.objIdx;
  let visited = new Set()
  let v2s = []

  function findPair(node) {
    visited.add(node)
    let linkedObj = linkedObjs.get(node.l_id)
    let arr;
    if (linkedObj[0] == 'line') {
      // console.log(children, objIdx, linkedObj)
      arr = children[objIdx.get(linkedObj[1][2])].geometry.attributes.position.array
    } else if (linkedObj[0] == 'arc') {
      arr = children[objIdx.get(linkedObj[1][3])].geometry.attributes.position.array
    }
    for (let i = 0; i < arr.length; i += 3) {
      v2s.push(new THREE.Vector2(arr[i], arr[i + 1]))
    }

    for (let i = 0; i < 2; i++) {
      // let d = linkedObj[1][i]
      let d = children[objIdx.get(linkedObj[1][i])]
      if (d == -1 || d == node) continue;
      if (d == children[1]) {
        console.log('pair found')
      };
      findTouching(d)
    }

  }


  function findTouching(node) {
    for (let t of node.constraints) {
      if (constraints.get(t)[0] != 'coincident') continue
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
  const phong = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });
  const mesh = new THREE.Mesh(geometry, phong)
  // mesh.applyMatrix4(sketch.inverse)
  // mesh.matrix.premultiply(sketch.matrix).multiply(sketch.inverse)

  mesh.matrixAutoUpdate = false;
  mesh.matrix.multiply(sketch.matrix)
  this.scene.add(mesh)

  const wireframe = new THREE.WireframeGeometry(geometry);

  const pts = new THREE.Points(wireframe, pointMaterial);
  pts.matrixAutoUpdate = false;
  pts.matrix.multiply(sketch.matrix)
  this.scene.add(pts)

  this.render()

  // this.dispatchEvent({ type: 'change' })
  // this.visible = false
}



