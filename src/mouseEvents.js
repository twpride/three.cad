import * as THREE from 'three/src/Three';
import {raycaster} from './utils/static';

export function onHover(e) {
  if (this.mode || e.buttons) return
  raycaster.setFromCamera(
    new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      - (e.clientY / window.innerHeight) * 2 + 1
    ),
    this.camera
  );

  const hoverPts = raycaster.intersectObjects(this.scene.children)

  
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

      for (let x = 0; x < this.hovered.length; x++) {
        const obj = this.hovered[x]
        if (obj && !this.selected.has(obj)) {
          obj.material.color.set(0x555555)
        }
      }
      this.hovered = []

      for (let x = 0; x < idx.length; x++) {
        const i = idx[x]
        hoverPts[i].object.material.color.set(0x00ff00)
        this.hovered.push(hoverPts[i].object)
      }

      // console.log('render1')
      this.render()
    }
  } else {
    if (this.hovered.length) {

      for (let x = 0; x < this.hovered.length; x++) {
        const obj = this.hovered[x]
        if (obj && !this.selected.has(obj)) {
          obj.material.color.set(0x555555)
        }
      }
      this.hovered = []

      // console.log('render2')
      this.render()
    }
  }
}


export function onPick(e) {
  if (this.mode || e.buttons != 1) return

  if (this.hovered.length) {

    for (let x = 0; x < this.hovered.length; x++) {
      const obj = this.hovered[x]
      this.selected.add(obj)
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

  for (let x = 0; x < this.hovered.length; x++) {
    const obj = this.hovered[x]
    this.ptsBuf.set(
      mouseLoc,
      this.objIdx.get(obj.id) * 3
    )
  }

  this.solve()
  this.dispatchEvent({ type: 'change' })
}


export function onRelease() {
  this.domElement.removeEventListener('pointermove', this.onDrag)
  this.domElement.removeEventListener('pointerup', this.onRelease)

  for (let x = 0; x < this.hovered.length; x++) {
    const obj = this.hovered[x]
    obj.geometry.computeBoundingSphere()
  }

}

