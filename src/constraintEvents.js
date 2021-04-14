import { color } from './shared'

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
        selection[idx[1]].userData.ccw !== undefined ? 'pt_on_circle' : 'pt_on_line'
        , -1,
        [selection[idx[0]].name, -1, selection[idx[1]].name, -1]  ///////
      ]
    )

  }

  selection[1].userData.constraints.push(this.c_id)
  selection[0].userData.constraints.push(this.c_id)

  this.updateOtherBuffers()
  this.solve()
  this.updateBoundingSpheres()

  for (let x = 0; x < this.selected.length; x++) {
    const obj = this.selected[x]
    obj.material.color.set(color[obj.userData.type])
  }

  this.selected = []
  this.obj3d.dispatchEvent({ type: 'change' })
}


export async function setOrdinate(dir = 0) {
  let selection = await this.awaitSelection({ point: 2 }, { line: 1 })
  if (selection == null) return;

  let arr
  if (this.selected.length == 1) {
    arr = [-1, -1, selection[0].name, -1]
  } else {
    arr = [selection[0].name, selection[1].name, -1, -1]
  }

  this.constraints.set(++this.c_id,
    [
      dir ? 'vertical' : 'horizontal', -1,
      arr
    ]
  )
  selection.forEach(element => {
    element.userData.constraints.push(this.c_id)
  });


  this.updateOtherBuffers()
  this.solve()
  this.updateBoundingSpheres()

  this.selected = []
  this.obj3d.dispatchEvent({ type: 'change' })
}

export async function setTangent() {
  let selection = await this.awaitSelection({ line: 2 })
  if (selection == null) return;

  let idx = -1
  for (let i = 0; i < 2; i++) {
    if (selection[i].userData.ccw == undefined) {
      idx = i
      break
    }
  }

  let arr = idx == 0 ?
    [-1, -1, selection[1].name, selection[0].name] :
    [-1, -1, selection[0].name, selection[1].name];

  let type = idx == -1 ? 'curve_curve_tangent' : 'arc_line_tangent'

  this.constraints.set(++this.c_id,
    [
      type, -1,
      arr
    ]
  )
  selection.forEach(element => {
    element.userData.constraints.push(this.c_id)
  });


  this.updateOtherBuffers()
  this.solve()
  this.updateBoundingSpheres()

  this.selected = []
  this.obj3d.dispatchEvent({ type: 'change' })
}



