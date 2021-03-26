import * as THREE from 'three/src/Three'

export function onHover(e) {
  if (this.mode || e.buttons) return

  if (this.hovered.length) {
    for (let ob of this.hovered) {
      if (ob && !this.selected.has(ob)) {
        ob.material.color.set(0x555555)
      }
    }
    this.hovered = []
    // this.dispatchEvent({ type: 'change' })
  }

  this.raycaster.setFromCamera(
    new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      - (e.clientY / window.innerHeight) * 2 + 1
    ),
    this.camera
  );

  const hoverPts = this.raycaster.intersectObjects(this.children)

  // console.log(hoverPts)
  if (hoverPts.length) {
    let minDist = Infinity;
    let idx = []
    for (let i = 0; i < hoverPts.length; i++) {
      if (!hoverPts[i].distanceToRay) continue;
      if (hoverPts[i].distanceToRay < minDist) {
        minDist = hoverPts[i].distanceToRay
        idx = [i]
      } else if (hoverPts[i].distanceToRay == minDist) {
        idx.push(i)
      }
    }


    // if (!idx.length) idx.push(0)

    for (let i of idx) {
      hoverPts[i].object.material.color.set(0x00ff00)
      // hoverPts[i].object.material.color.set(0xff0000)
      this.hovered.push(hoverPts[i].object)
    }
    this.dispatchEvent({ type: 'change' })
    return
  }

}


export function onPick(e) {
  if (this.mode || e.buttons != 1) return

  if (this.hovered.length) {

    for (let h of this.hovered) {
      this.selected.add(h)
    }

    if (this.hovered[0].type == "Points") {
      this.domElement.addEventListener('pointermove', this.onDrag);
      this.domElement.addEventListener('pointerup', this.onRelease)
    }
  } else {
    for (let obj of this.selected) {
      obj.material.color.set(0x555555)
    }
    this.dispatchEvent({ type: 'change' })
    this.selected.clear()
  }
}

export function onDrag(e) {
  const mouseLoc = this.getLocation(e);

  for (let h of this.hovered) {
    this.ptsBuf.set(
      mouseLoc,
      this.objIdx.get(h.id) * 3
    )
  }

  this.solve()
  this.dispatchEvent({ type: 'change' })
}


export function onRelease() {
  this.domElement.removeEventListener('pointermove', this.onDrag)
  this.domElement.removeEventListener('pointerup', this.onRelease)

  for (let ii of this.hovered) {
    ii.geometry.computeBoundingSphere()
  }

}

