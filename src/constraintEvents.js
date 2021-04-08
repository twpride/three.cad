

export function setCoincident() {
  const s = new Set()
  const toComb = []
  for (let node of this.selected) {
    const xc = node.geometry.attributes.position.array[0]
    if (!s.has(xc)) {
      toComb.push(node)
      s.add(xc)
    }
  }

  for (let i = 1; i < toComb.length; i++) {
    this.constraints.set(++this.c_id,
      [
        'points_coincident', -1,
        [toComb[i - 1].name, toComb[i].name, -1, -1]  ///////
      ]
    )
    toComb[i].userData.constraints.push(this.c_id)
    toComb[i - 1].userData.constraints.push(this.c_id)
  }

  this.updateOtherBuffers()
  this.solve()
  this.updateBoundingSpheres()

  // update state of points
  // for (let obj of this.selected) {
  // obj.geometry.computeBoundingSphere()
  // obj.material.color.set(0x555555)
  // }
  this.selected = []
  this.obj3d.dispatchEvent({ type: 'change' })
}


export function setOrdinate(dir = 0) {


  const line = this.selected[0]
  this.constraints.set(++this.c_id,
    [
      dir ? 'vertical' : 'horizontal', -1,
      [-1, -1, line.name, -1]  ///////
    ]
  )
  line.userData.constraints.push(this.c_id)
  

  this.updateOtherBuffers()
  this.solve()
  this.updateBoundingSpheres()

  this.selected = []
  this.obj3d.dispatchEvent({ type: 'change' })
}


