import * as THREE from '../../node_modules/three/src/Three';



const _vec2 = new THREE.Vector2()
const _vec3 = new THREE.Vector3()


const raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.8;
raycaster.params.Points.threshold = 0.6;


const color = {
  hover: 0x00ff00,
  lighting: 0xFFFFFF,
  emissive: 0x072534,
  d: 0xf5bc42, //datums: planes
  p: 0x555555, //points
  l: 0x555555, //lines
  m: 0x156289, //mesh: extrude
}

const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 2,
  color: color.l,
})


const pointMaterial = new THREE.PointsMaterial({
  color: color.p,
  size: 4,
})


const ptObj = (n) => {
  const ret = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(n || 3, 3)
    ),
    pointMaterial.clone()
  );
  ret.name = 'p' + nid++
  return ret
}

const lineObj = (n = 1) => {
  const ret = new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(3 * (n + 1), 3)
    ),
    lineMaterial.clone()
  );
  ret.name = 'l' + nid++
  return ret
}


export { lineMaterial, pointMaterial, _vec2, _vec3, raycaster, color, ptObj, lineObj }