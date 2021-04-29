import { Bezier } from '../../extlib/cubicBezier'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const bezier = Bezier(0.4, 0.0, 0.2, 1);


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


export const Carousel = () => {
  const arr = [1, 2, 3]


  const [pg, setPg] = useState(0)
  const [left, setLeft] = useState(0)
  const cardSlideStartTime = useRef(null)
  const leftStart = useRef(null)
  const delta = useRef(null)
  const ref = useRef(null)

  const [rect, setRect] = useState({})
  window.pp = pg

  const cardSlideLoop = useCallback(
    function (timestamp) {
      if (!rect.width) return;
      if (!cardSlideStartTime.current) { // first req anim call
        cardSlideStartTime.current = timestamp;
        leftStart.current = left;

        delta.current = pg * rect.width - left;
      }

      const elapsed = timestamp - cardSlideStartTime.current;

      if (elapsed < 200) { // when animation is stil running
        setLeft(leftStart.current + bezier(elapsed / 200) * delta.current)
        requestAnimationFrame(cardSlideLoop);
      } else {  // when animation completes
        setLeft(leftStart.current + delta.current)
        cardSlideStartTime.current = null;
      }
    }, [pg, rect]
  )

  const inc = useCallback(
    throttle(
      (dir) => setPg(state => state + dir)
      , 200
    )
    , []
  )



  const updateSize = useCallback(
    debounce(
      () => {
        const rect = ref.current.getBoundingClientRect()
        setRect(rect)
        setLeft(pg * rect.width)
      }
      , 200
    )
    , [pg]
  )


  useEffect(() => requestAnimationFrame(cardSlideLoop), [pg])

  useEffect(() => {
    setRect(ref.current.getBoundingClientRect())
  }, [])


  useLayoutEffect(() => {


    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)

  }, [pg])

  return <>
    <div
      className='select-none'
      onClick={
        () => inc(1)
      }>1</div>
    <div
      className='select-none'
      onClick={
        () => inc(-1)
      }
    >2</div>
    <div
      ref={ref}
      className='relative overflow-visible bg-gray-200 h-full w-full'
    >
      {rect.width &&
        <div
          className='absolute overflow-visible bg-green-400'
          style={{
            height: '80%',
            width: 3 * rect.width,
            top: 0,
            left,
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
