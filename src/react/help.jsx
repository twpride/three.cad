

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { MdArrowBack, MdArrowForward } from 'react-icons/md'

import { QuickStart } from './quickStart'

// 10, 'Use the line tool',
// 10, 'Adding dimensions',
// 10, 'Adding vetical/horizontal constraints',
// 10, 'Drawing an arc',
// 10, 'Adding coincident constraints',

function debounce(callback, delay) {
  let handler = null;
  return (...args) => {
    clearTimeout(handler);
    handler = setTimeout(() => callback(...args), delay);
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'resize':

      const rect = Math.min(Math.min(window.innerHeight * 0.8, window.innerWidth * 0.7), 800)
      return {
        ...state,
        rect,
        dragLeft: state.pg * rect,
        dragging: true
      };
    case 'move':
      return {
        ...state,
        pg: state.pg + action.del,
        dragging: false
      };
    case 'drag-start':
      return {
        ...state,
        dragLeft: state.pg * state.rect,
        dragging: true
      };
    case 'drag':
      const dragLeft = state.dragLeft - action.move

      if (dragLeft < 0 || dragLeft > state.rect * arr.length - 1) {
        return state
      } else {
        return {
          ...state,
          dragLeft
        }
      }

    case 'drag-end':
      return {
        ...state,
        pg: Math.round(state.dragLeft / state.rect),
        dragging: false
      };
    default:
      console.error(action)
    // throw new Error();
  }
}

const transTime = 300

const elastic = `transform ${transTime}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;

const arr = [
  ['Sketch out your idea in a 2D outline.', 'sketch.png'],
  ['Transform the sketched shape into a 3D solid.', 'extrude.png'],
  ['Use additional sketches to sculpt or extend the model.', 'sculpt.gif'],
  ['Export your design to a 3D printer and turn into reality.', '3dprint.mp4'],
]








export const Help = ({ setModal, setQs }) => {



  const ref = useRef(null)
  const rect = Math.min(Math.min(window.innerHeight * 0.8, window.innerWidth * 0.7), 800)
  const [state, carouselDispatch] = useReducer(reducer, { rect, pg: 0, dragLeft: 0, dragging: false })




  const updateSize = useCallback(
    debounce(
      () => {
        carouselDispatch({ type: 'resize' })
      }
      , 200
    )
    , []
  )


  const handleMouseDown = () => carouselDispatch({ type: 'drag-start' })
  const handleMouseMove = (e) => e.buttons == 1 && carouselDispatch({ type: 'drag', move: e.movementX })
  const handleMouseUp = () => carouselDispatch({ type: 'drag-end' })

  useEffect(() => {
    window.addEventListener('resize', updateSize)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('resize', updateSize)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

    }
  }, [])

  // if (status) {
  return <div className="absolute left-0 right-0 mx-auto bg-gray-700 rounded-xl
    flex flex-col items-center border-gray-500 border-2
    text-sm lg:text-base xl:text-lg select-none
    "
    style={{
      width: state.rect,
      height: 1.1 * state.rect,
      top: (window.innerHeight - 1.1 * state.rect) / 3
    }}
    ref={ref}
  >

    <div className='w-full overflow-hidden relative rounded-t-xl'
      style={{
        height: state.rect,
        // height: '100%',
      }}
    >
      <div className='bg-transparent h-full flex select-none'

        style={{
          width: state.rect * (arr.length),
          transform: `translateX(${state.dragging ? -state.dragLeft - 4 : -state.pg * state.rect - 4}px)`,
          transition: state.dragging ? null : elastic
        }}
      >
        {
          arr.map(
            (e, idx) => {
              const isVideo = e[1].match(/\.[0-9a-z]+$/i)[0] == '.mp4'
              return <div className='flex flex-col items-center'
                style={{ width: state.rect, height: '100%' }} key={idx}
              >
                {
                  isVideo ?
                    <video src={e[1]}
                      style={{
                        width: state.rect * 0.8,
                        height: state.rect * 0.8,
                      }}
                      autoPlay loop
                      muted type="video/mp4" />
                    :
                    <img
                      src={e[1]}
                      style={{
                        width: state.rect * 0.8,
                        height: state.rect * 0.8,
                      }}
                    ></img>
                }


                <div className='my-auto text-center text-gray-50 text-sm sm:text-base md:text-xl'>
                  {e[0]}
                </div>
              </div>

            }
          )
        }


        {/* <div className='flex flex-col items-center'
          style={{ width: state.rect, height: '100%' }}
        >
          <QuickStart {...{ setModal }} />
        </div> */}
      </div>


    </div>

    <div
      className="cursor-pointer text-gray-50 bg-green-500 rounded p-1.5 inline-block hover:bg-green-600"
      // style={{ 
      //   position:'absolute'
      //   bottom: 0.1 * state.rect}}
      onClick={() => {
        setModal(false)
        setQs(true)
      }}
    >
      Get Started
    </div>

    <div className='cursor-pointer select-none absolute w-12 h-12 top-0 bottom-0 my-auto -left-24 fill-current bg-gray-100 hover:bg-gray-300 rounded-full'
      onClick={() => carouselDispatch({ type: "move", del: -1 })}
      style={{
        visibility: state.pg == 0 ? 'hidden' : 'visible'
      }}
    >
      <MdArrowBack className="w-full h-full text-gray-700 p-3" />
    </div>
    <div className='cursor-pointer select-none absolute w-12 h-12 top-0 bottom-0 my-auto -right-24 fill-current bg-gray-100 hover:bg-gray-300 rounded-full'
      onClick={() => carouselDispatch({ type: "move", del: 1 })}
      style={{
        visibility: state.pg == arr.length - 1 ? 'hidden' : 'visible'
      }}
    >
      <MdArrowForward className="w-full h-full text-gray-700 p-3" />
    </div>

    <div className="flex -bottom-8 absolute flex justify-center items-center">
      {Array(arr.length).fill().map((ele, idx) => (
        <div key={idx} className={`h-2 w-2 mx-1 rounded-full ${idx == state.pg ? 'bg-gray-50' : 'bg-gray-500'}`}></div>
      ))}
    </div>

  </div >
  // } else {
  // return null
  // }
}