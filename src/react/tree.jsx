

import React, { useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit, MdVisibilityOff, MdVisibility, MdDelete } from 'react-icons/md'


export const Tree = () => {
  const treeEntries = useSelector(state => state.treeEntries)

  return <div className='sideNav flex flex-col'>
    {treeEntries.allIds.map((entId, idx) => (
      <TreeEntry key={idx} entId={entId} />
    ))}
  </div>

}


const TreeEntry = ({ entId }) => {

  const treeEntries = useSelector(state => state.treeEntries.byId)
  const dispatch = useDispatch()

  const activeSketchId = useSelector(state => state.activeSketchId)

  let obj3d, entry;

  entry = treeEntries[entId]

  if (entId[0] == "s") {
    obj3d = treeEntries[entId].obj3d
  } else {
    obj3d = treeEntries[entId]
  }

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const vis = obj3d.visible

  return <div className='bg-gray-50 flex justify-between w-full'>
    <div className="btn"
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
    <div className='flex'>
      <div className='btn'
        onClick={() => {
          activeSketchId && treeEntries[activeSketchId].deactivate()
          entry.activate()
          sc.clearSelection()
          sc.activeSketch = entry;
        }}
      >
        <MdEdit />
      </div>

      <div className='btn'
        onClick={() => {
          dispatch({ type: 'delete-node', id: entId })
        }}
      >
        <MdDelete />
      </div>
      {
        vis ?
          <div className='btn'
            onClick={() => {
              obj3d.visible = false;
              sc.render()
              forceUpdate()
            }}
          >
            <MdVisibility />
          </div>
          :
          <div className='btn'
            onClick={() => {
              obj3d.visible = true;
              sc.render()
              forceUpdate()
            }}
          >
            <MdVisibilityOff />
          </div>
      }
    </div>

  </div>

}