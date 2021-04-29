
import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { MdCancel, MdClose, MdHelpOutline } from 'react-icons/md'

import { Carousel } from './carousel'


// 10, 'Use the line tool',
// 10, 'Adding dimensions',
// 10, 'Adding vetical/horizontal constraints',
// 10, 'Drawing an arc',
// 10, 'Adding coincident constraints',

const basicWorkflowTS = [
  10, 'Sketching on a plane',
  10, 'Extruding a sketch to a solid',
  10, 'Sketch on a face of a solid',
  10, 'Peforming boolean operation between solids',
]

const editWorkflowTS = [
  10, 'opening a file from disk',
  10, 'editing an existing sketch',
  10, 'accepting the edit and exiting',
]

const exportTS = [
  10, 'selecting a body for export',
  10, 'initiate export',
  10, 'loading exported stl into 3dprint slicer',
  10, 'result',
]




export const Help = () => {
  const handleClick = (e) => {
    /*
      this handles inside click as well due to bubbling, 
      sets the open/close state of drop down
    */
    !e.composedPath().includes(ref.current) && dispatch({ type: 'set-help', status: false })

  }
  const handleTimeUpdate = (e) => {

  }

  const ref = useRef()
  const vidRef = useRef()


  useEffect(() => {
    document.addEventListener( // handles click outside buttona & dropdown
      'pointerdown',
      handleClick
      ,
      { capture: true } // capture phase to allow for stopPropogation on others
    )

    return () => document.removeEventListener('pointerdown', handleClick)

  }, [])

  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const status = useSelector(state => state.ui.help)


  if (status) {
    return <div className="absolute w-1/5 h-1/5 left-0 top-0 right-0 bottom-0 m-auto bg-green-200
    flex flex-col items-center
    "
      // return <div className="absolute w-full h-full bg-green-200"
      // onClick={handleInsideClick}
      ref={ref}
    >
      <MdCancel className="btn-green absolute h-7 w-auto right-4 top-4"/>
      <Carousel />
    </div >
  } else {
    return null
  }
}