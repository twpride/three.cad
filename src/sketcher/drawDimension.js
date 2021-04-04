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
  let pts = await this.awaitPts(2)

  if (pts.length != 2) return;

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

  line.userData.construction = true
  point.userData.construction = true

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

  const p1 = new THREE.Vector2(..._p1.geometry.attributes.position.array.slice(0, 2))
  const p2 = new THREE.Vector2(..._p2.geometry.attributes.position.array.slice(0, 2))
  const p3 = new THREE.Vector2()
  let dir, hyp, proj, perp, p1e, p2e, loc;

  return (e) => {
    loc = this.getLocation(e)
    p3.set(loc.x, loc.y)

    dir = p2.clone().sub(p1).normalize()
    hyp = p3.clone().sub(p1)
    proj = dir.multiplyScalar(hyp.dot(dir))
    perp = hyp.sub(proj)

    p1e = p1.clone().add(perp).toArray()
    p2e = p2.clone().add(perp).toArray()

    const linegeom = line.geometry.attributes.position.array
    linegeom.set(p1.toArray(), 0)
    linegeom.set(p1e, 3)

    linegeom.set(p1e, 6)
    linegeom.set(p2e, 9)

    linegeom.set(p2e, 12)
    linegeom.set(p2.toArray(), 15)

    linegeom.set(p1e, 18)
    linegeom.set(p3.toArray(), 21)

    point.geometry.attributes.position.set(p3.toArray())

    line.geometry.attributes.position.needsUpdate = true;
    point.geometry.attributes.position.needsUpdate = true;
    sc.render()
  }
}