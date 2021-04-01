import * as THREE from '../node_modules/three/src/Three';




export function add3DPoint(e) {

  // const mouse = new THREE.Vector2(
  //   (e.clientX / window.innerWidth) * 2 - 1,
  //   - (e.clientY / window.innerHeight) * 2 + 1
  // )

  // console.log(new THREE.Vector3(mouse.x, mouse.y, 0).unproject(this.camera))

  // this.raycaster.ray.intersectPlane(this.plane, this.target).applyMatrix4(this.inverse)

  this.raycaster.setFromCamera(
    new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      - (e.clientY / window.innerHeight) * 2 + 1
    ),
    this.camera
  );

  // const hoverPts = this.raycaster.intersectObjects(this.sketch.children)
  const hoverPts = this.raycaster.intersectObjects(this.sketch.children)

  console.log(hoverPts)

  let idx = []
  if (hoverPts.length) {
    let minDist = Infinity;
    for (let i = 0; i < hoverPts.length; i++) {
      if (!hoverPts[i].distanceToRay) continue;
      if (hoverPts[i].distanceToRay < minDist) {
        minDist = hoverPts[i].distanceToRay
        idx = [i]
      } else if (hoverPts[i].distanceToRay == minDist) {
        idx.push(i)
      }
    }
    if (!idx.length) idx.push(0)
  }

  if (idx.length) {
    if (hoverPts[idx[0]].object != this.hovered[0]) {

      for (let ob of this.hovered) {
        if (ob && !this.selected.includes(ob)) {
          ob.material.color.set(0x555555)
        }
      }
      this.hovered = []

      for (let i of idx) {
        hoverPts[i].object.material.color.set(0x00FFFF)
        this.hovered.push(hoverPts[i].object)
      }
      // console.log('render1')
      this.render()
    }
  } else {
    if (this.hovered.length) {
      for (let ob of this.hovered) {
        if (ob && !this.selected.includes(ob)) {
          ob.material.color.set(0x555555)
        }
      }
      this.hovered = []
      // console.log('render2')
      this.render()
    }
  }
}
