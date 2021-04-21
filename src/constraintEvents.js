import { color } from './shared'

export async function setCoincident(sel) {
  let selection
  if (sel === undefined) {
    selection = await this.awaitSelection({ point: 2 }, { point: 1, line: 1 })
    if (selection == null) return;
  } else {
    selection = sel
  }


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
  this.scene.render()
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
  this.scene.render()
}

export async function setTangent() {
  let selection = await this.awaitSelection({ line: 2 })
  if (selection == null) return;

  const res = {} // this helps us find the relavant coincident constraint connecting the 2 entities
  let idx = -1 // -1: both are arcs, 0: selection[0] is line, 1 selection[1] is line
  const others = [] // length 2 arr of the other flag
  let type, arr

  /**
   *  a this.constraints entry:
   * [0]: constraint type
   * [1]: float value, -1 if not needed
   * [2]: [pointA, pointB, entityA, entityB]
   * [3]: other
   * [4]: other2
   * 
   * a this.linkedObjs entry:
   * [0]: type: arc or line
   * [1]: [point1_id, point2_id, line_id]
   */

  for (let i = 0; i < 2; i++) {
    if (selection[i].userData.ccw == undefined) { // quick dirty way to check if entity is a arc
      idx = i
    }
    const l_id = selection[i].userData.l_id
    const ids = this.linkedObjs.get(l_id)[1]
    for (let j = 0; j < 2; j++) {
      const constraintsArr = this.obj3d.children[this.objIdx.get(ids[j])].userData.constraints
      for (let k = 0; k < constraintsArr.length; k++) {
        const constraint = this.constraints.get(constraintsArr[k])
        if (constraint[0] == 'points_coincident') {
          if (res[constraintsArr[k]]) { // if we've seen this constraint already, it means its the relevant constraint
            for (let m = 0; m < 2; m++) {
              others[m] = this.obj3d.children[this.objIdx.get(constraint[2][m])].userData.start ? 0 : 1
            }

            arr = idx == 0 ?
              [-1, -1, selection[1].name, selection[0].name] :
              [-1, -1, selection[0].name, selection[1].name];
            type = idx == -1 ? 'curve_curve_tangent' : 'arc_line_tangent'

            if (
              (ids.includes(constraint[2][1]) && idx == 0) ||
              (!ids.includes(constraint[2][1]) && idx != 0)
            ) { // if selection[1] includes the first entitity 
              let temp = others[0]
              others[0] = others[1]
              others[1] = temp
            }
            break
          } else {
            res[constraintsArr[k]] = true
          }
        }
      }
    }
  }

  this.constraints.set(++this.c_id,
    [
      type, -1,
      arr, others[0], others[1]
    ]
  )
  selection.forEach(element => {
    element.userData.constraints.push(this.c_id)
  });


  this.updateOtherBuffers()
  this.solve()
  this.updateBoundingSpheres()

  this.selected = []
  this.scene.render()
}



