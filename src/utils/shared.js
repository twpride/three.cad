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


async function awaitPts(...criteria) {

  function fullfilled() {
    for (let i = criteria.length - 1; i >= 0; i--) {
      const crit = criteria[i]
      let nfilled = 0;
      for (let k in counter) {
        if (!crit[k] || counter[k] > crit[k]) {
          criteria.splice(i, 1)
          break;
        } else if (counter[k] == crit[k]) {
          nfilled += 1
        }
      }
      if (nfilled == Object.keys(crit).length) return true
    }
    return false
  }

  const counter = {}

  let references = this.selected.slice()

  for (let ob of references) {
    const type = ob.name[0]
    if (counter[type]) {
      counter[type] += 1;
    } else {
      counter[type] = 1;
    }
  }
  if (fullfilled()) return references

  let end = false;
  while (criteria.length && !end) {
    let pt;
    let onEnd, onKey;
    try {

      pt = await new Promise((res, rej) => {
        onKey = (e) => e.key == 'Escape' && rej()
        onEnd = (e) => this.hovered.length && res(this.hovered[0])
        this.canvas.addEventListener('pointerdown', onEnd)
        window.addEventListener('keydown', onKey)
      })

      references.push(pt)
      const type = pt.name[0]
      if (counter[type]) {
        counter[type] += 1;
      } else {
        counter[type] = 1;
      }

      if (fullfilled()) return references

    } catch (e) {
      end = true;
    }

    this.canvas.removeEventListener('pointerdown', onEnd)
    window.removeEventListener('keydown', onKey)
  }
  
  console.log('fail')
  return null
}



export { lineMaterial, pointMaterial, _vec2, _vec3, raycaster, color, ptObj, lineObj, awaitPts }