import React, { useState, useEffect, useRef, useCallback, useReducer } from "react"
import { MdCancel} from 'react-icons/md'


export const Clip = ({ setClip, clip }) => {

  const width = window.innerWidth * 0.9
  const top = (window.innerHeight - (width / 1.6)) / 2

  return (
    <div className='absolute left-0 right-0 m-auto bg-gray-700 flex flex-col
    border-2 border-gray-500 rounded-2xl overflow-hidden 
     '
      style={{
        maxWidth: '1024px',
        width,
        top,
      }}
    >
      <div className='text-2xl flex justify-center items-center'>
        <div className='text-gray-50'>
          {clip[1]}
        </div>
        <MdCancel className="absolute btn-green right-2"
          onClick={() => setClip(null)}
        />
      </div>
      <video src={clip[0]} width='100%' controls muted type="video/mp4" />
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
