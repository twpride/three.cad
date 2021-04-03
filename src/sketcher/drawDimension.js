import * as THREE from '../../node_modules/three/src/Three';
import { ptObj, lineObj, awaitPts } from '../utils/shared'

const color = {
  hover: 0x00ff00,
  lighting: 0xFFFFFF,
  emissive: 0x072534,
  d: 0xf5bc42, //datums: planes
  p: 0x555555, //points
  l: 0x555555, //lines
  m: 0x156289, //mesh: extrude
}

const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: 2,
  color: color.l,
})


const pointMaterial = new THREE.PointsMaterial({
  color: color.p,
  size: 4,
})


const DptObj = (n) => {
  const ret = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(n || 3, 3)
    ),
    pointMaterial.clone()
  );
  ret.name = 'p' + nid++

  ret.matrixAutoUpdate = false;
  ret.userData.constraints = []
  ret.userData.construction = true

  return ret
}

const DlineObj = (n = 1) => {
  const ret = new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(3 * (n + 1), 3)
    ),
    lineMaterial.clone()
  );
  ret.name = 'l' + nid++

  ret.matrixAutoUpdate = false;
  ret.userData.constraints = []

  return ret
}



export async function drawDimensionPre() {
  let [p1, p2] = await this.awaitPts(2)

  const lines = [
    DlineObj(), // 0:
    DlineObj(), // 1:
    DlineObj(), // 2:
  ]

  const points = [
    p1,       // 0:
    DptObj(), // 1:  | 
    DptObj(), // 2:  |
    DptObj(), // 3:    |
    DptObj(), // 4:    |
    DptObj(), // 5:  |
    DptObj(), // 6:  |
    p2,       // 7:
  ]

  this.constraints.set(++this.c_id, //???
    [
      'pt_pt_distance', 10,
      [p1.name, p2.name, -1, -1]
    ]
  )
  p1.userData.constraints.push(this.c_id)
  p2.userData.constraints.push(this.c_id)

  // this.updateOtherBuffers()
  // console.log(points)

  const updatePoint = this.obj3d.children.length
  for (let i = 1; i < points.length; i++) {
    if (i % 2) {
      this.constraints.set(++this.c_id, //??? increment investigation
        [
          'points_coincident', -1,
          [points[i - 1].name, points[i].name, -1, -1]
        ]
      )
      points[i - 1].userData.constraints.push(this.c_id)
      points[i].userData.constraints.push(this.c_id)


    } else { // even

      const toPush = [...points.slice(i - 1, i + 1), lines[i / 2 - 1]]

      this.linkedObjs.set(this.l_id, ['line', toPush.map(e => e.name)])
      for (let obj of toPush) {
        obj.userData.l_id = this.l_id
      }
      this.l_id += 1

      if (i == 4 || i == 6) {
        this.constraints.set(++this.c_id, //???
          [
            'perpendicular', -1,
            [-1, -1, lines[i / 2 - 2].name, lines[i / 2 - 1].name]
          ]
        )
        lines[i / 2 - 2].userData.constraints.push(this.c_id)
        lines[i / 2 - 1].userData.constraints.push(this.c_id)
      }

      this.obj3d.add(...toPush) // not to be confused with this.topush


    }

    if (i<=3) { // move pts to their respective spots to spread them
      points[i].geometry.attributes.position.set(p1.geometry.attributes.position.array)
    } else {
      points[i].geometry.attributes.position.set(p2.geometry.attributes.position.array)
    }
  }

  lines[0].userData.construction = true
  lines[2].userData.construction = true







  this.updatePointsBuffer(updatePoint)
  this.updateOtherBuffers()

  // line[1].geometry.attributes.position.set(p1.geometry.attributes.position.array)
  // line[1].geometry.attributes.position.set(p1.geometry.attributes.position.array, 3)

  // line[0].geometry.attributes.position.set(p1.geometry.attributes.position.array)
  // line[0].geometry.attributes.position.set(p2.geometry.attributes.position.array, 3)


  // line[2].geometry.attributes.position.set(p2.geometry.attributes.position.array)
  // line[2].geometry.attributes.position.set(p2.geometry.attributes.position.array, 3)








  return
}

export function drawLine(mouseLoc) {




  line.geometry.attributes.position.set(mouseLoc)
  p1.geometry.attributes.position.set(mouseLoc)

  if (this.subsequent) {

    this.constraints.set(++this.c_id,
      [
        'points_coincident', -1,
        [this.obj3d.children[this.obj3d.children.length - 2].name, p1.name, -1, -1]
      ]
    )

    p1.userData.constraints.push(this.c_id)
    this.obj3d.children[this.obj3d.children.length - 2].userData.constraints.push(this.c_id)

  }



  return [p1, p2, line];
}

export function drawLine2(mouseLoc, toPush) {

  const [p1, p2, line] = toPush

  p2.geometry.attributes.position.set(mouseLoc);
  p2.geometry.attributes.position.needsUpdate = true;
  p2.geometry.computeBoundingSphere();

  line.geometry.attributes.position.set(mouseLoc, 3)
  line.geometry.attributes.position.needsUpdate = true;
}