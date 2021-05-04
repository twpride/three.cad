
export class DepTree {
  constructor(obj) {
    this.order = { ...obj.order }
    this.byId = { ...obj.byId }
    this.allIds = [...obj.allIds]

    this.tree = {}
    for (let k in obj.tree) {
      this.tree[k] = { ...obj.tree[k] }
    }

  }

  addParent(id) {
    if (this.tree[id]) return
    this.tree[id] = {}
    this.order[id] = this.allIds.length
    this.allIds.push(id)
  }

  addChild(childId, ...parentIds) {
    for (let parentId of parentIds) {
      this.tree[parentId][childId] = true;
    }

    this.addParent(childId)
  }

  getDescendents(id) {
    const dfs = (id) => {
      visited.add(id)
      desc.push(id)
      for (let k in this.tree[id]) {
        if (!visited.has(k)) {
          dfs(k)
        }
      }
    }

    const visited = new Set()
    const desc = []

    dfs(id)

    return desc
  }



  deleteNode(id) {

    const nodesToDel = this.getDescendents(id)

    nodesToDel.sort((a, b) => this.order[b] - this.order[a])


    let spliceIdx;
    for (let id of nodesToDel) {
      spliceIdx = this.order[id]

      this.allIds.splice(spliceIdx, 1)

      const deletedObj = sce.obj3d.children.splice(spliceIdx + 1, 1)[0] // first 1 elements are non geom

      deletedObj.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })

      delete this.tree[id]
      delete this.byId[id]
      delete this.order[id]
    }

    for (let i = spliceIdx; i < this.allIds.length; i++) {
      this.order[this.allIds[i]] = i
    }

    const nodeToDelSet = new Set(nodesToDel)
    for (let k in this.tree) {
      for (let m in this.tree[k]) {
        if (nodeToDelSet.has(m)) {
          delete this.tree[k][m]
        }
      }
    }
    return this
  }


}



