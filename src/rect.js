  const lines = [
    DlineObj(), // 0:
    DlineObj(), // 1:
    DlineObj(), // 2:
    DlineObj(), // 2:
  ]

  const points = [
    DptObj(), // 1:  | 
    DptObj(), // 1:  | 
    DptObj(), // 1:  | 
    DptObj(), // 2:  |
    DptObj(), // 3:    |
    DptObj(), // 4:    |
    DptObj(), // 5:  |
    DptObj(), // 6:  |
  ]

  const updatePoint = this.obj3d.children.length
  let prev = points[points.length - 1]
  for (let i = 0, j = 0; i < points.length; i++) {
    const cur = points[i]
    if (i % 2 == 0) {
      this.constraints.set(++this.c_id, //??? increment investigation
        [
          'points_coincident', -1,
          [prev.name, cur.name, -1, -1]
        ]
      )
      cur.userData.constraints.push(this.c_id)
      prev.userData.constraints.push(this.c_id)
    } else {
      const toPush = [prev, cur, lines[j]]
      this.linkedObjs.set(this.l_id, ['line', toPush.map(e => e.name)])
      for (let obj of toPush) {
        obj.userData.l_id = this.l_id
      }
      this.l_id += 1

      if (j > 0) {
        this.constraints.set(++this.c_id, //???
          [
            'perpendicular', -1,
            [-1, -1, lines[j - 1].name, lines[j].name]
          ]
        )
        lines[j - 1].userData.constraints.push(this.c_id)
        lines[j].userData.constraints.push(this.c_id)
      }
      this.obj3d.add(...toPush)

      j += 1
    }

    if (i >= 3 && i <= 6) {
      points[i].geometry.attributes.position.set(p2.geometry.attributes.position.array)
    } else {
      points[i].geometry.attributes.position.set(p1.geometry.attributes.position.array)
    }

    prev = cur
  }


  this.constraints.set(++this.c_id, //??? increment investigation
    [
      'points_coincident', -1,
      [p2.name, points[5].name, -1, -1]
    ]
  )
  points[5].userData.constraints.push(this.c_id)
  p2.userData.constraints.push(this.c_id)

  this.constraints.set(++this.c_id, //??? increment investigation
    [
      'points_coincident', -1,
      [p1.name, points[0].name, -1, -1]
    ]
  )
  points[0].userData.constraints.push(this.c_id)
  p1.userData.constraints.push(this.c_id)