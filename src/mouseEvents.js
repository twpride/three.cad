import * as THREE from '../node_modules/three/src/Three';
import { raycaster, color, hoverColor } from './shared';


let ptLoc

export function onHover(e) {
  if (this.mode || e.buttons) return

  raycaster.setFromCamera(
    new THREE.Vector2(
      (e.clientX - this.rect.left) / this.rect.width * 2 - 1,
      - (e.clientY - this.rect.top) / this.rect.height * 2 + 1
    ),
    this.camera
  );

  let hoverPts;

  if (this.obj3d.userData.type != 'sketch') {
    this.obj3d.children[0].children[0].visible = false
    raycaster.layers.set(1)
    hoverPts = raycaster.intersectObjects(this.obj3d.children, true)
  } else {
    raycaster.layers.set(0)
    hoverPts = raycaster.intersectObjects([...this.obj3d.children[1].children, ...this.obj3d.children])
  }


  let idx = []
  if (hoverPts.length) {

    let minDist = Infinity;
    for (let i = 0; i < hoverPts.length; i++) {
      if (!hoverPts[i].distanceToRay) continue;
      if (hoverPts[i].distanceToRay < minDist - 0.0001) {
        idx = [i]

        if (this.obj3d.userData.type != 'sketch') break

        minDist = hoverPts[i].distanceToRay
      } else if (Math.abs(hoverPts[i].distanceToRay - minDist) < 0.0001) {
        idx.push(i)
      }
    }

    if (!idx.length) {
      idx.push(0)
    }

  }


  if (idx.length) { // after filtering, if hovered objs still exists

    console.log(hoverPts)
    if (hoverPts[idx[0]].object != this.hovered[0]) { // if the previous hovered obj is not the same as current

      for (let x = 0; x < this.hovered.length; x++) { // first clear old hovers that are not selected
        const obj = this.hovered[x]
        if (!this.selected.includes(obj)) {
          if (typeof obj == 'object') {
            obj.material.color.set(color[obj.userData.type])
            if (this.obj3d.userData.type != 'sketch') {
              if (obj.userData.type == 'mesh') {
                obj.children[0].material.color.set(color['line'])
              }
            }
          }
        }
      }

      this.hovered = []

      for (let x = 0; x < idx.length; x++) {
        let obj = hoverPts[idx[x]].object

        if (this.obj3d.userData.type == 'sketch') {
          obj.material.color.set(hoverColor[obj.userData.type])
        } else {

          if (obj.userData.type == 'mesh') {
            obj.children[0].material.color.set(hoverColor['line'])
          } else if (obj.userData.type == 'plane') {
            obj.material.color.set(hoverColor[obj.userData.type])
          } else if (obj.userData.type == 'point') {

            ptLoc = obj.geometry.attributes.position.array
              .slice(
                3 * hoverPts[idx[x]].index,
                3 * hoverPts[idx[x]].index + 3
              )

            // const pp = this.obj3d.children[0].children[this.fptIdx % 3]
            const pp = this.obj3d.children[0].children[0]
            pp.geometry.attributes.position.array.set(ptLoc)
            pp.matrix = obj.parent.matrix
            pp.geometry.attributes.position.needsUpdate = true
            pp.visible = true

            obj = hoverPts[idx[x]].index

          }

        }


        this.hovered.push(obj)
      }

      // console.log('render1')
      this.obj3d.dispatchEvent({ type: 'change' })
    }
  } else { // no hovered object after filtering
    if (this.hovered.length) { // if previously something was hovered, then we need to clear it


      for (let x = 0; x < this.hovered.length; x++) {
        const obj = this.hovered[x]
        if (!this.selected.includes(obj)) {
          if (typeof obj == 'object') {
            obj.material.color.set(color[obj.userData.type])
            if (this.obj3d.userData.type != 'sketch') {
              if (obj.userData.type == 'mesh') {
                obj.children[0].material.color.set(color['line'])
              }
            }
          }
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
    let obj = this.hovered[this.hovered.length - 1]


    if (this.obj3d.userData.type == 'sketch') {
      this.selected.push(obj)
    } else {
      if (typeof obj == 'object') {
        if (obj.userData.type == "mesh") {
          obj.material.color.set(hoverColor[obj.userData.type])
        }
      } else {
        const pp = this.obj3d.children[0].children[this.fptIdx % 3 + 1]
        const p0 = this.obj3d.children[0].children[0]

        pp.geometry.attributes.position.array.set(p0.geometry.attributes.position.array)
        pp.matrix = p0.matrix
        pp.geometry.attributes.position.needsUpdate = true
        pp.visible = true

        obj = pp
        this.fptObj[obj] = this.fptIdx
        this.fptIdx++
      }
      this.obj3d.dispatchEvent({ type: 'change' })
      this.selected.push(obj)
      return;
    }

    switch (obj.userData.type) {
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
      if (this.obj3d.userData.type != 'sketch') {
        if (obj.userData.type == 'mesh') {
          obj.children[0].material.color.set(color['line'])
        } else if (obj.userData.type == 'point') {
          obj.visible = false
        }
      }
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

