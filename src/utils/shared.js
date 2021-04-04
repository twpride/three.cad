import * as THREE from 'three/src/Three';



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


async function awaitPts(n) {
  let references = this.selected.slice()

  let end = false;
  while (references.length < n && !end) {
    let pt;
    let onEnd, onKey;
    try {
      pt = await new Promise((res, rej) => {
        onKey = (e) => e.key == 'Escape' && rej()
        onEnd = (e) => res(this.hovered[0])

        this.canvas.addEventListener('pointerdown', onEnd)
        window.addEventListener('keydown', onKey)
      })

      if (pt.name[0] == 'p') {
        references.push(pt)
      } else if (pt.name[0] == 'd') {
        references = [pt]
        end = true;
      }

    } catch (e) {
      end = true;
    }

    this.canvas.removeEventListener('pointerdown', onEnd)
    window.removeEventListener('keydown', onKey)
  }

  return references
}



export { lineMaterial, pointMaterial, _vec2, _vec3, raycaster, color, ptObj, lineObj, awaitPts }