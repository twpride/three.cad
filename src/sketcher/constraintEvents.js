

export function addDimension(ent1, ent2, distance) {


  // if (ent1.type ==)

  this.constraints.set(++this.c_id,
    [
      'distance', distance,
      [p1, p2, -1, -1]
    ]
  )

  ent1.userData.constraints.push(this.c_id)
  ent2.userData.constraints.push(this.c_id)
}


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
        'coincident', -1,
        [toComb[i - 1].name, toComb[i].name, -1, -1]  ///////
      ]
    )
    toComb[i].userData.constraints.push(this.c_id)
    toComb[i - 1].userData.constraints.push(this.c_id)
  }

  this.updateOtherBuffers()
  this.solve()
 
  // update state of points
  for (let obj of this.selected) {
    obj.geometry.computeBoundingSphere()
    obj.material.color.set(0x555555)
  }
  this.selected = []
  this.sketch.dispatchEvent({ type: 'change' })
}
