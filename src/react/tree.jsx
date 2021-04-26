

import React, { useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { MdEdit, MdVisibility, MdDelete } from 'react-icons/md'
import { FaCube, FaDrawPolygon } from 'react-icons/fa'


export const Tree = () => {
  const treeEntries = useSelector(state => state.treeEntries)
  const fileHandle = useSelector(state => state.ui.fileHandle)
  const fileName = useSelector(state => state.ui.fileName)

  return <div className='sideNav flex flex-col bg-gray-800' >
    <div className='w-full text-gray-50 h-9 text-lg mx-1 border-0 flex items-center focus:outline-none bg-transparent'>
      {
        (fileHandle ? fileHandle.name : fileName).replace(/\.[^/.]+$/, "")
      }
    </div>
    <div className='overflow-auto'>
      {treeEntries.allIds.map((entId, idx) => (
        <TreeEntry key={idx} entId={entId} />
      ))}
    </div>
  </div>

}


const treeIcons = {
  'mesh': FaCube,
  'sketch': FaDrawPolygon
}


const TreeEntry = ({ entId }) => {

  const dispatch = useDispatch()


  const entry = useSelector(state => state.treeEntries.byId[entId])
  const visible = useSelector(state => state.treeEntries.visible[entId])
  const selected = useSelector(state => state.ui.selectedSet[entId])
  const activeId = useSelector(state => state.ui.dialog.target)


  let obj, sketch;

  if (entry.obj3d) {
    obj = entry.obj3d
    sketch = entry
  } else {
    obj = entry
  }
  let Icon = treeIcons[obj.userData.type]

  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [mouseOn, setMouseOn] = useState(false)

  const edit = (e) => {
    e.stopPropagation()
    if (obj.userData.type == 'sketch') {
      if (sce.activeSketch) {
        dispatch({ type: 'finish-sketch' })
        sce.activeSketch.deactivate()
      }


      sketch.activate()
      dispatch({ type: 'set-active-sketch', sketch })

      sce.clearSelection()
      sce.activeSketch = sketch;
      dispatch({ type: 'set-dialog', action: 'sketch', target: obj.name })
      sce.render()
    } else if (obj.userData.featureInfo.length == 2) {
      dispatch({ type: 'set-dialog', action: 'extrude-edit', target: obj.name })
    }

  }

  const del = (e) => {
    e.stopPropagation()
    dispatch({ type: 'delete-node', id: entId })
    sce.render()
  }

  const toggleVis = (e) => {
    e.stopPropagation()
    dispatch({ type: "set-entry-visibility", obj: { [entId]: !visible } })
    obj.visible = !visible;
    if (obj.userData.type == 'mesh') {
      obj.traverse((e) => visible ? e.layers.disable(1) : e.layers.enable(1))
    }

    sce.render()
    forceUpdate()
  }

  const mouseHandlers = {
    onPointerEnter: () => {
      if (mouseOn) return
      setMouseOn(true)

      if (obj.userData.type == 'sketch') {
        obj.visible = true
      }

      sce.setHover(obj, 1)
      sce.render()
    },
    onPointerLeave: () => {
      if (!mouseOn) return
      setMouseOn(false)

      if (obj.userData.type == 'sketch'
        && !sce.selected.includes(obj)
        && !visible
      ) {
        obj.visible = false
      }

      if (sce.selected.includes(obj)) return

      sce.setHover(obj, 0)

      sce.render()
    },
    onClick: () => {
      const idx = sce.selected.indexOf(obj)
      if (idx == -1) {
        sce.setHover(obj, 1)
      } else {
        sce.setHover(sce.selected[idx], 0)
      }

      dispatch({ type: 'on-pick', obj })


      sce.render()
    }
  }

  return <div className={`cursor-pointer select-none fill-current text-gray-200 w-full h-8
  flex justify-start items-center text-xs ${mouseOn || selected ? 'bg-gray-600' : 'bg-transparent'}`}
    {...mouseHandlers}
    tooltip='click to add to selection'
  >
    <Icon className={`h-full w-auto p-2 flex-none fill-current ${entId == activeId ? 'text-green-500' : 'text-gray-200'}`} />
    <div className="pl-1 h-full flex justify-start items-center overflow-x-hidden whitespace-nowrap ">
      {entId}
    </div>
    <div className='flex h-full ml-auto'>
      {
        mouseOn && obj.name[0] != '(' && <MdEdit className='btn-green h-full w-auto p-1.5'
          onClick={edit}
        />
      }
      {
        mouseOn && <MdDelete className='btn-green h-full w-auto p-1.5'
          onClick={del}
        />
      }
      {
        (mouseOn || visible) && <MdVisibility className='btn-green h-full w-auto p-1.5'
          onClick={toggleVis}
        />
      }
    </div>
  </div>

}