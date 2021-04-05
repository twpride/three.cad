import * as THREE from '../../node_modules/three/src/Three';
import { color } from '../utils/shared'

const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 2,
  color: color.dimension,
})


const pointMaterial = new THREE.PointsMaterial({
  color: color.dimension,
  size: 4,
})


export async function drawDimension() {
  let pts = await this.awaitPts({ point: 2 })

  if (pts == null) return;

  const line = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(3 * 8, 3)
    ),
    lineMaterial.clone()
  );

  const point = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(3, 3)
    ),
    pointMaterial.clone()
  )

  line.userData.nids = pts.map(e => e.name)

  const groupLines = this.obj3d.children[1]

  groupLines.add(line)
  groupLines.add(point)

  const onMove = this._onMoveDimension(point, line)



  point.label = document.createElement('div');
  point.label.textContent = '10000';
  this.labelContainer.append(point.label)



  let onEnd, onKey;
  let add = await new Promise((res) => {
    onEnd = (e) => res(true)
    onKey = (e) => e.key == 'Escape' && res(false)

    this.canvas.addEventListener('pointermove', onMove)
    this.canvas.addEventListener('pointerdown', onEnd)
    window.addEventListener('keydown', onKey)
  })

  this.canvas.removeEventListener('pointermove', onMove)
  this.canvas.removeEventListener('pointerdown', onEnd)
  window.removeEventListener('keydown', onKey)
  point.geometry.computeBoundingSphere()
  line.geometry.computeBoundingSphere()
  if (add) {
    this.constraints.set(++this.c_id, //???
      [
        'pt_pt_distance', 10,
        [pts[0].name, pts[1].name, -1, -1]
      ]
    )
    pts[0].userData.constraints.push(this.c_id)
    pts[1].userData.constraints.push(this.c_id)

    this.updateOtherBuffers()

    line.name = this.c_id
    line.userData.type = 'dimension'
    point.name = this.c_id
    point.userData.type = 'dimension'


    
  } else {

    groupLines.splice(groupLines.length - 2).forEach(
      e => {
        e.geometry.dispose()
        e.material.dispose()
      }
    )
    sc.render()
  }

  return
}

const p1 = new THREE.Vector2()
const p2 = new THREE.Vector2()
const p3 = new THREE.Vector2()
let dir, hyp, proj, perp, p1e, p2e, nids, _p1, _p2, _p3;

export function _onMoveDimension(point, line) {

  nids = line.userData.nids

  _p1 = this.obj3d.children[sketcher.objIdx.get(nids[0])].geometry.attributes.position.array
  _p2 = this.obj3d.children[sketcher.objIdx.get(nids[1])].geometry.attributes.position.array

  p1.set(_p1[0], _p1[1])
  p2.set(_p2[0], _p2[1])

  let loc;

  return (e) => {
    loc = this.getLocation(e)

    p3.set(loc.x, loc.y)

    update(
      line.geometry.attributes.position,
      point.geometry.attributes.position
    )

    point.userData.offset = hyp.toArray()

    sc.render()
  }
}


export function updateDimLines() {


  const groupLines = this.obj3d.children[1].children

  for (let i = 0; i < groupLines.length; i += 2) {

    nids = groupLines[i].userData.nids

    _p1 = this.obj3d.children[sketcher.objIdx.get(nids[0])].geometry.attributes.position.array
    _p2 = this.obj3d.children[sketcher.objIdx.get(nids[1])].geometry.attributes.position.array
    _p3 = groupLines[i + 1].geometry.attributes.position.array
    const offset = groupLines[i + 1].userData.offset

    p1.set(_p1[0], _p1[1])
    p2.set(_p2[0], _p2[1])
    p3.set(_p1[0] + offset[0], _p1[1] + offset[1])


    update(
      groupLines[i].geometry.attributes.position,
      groupLines[i + 1].geometry.attributes.position
    )
  }

}

function update(linegeom, pointgeom) {
  dir = p2.clone().sub(p1).normalize()
  hyp = p3.clone().sub(p1)
  proj = dir.multiplyScalar(hyp.dot(dir))
  perp = hyp.clone().sub(proj)

  p1e = p1.clone().add(perp).toArray()
  p2e = p2.clone().add(perp).toArray()

  linegeom.array.set(p1.toArray(), 0)
  linegeom.array.set(p1e, 3)

  linegeom.array.set(p1e, 6)
  linegeom.array.set(p2e, 9)

  linegeom.array.set(p2e, 12)
  linegeom.array.set(p2.toArray(), 15)

  linegeom.array.set(p1e, 18)
  linegeom.array.set(p3.toArray(), 21)

  linegeom.needsUpdate = true;

  pointgeom.array.set(p3.toArray())
  pointgeom.needsUpdate = true;
}