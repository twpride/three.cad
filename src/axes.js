

import * as THREE from "../node_modules/three/src/Three"


class AxesHelper extends THREE.Object3D {

  constructor(initialZoom = 1) {
    super()
    this.matrixAutoUpdate = false
    this.initialZoom = initialZoom
    this.length = [5.5, 10]
    this.headLength = 2.5
    this.headWidth = 1.2

    this.dirs = [
      [1, 0, 0],
      [0, 1, 0]
    ]

    this.add(...this.dirs.map(
      (dir, i) => new THREE.ArrowHelper(
        new THREE.Vector3(...dir), // dir
        new THREE.Vector3(0, 0, 0), // origin
        this.length[i], //length
        0xcc1f1a,
        this.headLength,
        this.headWidth
      )
    ))

    return this
  }

  resize(zoom, canvH) {
    const scale = this.initialZoom / zoom * 1000/canvH

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setLength(
        this.length[i] * scale,
        this.headLength * scale,
        this.headWidth * scale
      )
    }
  }

}


export { AxesHelper };
