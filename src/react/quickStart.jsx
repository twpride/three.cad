import React, { useState, useEffect, useRef, useCallback, useReducer } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Clip } from './clip'
import { Modal } from './modal'

import { MdZoomIn, MdSave, MdFolder, MdInsertDriveFile, MdHelpOutline } from 'react-icons/md'
import { FaRegPlayCircle, FaEdit, FaCubes } from 'react-icons/fa'

import * as Icon from "./icons";




const navArr = [
  '\u00A0',
  'Mouse Navigation',
  [['Select', Icon.Select], [Icon.MouseLeft, 'left-click + drag']],
  [['Rotate', Icon.Rotate], [Icon.MouseRight, 'right-click']],
  [['Zoom', MdZoomIn], [Icon.MouseScroll, 'scroll up / down']],
  [['Pan', Icon.Pan], [Icon.MouseMiddle, 'middle-click (or', () => <div className="border border-gray-300 rounded-lg mx-2">Ctrl</div>, ' + ', Icon.MouseRight, ' right-click) + drag']],

  '\u00A0',
  'Model Toolbar',
  [['Sketch', FaEdit], ['Initiates a new sketch based on the the user must first select a plane, or three points on existing extrusions.']],
  [['Extrude', Icon.Extrude], ['Intiates new extrusion dialog. before clickin gthis button. The user must firs select a sketch to extrude from']],
  [['Union', Icon.Union], ['Creates a new solid that is a boolean union or two selected solids.']],
  [['Substract', Icon.Subtract], ['Creates a new solid that is a boolean subtraction of the second selected solid from the first selected solid']],
  [['Intersect', Icon.Intersect], ['Creates a new solid that is a boolean intersection or two selected solids.']],
  [['New Document', MdInsertDriveFile], ['Wipes the current workspace and starts a fresh document']],
  [['Save', MdSave], ['saves current document. on the inital save the user can specify save location and file name']],
  [['Open', MdFolder], ['loads an existing document from the local disk.']],
  [['Export to STL', Icon.Stl], ['Exports selected solid to 3d printer friendly stl format']],

  '\u00A0',
  'Sketch Toolbar',
  [['Extrude', Icon.Extrude], ['Creates a new extrusion from the current sketch']],
  [['Line', Icon.Line], ['Subsequent clicks on the canvas define the vertices of the line segment chain.']],
  [['Arc', Icon.Arc], ['In the 3 subsequent mouse clicks, the first sets the start point, the seconds the endpoint, and the third the radius.']],
  [['Dimension', Icon.Dimension], ['Adds a distance when 2 points, or 1 point and 1 line are selected. Adds an angle when two lines are selected.']],
  [['Coincident', Icon.Coincident], ['Adds a coincident contraint between two points, or a line and a point.']],
  [['Vertical', Icon.Vertical], ['Aligns the the selected line, or two selected points with the y-axis']],
  [['Horizontal', Icon.Horizontal], ['Aligns the the selected line, or two selected points with the x-axis']],
  [['Tangent', Icon.Tangent], ['Adds tangency between two selected arcs, or a line and a arc. Entities must be coincident with one another via 1 endpoint']],

]


const clipArr = [
  ['basic-workflow.mp4', 'Basic model creation workflow'],
  ['load-file-and-edit.mp4', 'Loading and editing models'],
  ['export-to-3dprint.mp4', 'Exporting model for 3D printing'],
  ['headphones-stand.json.gz', 'Headphones Stand Model'],
]

const utf8decoder = new TextDecoder();

export const QuickStart = ({setModal}) => {
  const dispatch = useDispatch()

  const [clip, setClip] = useState(null)

  return <div className='bg-transparent w-full h-full flex justify-center'>
    <div className="bg-transparent w-full h-full 
    text-sm lg:text-base xl:text-lg 
    flex flex-col items-center overflow-y-auto overflow-x-hidden text-gray-50">
      <div className='text-center w-full text-lg lg:text-xl xl:text-2xl my-2 font-bold'>
        Quick Start
      </div>


      <div className='text-center text-base lg:text-lg xl:text-xl mb-2'>
        Demos
      </div>


      <div className='mb-4 cursor-pointer'>
        {
          clipArr.map((ele, idx) => {
            const isGz = ele[0].match(/\.[0-9a-z]+$/i)[0] == '.gz'

            return <div className="flex h-12 mx-2 rounded-lg items-center hover:text-green-500"
              onClick={async () => {
                if (isGz) {
                  const state = sce.loadState(
                    utf8decoder.decode(
                      new Zlib.Gunzip(
                        new Uint8Array(
                          await (
                            await (
                              await fetch(ele[0])
                            ).blob()
                          ).arrayBuffer()
                        )
                      ).decompress()
                    )
                  )
                  
                  setModal(false)
                  dispatch({ type: 'restore-state', state, fileName: ele[0] })
                  sce.render()

                } else {
                  setClip(ele)
                }

              }
              }
              key={idx}
            >
              {isGz ?
                <FaCubes size={'2.5em'} style={{ padding: '0.625em' }} />
                :
                <FaRegPlayCircle size={'2.5em'} style={{ padding: '0.625em' }} />
              }
              {ele[1]}
            </div>

          })
        }
      </div>

      <div
        className='h-full w-11/12'
        style={{
          display: 'grid',
          grid: 'minmax(1em, auto) / 1fr',
        }}
      >
        {
          navArr.map((row, i) => (
            typeof row === 'string' ?
              <div className='col-span-2 flex justify-center  text-base lg:text-lg xl:text-xl mb-2' key={i}>
                {row}
              </div>
              :
              <React.Fragment key={i}>
                <div className='flex items-center justify-end border-r-2 border-gray-50 text-right'>
                  {row[0][0]}
                  {React.createElement(row[0][1],
                    {
                      className: "fill-current text-gray-100 flex-shrink-0",
                      width: '2.5em', height: '2.5em', size: '2.5em',
                      style: { padding: '0.5em' },
                    }
                  )}
                </div>

                <div className='flex items-center ml-2 my-2'>
                  {
                    row[1].map(
                      (Col, key) => typeof Col === 'string' ?
                        Col
                        :
                        <Col className={`fill-current text-gray-100 flex-none ${key == 0 ? 'mr-2' : 'mx-2'}`} key={key} width='1.5625em' height='2.5em' />
                    )
                  }
                </div>
              </React.Fragment>
          ))
        }

      </div>



      {
        clip && <Modal setModal={setClip} id={'qs'}>
          <Clip {...{ setClip, clip }} />
        </Modal>
      }
    </div>


  </div>


}