import * as THREE from '../../node_modules/three/src/Three';

const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 2,
  color: 0x555555,
})


const pointMaterial = new THREE.PointsMaterial({
  color: 0x555555,
  size: 4,
})

const _vec2 = new THREE.Vector2()
const _vec3 = new THREE.Vector3()


const raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.8;
raycaster.params.Points.threshold = 1.5;


export { lineMaterial, pointMaterial, _vec2, _vec3, raycaster }