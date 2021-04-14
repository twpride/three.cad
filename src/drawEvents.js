
import { drawArc, drawArc2, drawArc3, drawArc4 } from './drawArc'
import { drawLine, drawLine2 } from './drawLine'
import { ptObj } from './shared'

export function drawOnClick1(e) {
  if (e.buttons !== 1) return

  // this.canvas.removeEventListener('pointerdown', this.drawOnClick1)

  this.canvas.addEventListener('pointermove', this.drawPreClick2)
  this.canvas.addEventListener('pointerdown', this.drawOnClick2, { once: true })

  const mouseLoc = this.getLocation(e).toArray();

  // this.mode allow alow following modes to create new obj3ds
  if (this.mode == "line") {
    this.toPush = drawLine(mouseLoc)

    if (this.subsequent) {
      const p1 = this.toPush[0]

      this.constraints.set(++this.c_id,  //??? why incremennt before not after
        [
          'points_coincident', -1,
          [this.obj3d.children[this.obj3d.children.length - 2].name, p1.name, -1, -1]
        ]
      )

      p1.userData.constraints.push(this.c_id)
      this.obj3d.children[this.obj3d.children.length - 2].userData.constraints.push(this.c_id)

    }


  } else if (this.mode == "arc") {
    this.toPush = drawArc(mouseLoc)
  } else if (this.mode == 'point') {
    this.toPush = drawPoint(mouseLoc)
  }

  this.toPush.forEach(element => {
    element.layers.enable(2)
  });

  this.updatePoint = this.obj3d.children.length
  this.obj3d.add(...this.toPush)
  this.linkedObjs.set(this.l_id, [this.mode, this.toPush.map(e => e.name)])
  for (let obj of this.toPush) {
    obj.userData.l_id = this.l_id
  }
  this.l_id += 1

}


export function drawPreClick2(e) {
  const mouseLoc = this.getLocation(e).toArray();

  if (this.mode == "line") {
    drawLine2(mouseLoc, this.toPush)
  } else if (this.mode == 'arc') {
    drawArc2(mouseLoc, this.toPush)
  }


  sc.render()
}

export function drawOnClick2(e) {
  if (e.buttons !== 1) return;
  this.canvas.removeEventListener('pointermove', this.drawPreClick2);

  this.updatePointsBuffer(this.updatePoint)
  this.updateOtherBuffers()

  // a this.mode == "" will prevent event chain from persisisting
  if (this.mode == "line") {
    this.subsequent = true
    this.drawOnClick1(e)

  } else if (this.mode == "point") {
    this.drawOnClick1(e)
  } else if (this.mode == "arc") {

    drawArc3(this.toPush[0], this.toPush[1])

    this.canvas.addEventListener('pointermove', this.drawPreClick3)
    this.canvas.addEventListener('pointerdown', this.drawOnClick3, { once: true })
  }

}


let ccw;
export function drawPreClick3(e) {
  const mouseLoc = this.getLocation(e);
  ccw = drawArc4(mouseLoc, this.toPush)
  sc.render()
}

export function drawOnClick3(e) {
  if (e.buttons !== 1) return;
  this.canvas.removeEventListener('pointermove', this.drawPreClick3);

  if (!ccw) {
    let temp
    const ent = this.linkedObjs.get(this.l_id - 1)
    temp = ent[1][0]
    ent[1][0] = ent[1][1]
    ent[1][1] = temp
    this.linkedObjs.set(this.l_id - 1, ent)
    let i = (this.linkedObjs.size - 1) * 5
    temp = this.linksBuf[i + 1]
    this.linksBuf[i + 1] = this.linksBuf[i + 2]
    this.linksBuf[i + 2] = temp
  }


  this.updatePoint = this.obj3d.children.length
  this.canvas.addEventListener('pointerdown', this.drawOnClick1, { once: true })
}



export function drawClear() {
  if (this.mode == "") return

  if (['line', 'arc'].includes(this.mode)) {
    this.delete(this.obj3d.children[this.updatePoint])
  }

  this.canvas.removeEventListener('pointerdown', this.drawOnClick1)
  this.canvas.removeEventListener('pointermove', this.drawPreClick2);
  this.canvas.removeEventListener('pointerdown', this.drawOnClick2);
  this.canvas.removeEventListener('pointermove', this.drawPreClick3);
  this.canvas.removeEventListener('pointerdown', this.drawOnClick3);

  this.scene.render()
  this.subsequent = false
  this.toPush = []

  this.mode = ""
}


export function drawPoint(mouseLoc) {
  const p1 = ptObj()
  p1.matrixAutoUpdate = false;
  p1.userData.constraints = []
  p1.geometry.attributes.position.set(mouseLoc)
  return [p1]
}