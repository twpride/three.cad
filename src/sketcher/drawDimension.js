import * as THREE from '../../node_modules/three/src/Three';

const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 2,
  color: 0x156289,
})


const pointMaterial = new THREE.PointsMaterial({
  color: 0x156289,
  size: 4,
})


export async function drawDimension() {
  let pts = await this.awaitPts({ p: 2 })

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
  const groupPts = this.obj3d.children[2]
  groupLines.add(line)
  groupPts.add(point)

  const onMove = this._onMoveDimension(...pts, point, line)

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
    point.name = this.c_id

  } else {

    [groupLines.splice(groupLines.length - 1),
    groupPts.splice(groupLines.length - 1)].forEach(
      e => {
        e.geometry.dispose()
        e.material.dispose()
      }
    )
    sc.render()
  }



  return
}


export function _onMoveDimension(_p1, _p2, point, line) {

  p1.set(..._p1.geometry.attributes.position.array.slice(0, 2))
  p2.set(..._p2.geometry.attributes.position.array.slice(0, 2))

  let dir, hyp, proj, perp, p1e, p2e, loc;

  return (e) => {
    loc = this.getLocation(e)

    p3.set(loc.x, loc.y)


    const linegeom = line.geometry.attributes.position
    const pointgeom = point.geometry.attributes.position

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


    point.userData.offset = hyp.toArray()

    sc.render()
  }
}

const p1 = new THREE.Vector2()
const p2 = new THREE.Vector2()
const p3 = new THREE.Vector2()

export function updateDimLines() {


  let dir, hyp, proj, perp, p1e, p2e;
  let nids, _p1, _p2, _p3, offset;

  const groupLines = this.obj3d.children[1].children
  const groupPts = this.obj3d.children[2].children

  for (let i = 0; i < groupLines.length; i++) {

    nids = groupLines[i].userData.nids
    // console.log(sketcher.objIdx.get(nid[0]), 'heeeeeeee')

    _p1 = this.obj3d.children[sketcher.objIdx.get(nids[0])].geometry.attributes.position.array
    _p2 = this.obj3d.children[sketcher.objIdx.get(nids[1])].geometry.attributes.position.array
    _p3 = groupPts[i].geometry.attributes.position.array
    offset = groupPts[i].userData.offset

    p1.set(_p1[0], _p1[1])
    p2.set(_p2[0], _p2[1])
    p3.set(_p1[0] + offset[0], _p1[1] + offset[1])


    const linegeom = groupLines[i].geometry.attributes.position
    const pointgeom = groupPts[i].geometry.attributes.position

    dir = p2.clone().sub(p1).normalize()
    hyp = p3.clone().sub(p1)
    proj = dir.multiplyScalar(hyp.dot(dir))
    perp = hyp.sub(proj)

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

}
