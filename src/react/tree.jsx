

import React, { useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { MdVisibilityOff, MdVisibility, MdDelete } from 'react-icons/md'

import { FaCube, FaEdit } from 'react-icons/fa'

export const Tree = () => {
  const treeEntries = useSelector(state => state.treeEntries)

  return <div className='sideNav flex flex-col bg-gray-800'>
    {treeEntries.allIds.map((entId, idx) => (
      <TreeEntry key={idx} entId={entId} />
    ))}
  </div>

}


const treeIcons = {
  'mesh': FaCube,
  'sketch': FaEdit
}


const TreeEntry = ({ entId }) => {

  const treeEntries = useSelector(state => state.treeEntries.byId)
  const dispatch = useDispatch()

  const visible = useSelector(state => state.treeEntries.visible[entId])

  let obj3d, sketch;

  if (treeEntries[entId].obj3d) {
    obj3d = treeEntries[entId].obj3d
    sketch = treeEntries[entId]
  } else {
    obj3d = treeEntries[entId]
  }
  let Icon = treeIcons[obj3d.userData.type]

  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [mouseOn, setMouseOn] = useState(false)

  return <div className='btn select-none flex justify-start w-full h-7 items-center text-sm'
    onDoubleClick={() => {
      if (obj3d.userData.type == 'sketch') {
        sc.activeSketch && sc.activeSketch.deactivate()
        sketch.activate()
        sc.clearSelection()
        sc.activeSketch = sketch;
        sc.render()
      }

    }}

    onPointerEnter={() => {
      if (mouseOn) return
      setMouseOn(true)

      if (obj3d.userData.type == 'sketch') {
        obj3d.visible = true
      }

      sc.setHover(obj3d, 1)
      sc.render()
    }}
    onPointerLeave={() => {
      if (!mouseOn) return
      setMouseOn(false)

      if (obj3d.userData.type == 'sketch'
        && !sc.selected.includes(obj3d)
        && !visible
      ) {
        obj3d.visible = false
      }

      if (sc.selected.includes(obj3d)) return

      sc.setHover(obj3d, 0)

      sc.render()
    }}
    onClick={() => {
      const idx = sc.selected.indexOf(obj3d)

      if (idx == -1) {
        sc.selected.push(obj3d)
        sc.setHover(obj3d, 1)
      } else {
        sc.setHover(sc.selected[idx], 0)
        sc.selected.splice(idx, 1)
      }
      sc.render()
    }}
  >
    <Icon className='h-full w-auto p-1.5' />
    <div className="btn pl-1">
      {entId}
    </div>
    <div className='flex h-full ml-auto'>

      <MdDelete className='btn-green h-full w-auto p-1.5'
        onClick={(e) => {
          dispatch({ type: 'delete-node', id: entId })
          sc.render()
          e.stopPropagation()
        }}
      />

      {
        visible ?
          <MdVisibility className='btn-green h-full w-auto p-1.5'
            onClick={(e) => {
              e.stopPropagation()
              console.log('hide')
              dispatch({ type: "set-entry-visibility", obj: { [entId]: false } })
              obj3d.visible = false;
              if (obj3d.userData.type == 'mesh') {
                obj3d.traverse((e) => e.layers.disable(1))
              }

              sc.render()
              forceUpdate()
            }}
          />
          :
          <MdVisibilityOff className='btn-green h-full w-auto p-1.5'
            onClick={(e) => {
              e.stopPropagation()
              console.log('show')
              obj3d.visible = true;
              dispatch({ type: "set-entry-visibility", obj: { [entId]: true } })
              if (obj3d.userData.type == 'mesh') {
                obj3d.traverse((e) => {
                  e.layers.enable(1)
                })
              }
              sc.render()
              forceUpdate()
            }}
          />
      }
    </div>

  </div>

}