class DepTree {
  constructor() {
    this.tree = {}
    this.order = {}
    this.arr = []
  }

  addParent(id) {
    if (this.tree[id]) return
    this.tree[id] = new Set()
    this.order[id] = this.arr.length
    this.arr.push(id)
  }

  addChild(childId, ...parentIds) {
    for (let parentId of parentIds) {
      this.tree[parentId].add(childId)
    }

    this.addParent(childId)
  }


  deleteNode(id) {
    this.visited = new Set()

    this.nodesToDel = []
    this.dfs(id)

    const idx = []
    this.nodesToDel.sort((a, b) => this.order[b] - this.order[a])

    for (let id of this.nodesToDel) {
      idx.push(this.order[id])
      this.arr.splice(this.order[id], 1)
      delete this.tree[id]
      delete this.order[id]
    }

    for (let i = idx[idx.length - 1]; i < this.arr.length; i++) {
      this.order[this.arr[i]] = i
    }

    const nodeToDelSet = new Set(this.nodesToDel)

    for (let k in this.tree) {
      for (let ent of this.tree[k]) {
        if (nodeToDelSet.has(ent)) {
          this.tree[k].delete(ent)
        }
      }
    }

    return idx
  }


  dfs(id) {
    this.visited.add(id)
    this.nodesToDel.push(id)
    for (let x of this.tree[id]) {
      if (!this.visited.has(x)) {
        this.dfs(x)
      }
    }
  }

}


const dt = new DepTree()


dt.addParent('r1')
dt.addParent('r2')


dt.addChild('r3', 'r1', 'r2')

dt.addParent('r4')

dt.addChild('r5', 'r4', 'r3')

dt.addChild('r6', 'r1', 'r5')

dt.addChild('r7', 'r3', 'r5')


// const x = dt.deleteNode('r3')

// console.log(x)
// console.log(dt.arr, dt.order)

// expectd output
// [ 6, 5, 4, 2 ]
// [ 'r1', 'r2', 'r4' ] { r1: 0, r2: 1, r4: 2 }


const x = dt.deleteNode('r5')

console.log(x)
console.log(dt.tree)