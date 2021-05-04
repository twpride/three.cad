import React, { useState, useEffect, useRef, useCallback, useReducer } from "react"
import { MdCancel } from 'react-icons/md'


export const Clip = ({ setClip, clip }) => {
  let width;
  if (window.innerWidth / 1.6 > window.innerHeight) {
    width = window.innerHeight * 1.6
  } else {
    width = window.innerWidth
  }

  width = Math.min(width * 0.9, 1024)
  const top = (window.innerHeight - (width / 1.6) - 32) / 2
  // console.log(width, width/1.6, window.innerHeight, top)

  return (
    <div className='absolute left-0 right-0 m-auto flex flex-col
     overflow-hidden
     '
      style={{
        width,
        top,
      }}
    >
      <div className='text-xl flex justify-center items-center bg-green-900 '>
        <div className='text-gray-50'>
          {clip[1]}
        </div>
        <MdCancel className="absolute cursor-pointer text-gray-50 hover:text-gray-400  right-2"
          onClick={() => setClip(null)}
        />
      </div>
      <video 
      className='border-2 border-gray-500'

      src={clip[0]} width='100%' controls muted type="video/mp4" />
    </div>
  )
}

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
