
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';


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


export const Carousel = () => {
  const arr = [1, 2, 3]


  const ref = useRef(null)
  const [dragging, setDragging] = useState(false)

  // const dragging = useRef(false)
  const [rect, setRect] = useState({})
  const [pg, setPg] = useState(0)
  const [dragLeft, setDragLeft] = useState(0)





  useEffect(() => {
    setRect(ref.current.getBoundingClientRect())
  }, [ref])


  const updateSize = useCallback(
    debounce(
    // throttle(
      () => {
        setRect(ref.current.getBoundingClientRect())
      }
      , 200
    )
    , []
  )

  // const updateSize = () => setRect(ref.current.getBoundingClientRect())

 
  useEffect(() => {
    // dragging.current = false
    // console.log(dragging)
    // setDragLeft(pg * rect.width)
    // setDragging(false)
  }, [rect])

  useEffect(() => {
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])


  return <>
    <div
      className='select-none'
      onClick={
        () => setPg(pg + 1)
      }>1</div>
    <div
      className='select-none'
      onClick={
        () => setPg(pg - 1)
      }
    >2</div>
    <div
      ref={ref}
      className='relative overflow-visible bg-gray-200 h-full w-full'
    >
      {rect.width &&
        <div
          className='absolute overflow-visible bg-green-400'

          onMouseDown={() => {
            setDragging(true)
            // dragging.current = true
            setDragLeft(pg * rect.width)
          }}

          onMouseMove={(e) => {
            if (e.buttons != 1) return
            setDragLeft(state => state + e.movementX)
          }}

          onMouseUp={(e) => {
            // dragging.current = false
            setPg(Math.round(dragLeft / rect.width))
            setDragging(false)
          }}

          style={{
            height: '80%',
            width: 1 * rect.width,
            top: 0,
            // left: dragging ? dragLeft : pg * rect.width,
            left: 0,
            transform: `translateX(${dragging ? dragLeft : pg * rect.width}px)`,
            transition: dragging ? null : elastic
          }}>
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
  </>

}
