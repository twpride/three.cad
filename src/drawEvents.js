
import { drawArc, drawArc2 } from './drawArc'
import { drawLine, drawLine2 } from './drawLine'
import { ptObj } from './shared'

export function drawOnClick1(e) {
  if (e.buttons !== 1) return
  this.canvas.removeEventListener('pointerdown', this.drawOnClick1)
  this.canvas.addEventListener('pointermove', this.drawPreClick2)
  this.canvas.addEventListener('pointerdown', this.drawOnClick2)

  const mouseLoc = this.getLocation(e).toArray();

  if (this.mode == "line") {
    this.toPush = drawLine.call(this, mouseLoc)
  } else if (this.mode == "arc") {
    this.toPush = drawArc(mouseLoc)
  } else if (this.mode == 'dim') {
    this.curDimension = drawDimension.call(this)
  } else if (this.mode == 'point') {
    this.toPush = drawPoint.call(this, mouseLoc)
  }

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
  this.canvas.removeEventListener('pointerdown', this.drawOnClick2);

  this.updatePointsBuffer(this.updatePoint)
  this.updateOtherBuffers()

  if (this.mode == "line") {
    this.subsequent = true
    this.drawOnClick1(e)

  } else if (this.mode == "arc") {
    // this.toPush = []
    // this.canvas.addEventListener('pointermove', this.drawPreClick3)
    // this.canvas.addEventListener('pointerdown', this.drawOnClick3)
  } else if (this.mode == "point") {
    this.drawOnClick1(e)
  }

}


export function drawPreClick3(e) {
  const mouseLoc = this.getLocation(e).toArray();

  sc.render()
}


export function drawOnClick3(e) {
  if (e.buttons !== 1) return;
  this.canvas.removeEventListener('pointermove', this.drawPreClick3);
  this.canvas.removeEventListener('pointerdown', this.drawOnClick3);
}



export function drawClear() {
  if (this.mode == "") return

  if (this.mode == "line") {
    this.canvas.removeEventListener('pointerdown', this.drawOnClick1)
    this.canvas.removeEventListener('pointermove', this.drawPreClick2);
    this.canvas.removeEventListener('pointerdown', this.drawOnClick2);

    this.delete(this.obj3d.children[this.updatePoint])

    this.obj3d.dispatchEvent({ type: 'change' })
    this.subsequent = false
    this.toPush = []
  }
}


export function drawPoint(mouseLoc) {
  const p1 = ptObj()
  p1.matrixAutoUpdate = false;
  p1.userData.constraints = []
  p1.geometry.attributes.position.set(mouseLoc)
  return [p1]
}