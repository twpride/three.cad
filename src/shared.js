import * as THREE from '../node_modules/three/src/Three';



const _vec2 = new THREE.Vector2()
const _vec3 = new THREE.Vector3()


const raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.1;
raycaster.params.Points.threshold = 0.1;


const color = {
  background: 0x18181B,
  lighting: 0xFFFFFF,
  emissive: 0x072534,
  meshTempHover: 0x9DCFED,

  point: 0xffffff, 
  selpoint: 0xff0000, 
  line: 0xffffff, 
  mesh: 0x9DCFED, 
  dimension: 0x0000ff, 

  plane: 0xffff00, 
  planeBorder: 0x2e2e00, 
  opacity: 0.02
}

const hoverColor = {
  emissive: 0x343407,
  point: 0x00ff00,
  selpoint: 0xff0000,
  line: 0x00ff00, 
  mesh: 0xFAB601, 
  dimension: 0x00ff00, 

  plane: 0xffff00, 
  planeBorder: 0x919100,
  opacity: 0.06
}


const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 1,
  color: color.line,
})


const pointMaterial = new THREE.PointsMaterial({
  color: color.point,
  size: 4,
})


const ptObj = (n, visibility = true) => {
  const ret = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(n || 3, 3)
    ),
    pointMaterial.clone()
  );
  ret.name = "p" + id++
  ret.userData.type = 'point'
  ret.visible = visibility
  return ret
}

const lineObj = (n = 1) => {
  const ret = new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(3 * (n + 1), 3)
    ),
    lineMaterial.clone()
  );
  ret.name = 'l' + id++
  ret.userData.type = 'line'
  return ret
}


async function awaitSelection(...criteria) {

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
    const type = ob.userData.type
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
      const type = pt.userData.type
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

window.rc = raycaster


export { lineMaterial, pointMaterial, _vec2, _vec3, raycaster, color, hoverColor, ptObj, lineObj, awaitSelection }