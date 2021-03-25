
import { sketchArc, sketchArc2 } from './sketchArc'
import { sketchLine, sketchLine2 } from './sketchLine'

export function onClick_1(e) {
  if (e.buttons !== 1) return
  this.domElement.removeEventListener('pointerdown', this.onClick_1)
  const mouseLoc = this.getLocation(e);

  if (this.mode == "line") {
    this.toPush = sketchLine.call(this, mouseLoc)
  } else if (this.mode == "arc") {
    this.toPush = sketchArc(mouseLoc)
  }

  this.updatePoint = this.children.length
  this.add(...this.toPush)

  this.linkedObjs.set(this.l_id, [this.mode, this.toPush])
  for (let obj of this.toPush) {
    obj.l_id = this.l_id
  }
  this.l_id += 1

  this.domElement.addEventListener('pointermove', this.beforeClick_2)
  this.domElement.addEventListener('pointerdown', this.onClick_2)
}


export function beforeClick_2(e) {
  const mouseLoc = this.getLocation(e);

  if (this.mode == "line") {
    sketchLine2(mouseLoc, this.toPush)
  } else if (this.mode == 'arc') {
    sketchArc2(mouseLoc, this.toPush)
  }

  this.dispatchEvent({ type: 'change' })
}

export function onClick_2(e) {
  if (e.buttons !== 1) return;
  this.domElement.removeEventListener('pointermove', this.beforeClick_2);
  this.domElement.removeEventListener('pointerdown', this.onClick_2);

  this.updatePointsBuffer(this.updatePoint)
  this.updateOtherBuffers()

  if (this.mode == "line") {

    this.subsequent = true
    this.onClick_1(e)

  } else if (this.mode == "arc") {
    // this.domElement.addEventListener('pointermove', this.beforeClick_3)
  }
}

export function clear() {
  if (this.mode == "") return

  if (this.mode == "line") {
    this.domElement.removeEventListener('pointerdown', this.onClick_1)
    this.domElement.removeEventListener('pointermove', this.beforeClick_2);
    this.domElement.removeEventListener('pointerdown', this.onClick_2);

    this.delete(this.children[this.children.length - 1])

    this.dispatchEvent({ type: 'change' })
    this.subsequent = false
  }
}
