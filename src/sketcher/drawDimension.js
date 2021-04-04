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
  let pts;
  // try {

  //   pts = await this.awaitPts(2)
  // } catch {

  // }

  pts = await this.awaitPts(2)
  console.log('here', pts)




  const p1 = new THREE.Vector2(...pts[0].geometry.attributes.position.array.slice(0, 2))
  const p2 = new THREE.Vector2(...pts[1].geometry.attributes.position.array.slice(0, 2))
  const p3 = new THREE.Vector2()

  const lineGeom = new THREE.Float32BufferAttribute(3 * 8, 3)
  const line = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute('position',
      lineGeom
    ),
    lineMaterial.clone()
  );

  const ptGeom = new THREE.Float32BufferAttribute(3, 3)
  const point = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
      ptGeom
    ),
    pointMaterial.clone()
  )

  this.obj3d.children[0].add(line)
  this.obj3d.children[0].add(point)


  let dir, hyp, proj, perp, p1e, p2e, loc;
  const onMove = (e) => {
    loc = this.getLocation(e)
    p3.set(loc.x, loc.y)

    dir = p2.clone().sub(p1).normalize()
    hyp = p3.clone().sub(p1)
    proj = dir.multiplyScalar(hyp.dot(dir))
    perp = hyp.sub(proj)

    p1e = p1.clone().add(perp).toArray()
    p2e = p2.clone().add(perp).toArray()

    lineGeom.set(p1.toArray(), 0)
    lineGeom.set(p1e, 3)

    lineGeom.set(p1e, 6)
    lineGeom.set(p2e, 9)

    lineGeom.set(p2e, 12)
    lineGeom.set(p2.toArray(), 15)

    lineGeom.set(p1e, 18)
    lineGeom.set(p3.toArray(), 21)

    ptGeom.set(p3.toArray())

    line.geometry.attributes.position.needsUpdate = true;
    point.geometry.attributes.position.needsUpdate = true;
    sc.render()
  }





  let onEnd, onKey;

  let ret = await new Promise((res, rej) => {

    onEnd = (e) => {
      res(true)
      this.updateOtherBuffers()
    }
    onKey = (e) => {
      if (e.key == 'Escape') res(false)
    }
    this.canvas.addEventListener('pointermove', onMove)
    this.canvas.addEventListener('pointerdown', onEnd)
    window.addEventListener('keydown', onKey)
  })


  console.log(ret, 'here')
  this.canvas.removeEventListener('pointermove', onMove)
  this.canvas.removeEventListener('pointerdown', onEnd)
  this.canvas.removeEventListener('keydown', onKey)

  // this.constraints.set(++this.c_id, //???
  //   [
  //     'pt_pt_distance', 10,
  //     [_p1.name, _p2.name, -1, -1]
  //   ]
  // )
  // _p1.userData.constraints.push(this.c_id)
  // _p2.userData.constraints.push(this.c_id)






  return
}

