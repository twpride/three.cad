import * as THREE from '../node_modules/three/src/Three';
import { color } from './shared'
export function extrude(sketch, depth) {
  console.log(sketch, 'here')

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
      if (d == children[4]) {
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
        if (d == children[4]) {
          console.log('loop found')
        } else {
          if (!visited.has(d)) {
            findPair(d)
          }
        };
      }
    }
  }


  findPair(children[4]) //??? need fixing

  const shape = new THREE.Shape(v2s);
  // const extrudeSettings = { depth: Math.abs(depth), bevelEnabled: false };
  const extrudeSettings = { depth, bevelEnabled: false };


  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // const material = new THREE.MeshLambertMaterial({
  // const material = new THREE.MeshPhongMaterial({
  //   color: color.mesh,
  //   emissive: color.emissive,
  // });

  // const mesh = new THREE.Mesh(geometry, material)

  // const material = new THREE.MeshPhongMaterial({
  //   color: color.mesh,
  // });
  // const wireframe = new THREE.EdgesGeometry( geometry );
  // const mesh = new THREE.LineSegments( wireframe );
  // // mesh.material.depthTest = false;
  // // mesh.material.opacity = 0.25;
  // // mesh.material.transparent = true;
  // mesh.material.transparent = false;

  const edges = new THREE.EdgesGeometry( geometry, 15 );
  edges.type  = 'BufferGeometry'
  edges.parameters = undefined

  const mesh = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );



  mesh.name = 'e' + this.mid++
  // mesh.name = 'm' + sketch.obj3d.name.slice(1)
  // mesh.name = 'e' + sketch.obj3d.name.slice(1)
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


  this.obj3d.add(mesh)

  this.store.dispatch({ type: 'rx-extrusion', mesh, sketchId: sketch.obj3d.name })

  // sketch.userData
  if (this.activeSketch == sketch) {
    this.activeSketch = null
    sketch.deactivate()
  }

  // this.clearSelection()
  this.render()
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


