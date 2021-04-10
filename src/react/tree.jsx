

import React, { useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit, MdVisibilityOff, MdVisibility, MdDelete } from 'react-icons/md'

import { FaCube, FaEdit } from 'react-icons/fa'

export const Tree = () => {
  const treeEntries = useSelector(state => state.treeEntries)

  return <div className='sideNav flex flex-col'>
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

  const activeSketchId = useSelector(state => state.activeSketchId)

  let obj3d, entry;

  entry = treeEntries[entId]

  if (treeEntries[entId].obj3d) {
    obj3d = treeEntries[entId].obj3d
  } else {
    obj3d = treeEntries[entId]
  }
  console.log(obj3d.userData.type)
  let Icon = treeIcons[obj3d.userData.type]

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  // const vis = obj3d.visible
  const vis = obj3d.layers.mask&1

  return <div className='btn-light select-none flex justify-start w-full h-7 items-center text-sm'

    onDoubleClick={() => {
      activeSketchId && treeEntries[activeSketchId].deactivate()
      entry.activate()
      sc.clearSelection()
      sc.activeSketch = entry;
    }}
  >
    <Icon className='h-full w-auto p-1.5' />
    <div className="btn-light pl-1"
      onPointerEnter={() => {
        if (entId[0] == 'm') {
          // entry.material.color.set(color.hover)
          sc.render()
        }
      }}
      onPointerLeave={() => {
        const obj = entry
        if (entId[0] == 'm' && !sc.selected.includes(obj)) {
          // obj.material.color.set(color.mesh)
          sc.render()
        }
      }}
      onPointerDown={() => {
        if (entId[0] == 'm') {
          sc.selected.push(
            entry
          )
          sc.render()
        }
      }}
    >
      {entId}
    </div>
    <div className='flex h-full ml-auto'>

      <MdDelete className='btn-green h-full w-auto p-1.5'
        onClick={() => {
          dispatch({ type: 'delete-node', id: entId })
        }}
      />

      {
        vis ?
          <MdVisibility className='btn-green h-full w-auto p-1.5'
            onClick={() => {
              obj3d.traverse((e)=>e.layers.disable(0))
              sc.render()
              forceUpdate()
            }}
          />
          :
          <MdVisibilityOff className='btn-green h-full w-auto p-1.5'
            onClick={() => {
              obj3d.traverse((e)=>e.layers.enable(0))
              sc.render()
              forceUpdate()
            }}
          />
      }
    </div>

  </div>

}