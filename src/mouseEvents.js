import * as THREE from '../node_modules/three/src/Three';
import { raycaster, color, hoverColor } from './shared';

export function onHover(e) {
  if (this.mode || e.buttons) return

  raycaster.setFromCamera(
    new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      - (e.clientY / window.innerHeight) * 2 + 1
    ),
    this.camera
  );

  let hoverPts;
  let idx = []

  if (this.obj3d.userData.type == 'sketch') {
    hoverPts = raycaster.intersectObjects([...this.obj3d.children[1].children, ...this.obj3d.children])

    if (hoverPts.length) {

      let minDist = Infinity;
      for (let i = 0; i < hoverPts.length; i++) {
        if (!hoverPts[i].distanceToRay) continue;
        if (hoverPts[i].distanceToRay < minDist - 0.0001) {
          minDist = hoverPts[i].distanceToRay
          idx = [i]
        } else if (Math.abs(hoverPts[i].distanceToRay - minDist) < 0.0001) {
          idx.push(i)
        }
      }


      // console.log(hoverPts, idx)
      if (!idx.length) idx.push(0)
    }


  } else {
    // hoverPts = raycaster.intersectObjects(this.obj3d.children)
    hoverPts = raycaster.intersectObjects(this.obj3d.children, true)

    if (hoverPts.length) {

      // for (let i = 0; i < hoverPts.length; i++) {
      //   const obj = hoverPts[i].object
      //   if (['point', 'plane'].includes(obj.userData.type)) {
      //     idx.push(i)
      //     break;
      //   }
      // }
      // console.log(hoverPts)


      let minDist = Infinity;
      for (let i = 0; i < hoverPts.length; i++) {
        if (!hoverPts[i].distanceToRay) continue;

        if (hoverPts[i].distanceToRay < minDist - 0.0001) {
          minDist = hoverPts[i].distanceToRay
          idx = [i]
        } else if (Math.abs(hoverPts[i].distanceToRay - minDist) < 0.0001) {
          idx.push(i)
        }
      }




      if (!idx.length) {
        const obj = hoverPts[0].object
        if (obj.userData.type == "mesh" && obj.visible) {
          idx.push(0)
        } else if (['point', 'plane'].includes(obj.userData.type)) {
          idx.push(0)
        }
      }

    }



  }



  if (idx.length) { // after filtering, hovered objs still exists
    if (hoverPts[idx[0]].object != this.hovered[0]) { // if the previous hovered obj is not the same as current

      for (let x = 0; x < this.hovered.length; x++) {
        const obj = this.hovered[x]
        if (obj && !this.selected.includes(obj)) {
          obj.material.color.set(color[obj.userData.type])
        }
      }

      this.hovered = []

      for (let x = 0; x < idx.length; x++) {
        const obj = hoverPts[idx[x]].object
        obj.material.color.set(hoverColor[obj.userData.type])
        this.hovered.push(obj)
      }

      // console.log('render1')
      this.obj3d.dispatchEvent({ type: 'change' })
    }
  } else { // no hovered object after filtering
    if (this.hovered.length) { // if previously something was hovered, then we need to clear it
      for (let x = 0; x < this.hovered.length; x++) {
        const obj = this.hovered[x]
        // console.log(obj, 'here')
        if (!this.selected.includes(obj)) {
          obj.material.color.set(color[obj.userData.type])
        }
      }
      this.hovered = []

      // console.log('render2')
      this.obj3d.dispatchEvent({ type: 'change' })
    }
  }
}

let draggedLabel;
export function onPick(e) {
  if (this.mode || e.buttons != 1) return

  if (this.hovered.length) {

    this.selected.push(this.hovered[this.hovered.length - 1])

    switch (this.hovered[0].userData.type) {
      case 'dimension':
        const idx = this.obj3d.children[1].children.indexOf(this.hovered[0])
        if (idx % 2) {

          this.onDragDim = this._onMoveDimension(
            this.obj3d.children[1].children[idx],
            this.obj3d.children[1].children[idx - 1],
          )
          this.canvas.addEventListener('pointermove', this.onDragDim);
          this.canvas.addEventListener('pointerup', this.onRelease)
        }

        draggedLabel = this.obj3d.children[1].children[idx].label
        draggedLabel.style.zIndex = -1;
        break;
      case 'point':

        this.canvas.addEventListener('pointermove', this.onDrag);
        this.canvas.addEventListener('pointerup', this.onRelease)
        break;

      default:
        break;
    }

  } else {
    for (let x = 0; x < this.selected.length; x++) {
      const obj = this.selected[x]
      obj.material.color.set(color[obj.userData.type])
    }
    this.obj3d.dispatchEvent({ type: 'change' })
    this.selected = []
  }
}

export function onDrag(e) {

  // const obj = this.hovered[this.hovered.length-1]
  // this.ptsBuf.set(
  //   this.getLocation(e).toArray(),
  //   this.objIdx.get(obj.name) * 3
  // )


  for (let x = 0; x < this.hovered.length; x++) {
    const obj = this.hovered[x]
    this.ptsBuf.set(
      this.getLocation(e).toArray(),
      this.objIdx.get(obj.name) * 3
    )
  }

  this.solve()
  this.obj3d.dispatchEvent({ type: 'change' })
}


export function onRelease() {
  this.canvas.removeEventListener('pointermove', this.onDrag)
  this.canvas.removeEventListener('pointermove', this.onDragDim)
  this.canvas.removeEventListener('pointerup', this.onRelease)

  // for (let x = 3; x < this.obj3d.children.length; x++) {
  //   const obj = this.obj3d.children[x]
  //   obj.geometry.computeBoundingSphere()
  // }

  // for (let x = 0; x < this.obj3d.children[1].children.length; x++) {
  //   const obj = this.obj3d.children[1].children[x]
  //   obj.geometry.computeBoundingSphere()
  // }

  this.updateBoundingSpheres()
  if (draggedLabel) {
    draggedLabel.style.zIndex = 0;
  }
}

