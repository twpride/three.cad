
import React, { useCallback, useEffect, useReducer, useRef } from 'react';

import { MdArrowBack, MdArrowForward } from 'react-icons/md'

export function throttle(callback, limit) {
  let handler = null;                      // Initially, we're not waiting
  return (...args) => {                      // We return a throttled function
    if (!handler) {                       // If we're not waiting
      callback(...args);  // Execute users function
      handler = setTimeout(() => handler = null, limit);
    }
  }
}


function debounce(callback, delay) {
  let handler = null;
  return (...args) => {
    clearTimeout(handler);
    handler = setTimeout(() => callback(...args), delay);
  }
}


const transTime = 200

const elastic = `transform ${transTime}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;

function reducer(state, action) {
  switch (action.type) {
    case 'set-rect':
      return {
        ...state,
        rect: action.rect
      };
    case 'resize':
      return {
        ...state,
        rect: action.rect,
        dragLeft: state.pg * action.rect.width,
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
        dragLeft: state.pg * state.rect.width,
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
        pg: Math.round(state.dragLeft / state.rect.width),
        dragging: false
      };
    default:
      console.log('wtf')
      console.error(action)
  }
}

export const Carousel = () => {
  const arr = [1, 2, 3]

  const ref = useRef(null)
  const [state, dispatch] = useReducer(reducer, { rect: {}, pg: 0, dragLeft: 0, dragging: false })



  useEffect(() => {
    dispatch({ type: 'set-rect', rect: ref.current.getBoundingClientRect() })
  }, [ref])


  const updateSize = useCallback(
    debounce(
      () => {
        dispatch({ type: 'resize', rect: ref.current.getBoundingClientRect() })
      }
      , 200
    )
    , []
  )


  useEffect(() => {
    window.addEventListener('resize', updateSize)
  }, [])


  return <>


    <div className='bg-transparent h-full w-full'
      ref={ref}
    >
      {state.rect.width &&
        <div className='absolute top-0 overflow-visible bg-green-400 h-full'

          onMouseDown={() => dispatch({ type: 'drag-start' })}
          onMouseMove={(e) => e.buttons == 1 && dispatch({ type: 'drag', move: e.movementX })}
          onMouseUp={() => dispatch({ type: 'drag-end' })}

          style={{
            width: 1 * state.rect.width,
            transform: `translateX(${state.dragging ? -state.dragLeft : -state.pg * state.rect.width}px)`,
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
      }
    </div>

    <div className='select-none absolute w-12 h-12 top-0 bottom-0 my-auto -left-24 fill-current bg-gray-100 rounded-full'
      onClick={() => dispatch({ type: "move", del: -1 })}
    >
      <MdArrowBack className="w-full h-full text-gray-700 p-3" />
    </div>
    <div className='select-none absolute w-12 h-12 top-0 bottom-0 my-auto -right-24 fill-current bg-gray-100 rounded-full'
      onClick={() => dispatch({ type: "move", del: 1 })}
    >
      <MdArrowForward className="w-full h-full text-gray-700 p-3" />
    </div>

    <div className="flex w-full -bottom-8 absolute flex justify-center items-center">
      {arr.map((ele, idx) => (
        <div key={idx} className={`h-2 w-2 mx-1 rounded-full ${idx == state.pg ? 'bg-gray-50' : 'bg-gray-500'}`}></div>
      ))}
    </div>

  </>

}
