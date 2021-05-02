import React, { useState, useEffect, useRef, useCallback, useReducer } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Clip } from './clip'
import { Modal } from './modal'

import { MdZoomIn, MdSave, MdFolder, MdInsertDriveFile, MdHelpOutline } from 'react-icons/md'
import { FaRegPlayCircle, FaEdit, FaLinkedin, FaGithub } from 'react-icons/fa'

import * as Icon from "./icons";



const clipArr = [
  ['basic-workflow.mp4', 'Basic model creation workflow'],
  ['load-file-and-edit.mp4', 'Loading and editing models'],
  ['export-to-3dprint.mp4', 'Exporting model for 3D printing'],
]

const navArr = [
  'Mouse Navigation',
  [Icon.Select, 'Select', [
    Icon.MouseLeft, '+ drag'
  ]],
  [Icon.Rotate, 'Rotate', [
    Icon.MouseRight
  ]],
  [MdZoomIn, 'Zoom', [
    Icon.MouseScroll
  ]],
  [Icon.Pan, 'Pan', [
    Icon.MouseMiddle, '(or', () => <div className="border border-gray-300 rounded-lg mx-2">Ctrl</div>, ' + ', Icon.MouseRight, ') + drag'
  ]],
  '\u00A0',
  'Model Toolbar',
  [FaEdit, 'Sketch', ['Initiates a new sketch based on the the user must first select a plane, or three points on existing extrusions.']],
  [Icon.Extrude, 'Extrude', ['Intiates new extrusion dialog. before clickin gthis button. The user must firs select a sketch to extrude from']],
  [Icon.Union, 'Union', ['Creates a new solid that is a boolean union or two selected solids.']],
  [Icon.Subtract, 'Substract', ['Creates a new solid that is a boolean subtraction of the second selected solid from the first selected solid']],
  [Icon.Intersect, 'Intersect', ['Creates a new solid that is a boolean intersection or two selected solids.']],
  [MdInsertDriveFile, 'New Document', ['Wipes the current workspace and starts a fresh document']],
  [MdSave, 'Save', ['saves current document. on the inital save the user can specify save location and file name']],
  [MdFolder, 'Open', ['loads an existing document from the local disk.']],
  [Icon.Stl, 'Export to STL', ['Exports selected solid to 3d print friendly stl format']],

  '\u00A0',
  'Sketch Toolbar',
  [Icon.Extrude, 'Extrude', ['Creates a new extrusion from the current sketch']],
  [Icon.Line, 'Line', ['Subsequent clicks on the canvas define the vertices of the line segment chain.']],
  [Icon.Arc, 'Arc', ['In the 3 subsequent mouse clicks, the first sets the start point, the seconds the endpoint, and the third the radius.']],
  [Icon.Dimension, 'Dimension', ['Adds a distance when 2 points, or 1 point and 1 line are selected. Adds an angle when two lines are selected.']],
  [Icon.Coincident, 'Coincident', ['Adds a coincident contraint between two points, or a line and a point.']],
  [Icon.Vertical, 'Vertical', ['Aligns the the selected line, or two selected points with the y-axis']],
  [Icon.Horizontal, 'Horizontal', ['Aligns the the selected line, or two selected points with the x-axis']],
  [Icon.Tangent, 'Tangent', ['Adds a tangent constraint between selected two arcs, or a line and a arc. Entities must first be coincident']],


]

export const QuickStart = () => {


  const [clip, setClip] = useState(null)
  return <div className="bg-transparent w-full h-full flex justify-center">

    <div className="bg-transparent w-full h-full text-sm lg:text-base xl:text-lg flex flex-col overflow-y-auto overflow-x-hidden">

      <div className='text-center'>
        Common workflow walkthoughs
      </div>

      {
        clipArr.map((ele, idx) => (
          <div className="flex h-6 w-full mx-2 rounded-lg items-center"
            onClick={() => setClip(ele)}
            key={idx}
          >
            <FaRegPlayCircle />
            {ele[1]}
          </div>
        ))
      }

      <div
        className='self-center h-full w-11/12'
        style={{
          display: 'grid',
          grid: 'minmax(1em, auto) / 1fr',
        }}
      >
        {
          navArr.map((row, i) => (
            typeof row === 'string' ?
              <div className='col-span-2 flex justify-center'>
                {row}
              </div>
              :
              <React.Fragment key={i}>
                <div className='flex items-center justify-end border-r-2 border-gray-50 text-right'>
                  {row[1]}
                  {React.createElement(row[0],
                    {
                      className: "fill-current text-gray-100 flex-shrink-0",
                      width: '2.5em', height: '2.5em', size: '2.5em',
                      style: { padding: '0.5em' }
                    }
                  )}
                </div>

                <div className='flex items-center ml-2 my-2'>
                  {
                    row[2].map(
                      (Col, key) => typeof Col === 'string' ?
                        Col
                        :
                        <Col className="fill-current text-gray-100 flex-none" key={key} width='auto' height='2.5em' />
                    )
                  }
                </div>
              </React.Fragment>
          ))
        }

      </div>



      {
        clip && <Modal>
          <Clip {...{ setClip, clip }} />
        </Modal>
      }
    </div>


  </div>


}