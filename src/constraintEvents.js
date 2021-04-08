

export async function setCoincident() {
  let selection = await this.awaitSelection({ point: 2 }, { point: 1, line: 1 })

  if (selection == null) return;

  if (selection.every(e => e.userData.type == 'point')) {
    this.constraints.set(++this.c_id,
      [
        'points_coincident', -1,
        [selection[0].name, selection[1].name, -1, -1]  ///////
      ]
    )
  } else {

    const idx = selection[0].userData.type == 'point' ? [0, 1] : [1, 0]

    this.constraints.set(++this.c_id,
      [
        'pt_on_line', -1,
        [selection[idx[0]].name, -1, selection[idx[1]].name, -1]  ///////
      ]
    )
  }

  selection[1].userData.constraints.push(this.c_id)
  selection[0].userData.constraints.push(this.c_id)


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


