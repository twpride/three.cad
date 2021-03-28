import * as THREE from '../../node_modules/three/src/Three';

export function extrude() {



  let constraints = this.constraints;
  let linkedObjs = this.linkedObjs;
  let children = this.children;
  let visited = new Set()
  let v2s = []

  function findPair(node) {
    visited.add(node)
    let linkedObj = linkedObjs.get(node.l_id)
    let arr;
    if (linkedObj[0] == 'line') {
      arr = linkedObj[1][2].geometry.attributes.position.array
    } else if (linkedObj[0] == 'arc') {
      arr = linkedObj[1][3].geometry.attributes.position.array
    }
    for (let i = 0; i < arr.length; i += 3) {
      v2s.push(new THREE.Vector2(arr[i], arr[i + 1]))
    }

    for (let i = 0; i < 2; i++) {
      let d = linkedObj[1][i]
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
      for (let d of constraints.get(t)[2]) {
        if (d == -1 || d == node) continue;
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
  const mesh = new THREE.Mesh(geometry, phong);


  const wireframe = new THREE.WireframeGeometry(geometry);




  const pointMaterial = new THREE.PointsMaterial({
    color: 0x555555,
    size: 4,
  })




  const pts = new THREE.Points(wireframe, pointMaterial);
  this.add(pts)



  // const line = new THREE.LineSegments( wireframe );
  // line.material.depthTest = true;
  // line.material.linewidth = 4;

  // line.material.opacity = 0.25;
  // // line.material.transparent = true;
  // line.material.transparent = false;
  // this.add(line)

  this.add(mesh)
  this.dispatchEvent({ type: 'change' })
  // this.visible = false
}



