

import * as THREE from "../node_modules/three/src/Three"


class AxesHelper extends THREE.Object3D {

  constructor(initialZoom = 1) {
    super()
    this.matrixAutoUpdate = false
    this.initialZoom = initialZoom
    this.length = [0.55, 1]
    this.headLength = 0.25
    this.headWidth = 0.12

    this.dirs = [
      [1, 0, 0],
      [0, 1, 0]
    ]

    this.add(...this.dirs.map(
      (dir, i) => new THREE.ArrowHelper(
        new THREE.Vector3(...dir), // dir
        new THREE.Vector3(0, 0, 0), // origin
        this.length[i], //length
        0x0000ff,
        this.headLength,
        this.headWidth
      )
    ))

    return this
  }

  resize(zoom) {
    const scale = this.initialZoom / zoom

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
