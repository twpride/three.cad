import * as THREE from 'three/src/Three'

export function onHover(e) {
  if (this.mode || e.buttons) return
  if (this.hovered && !this.selected.has(this.hovered)) {
    this.hovered.material.color.set(0x555555)
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
    let idx = 0
    for (let i = 0; i < hoverPts.length; i++) {
      if (hoverPts[i].distanceToRay && hoverPts[i].distanceToRay <= minDist) {
        minDist = hoverPts[i].distanceToRay
        idx = i
      }
    }

    hoverPts[idx].object.material.color.set(0xff0000)
    this.hovered = hoverPts[idx].object
    this.dispatchEvent({ type: 'change' })
    return
  }


  if (this.hovered) {
    this.hovered = null;
    this.dispatchEvent({ type: 'change' })
  }

}


export function onPick(e) {
  if (this.mode || e.buttons != 1) return

  if (this.hovered) {
    this.selected.add(this.hovered)
    if (this.hovered.type === "Points") {
      this.grabPtIdx = this.children.indexOf(
        this.hovered
      )
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

  this.ptsBuf.set(
    mouseLoc,
    this.objIdx.get(this.children[this.grabPtIdx].id) * 3
  )

  this.solve()
  this.dispatchEvent({ type: 'change' })
}


export function onRelease() {
  this.domElement.removeEventListener('pointermove', this.onDrag)
  this.domElement.removeEventListener('pointerup', this.onRelease)
  this.children[this.grabPtIdx].geometry.computeBoundingSphere()
}

