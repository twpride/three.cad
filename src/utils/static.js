import * as THREE from '../../node_modules/three/src/Three';



const _vec2 = new THREE.Vector2()
const _vec3 = new THREE.Vector3()


const raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.8;
raycaster.params.Points.threshold = 1.5;


const color = {
  dark1: 0x555555,
  hover: 0x00ff00,
  extrude: 0x156289,
  emissive: 0x072534
}

const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 2,
  color: color.dark1,
})


const pointMaterial = new THREE.PointsMaterial({
  color: color.dark1,
  size: 4,
})




const ptObj = (n) => new THREE.Points(
  new THREE.BufferGeometry().setAttribute('position',
    new THREE.Float32BufferAttribute(n || 3, 3)
  ),
  pointMaterial.clone()
);

const lineObj = (n=1) => new THREE.Line(
  new THREE.BufferGeometry().setAttribute('position',
    new THREE.Float32BufferAttribute(3 * (n+1), 3)
  ),
  lineMaterial.clone()
);


export { lineMaterial, pointMaterial, _vec2, _vec3, raycaster, color, ptObj, lineObj }