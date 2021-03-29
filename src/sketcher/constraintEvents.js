

export function addDimension(ent1, ent2, distance) {


  // if (ent1.type ==)

  this.constraints.set(++this.c_id,
    [
      'distance', distance,
      [p1, p2, -1, -1]
    ]
  )

  ent1.constraints.add(this.c_id)
  ent2.constraints.add(this.c_id)

}



// function findTouching(node) {
//   const res = [node]
//   for (let t of node.constraints) {
//     if (this.constraints.get(t)[0] != 'coincident') continue
//     for (let i = 0; i < 2; i++) {
//       let d = this.constraints.get(t)[2][i]
//       if (d != node) res.push(d)
//     }
//   }
//   return res
// }


// export function setCoincident(ent1, ent2) {

//   for (let n1 of findTouching.call(this,ent1)) {
//     for (let n2 of findTouching.call(this,ent2)) {
//       this.constraints.set(++this.c_id,
//         [
//           'coincident', -1,
//           [n1, n2, -1, -1]
//         ]
//       )
//       n1.constraints.add(this.c_id)
//       n2.constraints.add(this.c_id)
//     }
//   }

// }





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
        [toComb[i - 1].id, toComb[i].id, -1, -1]  ///////
      ]
    )
    toComb[i].constraints.add(this.c_id)
    toComb[i - 1].constraints.add(this.c_id)
  }

  this.updateOtherBuffers()
  this.solve()
 
  // update state of points
  for (let obj of this.selected) {
    obj.geometry.computeBoundingSphere()
    obj.material.color.set(0x555555)
  }
  this.selected.clear()
  this.dispatchEvent({ type: 'change' })
}
