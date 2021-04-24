
import React, { useState } from 'react';

import { useDispatch} from 'react-redux'

import { sce } from './app'


const utf8decoder = new TextDecoder();

export const DropDown = () => {
  const arr = [
    ['https://raw.githubusercontent.com/twpride/threeCAD/master/demo_parts/headphones-stand.json.gz', 'headphones stand'],
  ]

  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const handleOutsideClick = (ev) => {
    /*
      this handles inside click as well due to bubbling, 
      sets the open/close state of drop down
    */
    setOpen(state => !state) // handle click on button & dropdown, always a toggle

    document.addEventListener( // handles click outside buttona & dropdown
      'pointerdown',
      (e) => { !e.composedPath().includes(ev.target.parentNode) && setOpen(false) }
      ,
      { capture: true, once: true } // capture phase to allow for stopPropogation on others
    )

  }

  const handleInsideClick = async (e) => {
    // handles click inside dropdown, business logic here
    const idx = Array.prototype.indexOf.call(e.target.parentNode.children, e.target)

    if (idx !== -1) {
      setOpen(false)

      const state = sce.loadState(
        utf8decoder.decode(
          new Zlib.Gunzip(
            new Uint8Array(
              await (
                await (
                  await fetch(arr[idx][0])
                ).blob()
              ).arrayBuffer()
            )
          ).decompress()
        )
      )

      dispatch({ type: 'restore-state', state })
      sce.render()
    }
  }

  return <div className="cursor-pointer w-28 h-full overflow-visible relative select-none"

  >
    <div className="btn text-gray-200 h-full w-full flex items-center justify-center" onClick={handleOutsideClick}>
      Demo Parts
    </div>
    {
      open &&
      <div className="absolute drop-down-top -left-10 w-48 p-1 rounded bg-gray-700"
        onClick={handleInsideClick}
      >
        {arr.map(([url, name], idx) => (
          <div className="w-full h-8 p-0.5 flex items-center bg-transparent text-gray-200
          hover:bg-gray-500 "
            key={idx}
          >
            {name}
          </div>
        ))}
        <div className="arrow"></div>
      </div>
    }
  </div>
}