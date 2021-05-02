

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

      const rect = Math.min(Math.min(window.innerHeight * 0.8, window.innerWidth * 0.7),800)
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
      return {
        ...state,
        dragLeft: state.dragLeft - action.move
      };
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
  ['Sketch out your ideas in 2D outlines.', 'link'],
  ['Transform the sketched shapes into 3D solids.', 'link'],
  ['Combine multiple solids to form more complex ones.', 'link'],
  ['Export your design to a 3D printer and turn into reality.', 'link'],
]








export const Help = ({ setModal }) => {

  const dispatch = useDispatch()
  const status = useSelector(state => state.ui.help)



  // useEffect(() => {
  //   if (!status) return

  //   document.addEventListener( // handles click outside buttona & dropdown
  //     'click',
  //     handleClick
  //     ,
  //     { capture: true } // capture phase to allow for stopPropogation on others
  //   )

  //   return () => {
  //     document.removeEventListener('click', handleClick, { capture: true }) // important to include options if it was specified
  //   }

  // }, [status])



  const ref = useRef(null)
  const rect = Math.min(Math.min(window.innerHeight * 0.8, window.innerWidth * 0.7),800)
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
  }, [])

  // if (status) {
  return <div className="absolute left-0 right-0 top-0 bottom-0 m-auto bg-gray-700 rounded-xl
    flex flex-col items-center border-gray-500 border-2
    "
    style={{
      width: state.rect,
      height: 1.1 * state.rect,
    }}
    ref={ref}
  >

    <div className='w-full overflow-hidden relative rounded-t-xl'
      style={{
        height: state.rect,
      }}
    >
      <div className='bg-transparent h-full flex select-none'

        style={{
          width: state.rect * (arr.length + 1),
          transform: `translateX(${state.dragging ? -state.dragLeft-4 : -state.pg * state.rect-4}px)`,
          transition: state.dragging ? null : elastic
        }}
      >
        {
          arr.map(
            (e, idx) => <div className='flex flex-col items-center text-base lg:text-xl'
              style={{ width: state.rect, height: '100%' }} key={idx}
            >
              <div className="bg-gray-800"
                style={{
                  width: state.rect * 0.8,
                  height: state.rect * 0.8,
                }}
              ></div>
              <div className='my-auto text-center text-gray-50'>
                {e[0]}
              </div>
            </div>
          )
        }


        <div className='flex flex-col items-center text-base lg:text-xl text-gray-50'
          style={{ width: state.rect, height: '100%' }}
        >
          <QuickStart/>
        </div>
      </div>


    </div>

    <div
      className="pointer-cursor bg-gray-200 rounded p-1 inline-block"
      onClick={() => setModal(false)}
    >
      Get Started
    </div>

    <div className='select-none absolute w-12 h-12 top-0 bottom-0 my-auto -left-24 fill-current bg-gray-100 rounded-full'
      onClick={() => carouselDispatch({ type: "move", del: -1 })}
    >
      <MdArrowBack className="w-full h-full text-gray-700 p-3" />
    </div>
    <div className='select-none absolute w-12 h-12 top-0 bottom-0 my-auto -right-24 fill-current bg-gray-100 rounded-full'
      onClick={() => carouselDispatch({ type: "move", del: 1 })}
    >
      <MdArrowForward className="w-full h-full text-gray-700 p-3" />
    </div>

    <div className="flex -bottom-8 absolute flex justify-center items-center">
      {Array(arr.length + 1).fill().map((ele, idx) => (
        <div key={idx} className={`h-2 w-2 mx-1 rounded-full ${idx == state.pg ? 'bg-gray-50' : 'bg-gray-500'}`}></div>
      ))}
    </div>

  </div >
  // } else {
  // return null
  // }
}