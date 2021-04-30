

import React, { useCallback, useEffect, useReducer, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { MdCancel, MdArrowBack, MdArrowForward } from 'react-icons/md'

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
      return {
        ...state,
        rect: window.innerHeight * 0.6,
        dragLeft: state.pg * window.innerHeight * 0.6,
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

const transTime = 200

const elastic = `transform ${transTime}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;

export const Help = () => {

  const dispatch = useDispatch()
  const status = useSelector(state => state.ui.help)

  const handleClick = (e) => {
    if (!e.composedPath().includes(ref.current)
    ) {
      e.stopPropagation() // prevents mouse from immediately clicking nav button if over it
      dispatch({ type: 'set-help', status: false })

    }
  }

  useEffect(() => {
    if (!status) return

    document.addEventListener( // handles click outside buttona & dropdown
      'click',
      handleClick
      ,
      { capture: true } // capture phase to allow for stopPropogation on others
    )

    return () => {
      document.removeEventListener('click', handleClick, { capture: true }) // important to include options if it was specified
    }

  }, [status])



  const arr = [1, 2, 3]

  const ref = useRef(null)
  const [state, carouselDispatch] = useReducer(reducer, { rect: window.innerHeight * 0.6, pg: 0, dragLeft: 0, dragging: false })





  const updateSize = useCallback(
    debounce(
      () => {
        carouselDispatch({ type: 'resize' })
      }
      , 200
    )
    , []
  )


  useEffect(() => {
    window.addEventListener('resize', updateSize)
  }, [])

  if (status) {
    return <div className="absolute h-3/5 left-0 top-0 right-0 bottom-0 m-auto bg-transparent
    flex flex-col items-center
    "
      style={{
        width: 1 * state.rect,
      }}
      ref={ref}
    >
      <div className='absolute top-0 overflow-visible bg-green-400 h-full'

        onMouseDown={() => carouselDispatch({ type: 'drag-start' })}
        onMouseMove={(e) => e.buttons == 1 && carouselDispatch({ type: 'drag', move: e.movementX })}
        onMouseUp={() => carouselDispatch({ type: 'drag-end' })}

        style={{
          width: 1 * state.rect,
          transform: `translateX(${state.dragging ? -state.dragLeft : -state.pg * state.rect}px)`,
          transition: state.dragging ? null : elastic
        }}
      >
        {
          arr.map((e, idx) => {

            return <div key={idx} style={{}}>
              hi {e}
            </div>
          })
        }
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

      <div className="flex w-full -bottom-8 absolute flex justify-center items-center">
        {arr.map((ele, idx) => (
          <div key={idx} className={`h-2 w-2 mx-1 rounded-full ${idx == state.pg ? 'bg-gray-50' : 'bg-gray-500'}`}></div>
        ))}
      </div>
      <MdCancel className="btn-green absolute h-7 w-auto right-4 top-4"
        onClick={() => dispatch({ type: 'set-help', status: false })}
      />
    </div >
  } else {
    return null
  }
}