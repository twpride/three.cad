import * as THREE from '../node_modules/three/src/Three';
import { color } from './shared'
export function extrude(sketch, depth, refresh=false) {

  let constraints = sketch.constraints;
  let linkedObjs = sketch.linkedObjs;
  let children = sketch.obj3d.children;
  let objIdx = sketch.objIdx;
  let visited = new Set()
  let v2s = []

  function findPair(node) {
    // console.log(node.name, 'xx')
    if (node.userData.construction) return;
    visited.add(node)
    let linkedObj = linkedObjs.get(node.userData.l_id)
    let arr;

    let lineNode
    if (linkedObj[0] == 'line') {
      lineNode = linkedObj[1][2]
    } else if (linkedObj[0] == 'arc') {
      lineNode = linkedObj[1][3]
    }

    arr = children[objIdx.get(lineNode)].geometry.attributes.position.array
    let nextIdx
    if (linkedObj[1][0] == node.name) {
      nextIdx = 1
      for (let i = 0; i < arr.length; i += 3) {
        v2s.push(new THREE.Vector2(arr[i], arr[i + 1]))
      }
    } else {
      nextIdx = 0
      for (let i = arr.length - 3; i >= 0; i -= 3) {
        v2s.push(new THREE.Vector2(arr[i], arr[i + 1]))
      }
    }

    let d = children[
      objIdx.get(
        linkedObj[1][nextIdx]
      )
    ]
    if (d == children[2]) {
      // console.log('pair found')
    };
    findTouching(d)

  }


  function findTouching(node) {
    // console.log(node.name, 'yy')
    for (let t of node.userData.constraints) {
      // console.log(constraints.get(t)[2], node.name)
      if (constraints.get(t)[0] != 'points_coincident') continue
      for (let c of constraints.get(t)[2]) {
        if (c == -1) continue;
        const d = children[objIdx.get(c)]
        if (d == node) continue;
        if (d == children[2]) {
          // console.log('loop found')
        } else {
          // if (!visited.has(d)) {
          findPair(d)
          // }
        };
      }
    }
  }


  findPair(children[sketch.geomStartIdx + 1]) // ?? possibly allow user select search start point

  const shape = new THREE.Shape(v2s);
  // const extrudeSettings = { depth: Math.abs(depth), bevelEnabled: false };
  const extrudeSettings = { depth, bevelEnabled: false };


  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const material = new THREE.MeshPhongMaterial({
    color: color.mesh,
    emissive: color.emissive,
    // wireframe:true
  });

  const mesh = new THREE.Mesh(geometry, material)



  mesh.name = 'e' + this.mid++
  mesh.userData.type = 'mesh'
  mesh.userData.featureInfo = [sketch.obj3d.name, depth]
  mesh.layers.enable(1)

  const vertices = new THREE.Points(mesh.geometry, new THREE.PointsMaterial({ size: 0 }));
  vertices.userData.type = 'point'
  vertices.layers.enable(1)

  mesh.add(vertices)

  mesh.matrixAutoUpdate = false;
  mesh.matrix.multiply(sketch.obj3d.matrix)

  if (depth < 0) {
    flipBufferGeometryNormals(mesh.geometry)
    mesh.userData.inverted = true
  }


  if (!refresh) {
    this.obj3d.add(mesh)

    this.store.dispatch({ type: 'rx-extrusion', mesh, sketchId: sketch.obj3d.name })

    if (this.activeSketch == sketch) {
      sketch.deactivate()
    }
    this.render()
  } else {
    return mesh
  }

}


export function flipBufferGeometryNormals(geometry) {
  //https://stackoverflow.com/a/54496265
  const tempXYZ = [0, 0, 0];

  // flip normals
  for (let i = 0; i < geometry.attributes.normal.array.length / 9; i++) {
    // cache a coordinates
    tempXYZ[0] = geometry.attributes.normal.array[i * 9];
    tempXYZ[1] = geometry.attributes.normal.array[i * 9 + 1];
    tempXYZ[2] = geometry.attributes.normal.array[i * 9 + 2];

    // overwrite a with c
    geometry.attributes.normal.array[i * 9] =
      geometry.attributes.normal.array[i * 9 + 6];
    geometry.attributes.normal.array[i * 9 + 1] =
      geometry.attributes.normal.array[i * 9 + 7];
    geometry.attributes.normal.array[i * 9 + 2] =
      geometry.attributes.normal.array[i * 9 + 8];

    // overwrite c with stored a values
    geometry.attributes.normal.array[i * 9 + 6] = tempXYZ[0];
    geometry.attributes.normal.array[i * 9 + 7] = tempXYZ[1];
    geometry.attributes.normal.array[i * 9 + 8] = tempXYZ[2];
  }

  // change face winding order
  for (let i = 0; i < geometry.attributes.position.array.length / 9; i++) {
    // cache a coordinates
    tempXYZ[0] = geometry.attributes.position.array[i * 9];
    tempXYZ[1] = geometry.attributes.position.array[i * 9 + 1];
    tempXYZ[2] = geometry.attributes.position.array[i * 9 + 2];

    // overwrite a with c
    geometry.attributes.position.array[i * 9] =
      geometry.attributes.position.array[i * 9 + 6];
    geometry.attributes.position.array[i * 9 + 1] =
      geometry.attributes.position.array[i * 9 + 7];
    geometry.attributes.position.array[i * 9 + 2] =
      geometry.attributes.position.array[i * 9 + 8];

    // overwrite c with stored a values
    geometry.attributes.position.array[i * 9 + 6] = tempXYZ[0];
    geometry.attributes.position.array[i * 9 + 7] = tempXYZ[1];
    geometry.attributes.position.array[i * 9 + 8] = tempXYZ[2];
  }

  // flip UV coordinates
  for (let i = 0; i < geometry.attributes.uv.array.length / 6; i++) {
    // cache a coordinates
    tempXYZ[0] = geometry.attributes.uv.array[i * 6];
    tempXYZ[1] = geometry.attributes.uv.array[i * 6 + 1];

    // overwrite a with c
    geometry.attributes.uv.array[i * 6] =
      geometry.attributes.uv.array[i * 6 + 4];
    geometry.attributes.uv.array[i * 6 + 1] =
      geometry.attributes.uv.array[i * 6 + 5];

    // overwrite c with stored a values
    geometry.attributes.uv.array[i * 6 + 4] = tempXYZ[0];
    geometry.attributes.uv.array[i * 6 + 5] = tempXYZ[1];
  }

  geometry.attributes.normal.needsUpdate = true;
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.uv.needsUpdate = true;
}


