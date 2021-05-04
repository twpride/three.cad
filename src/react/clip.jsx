import React from "react"
import { MdCancel } from 'react-icons/md'


export const Clip = ({ setClip, clip }) => {
  let width;
  if (window.innerWidth / 1.6 > window.innerHeight) {
    width = window.innerHeight * 1.6
  } else {
    width = window.innerWidth
  }

  width = Math.min(width * 0.9, 1024)
  const top = (window.innerHeight - (width / 1.6) - 32) / 2

  return (
    <div className='absolute left-0 right-0 m-auto flex flex-col
     overflow-hidden
     '
      style={{
        width,
        top,
      }}
    >
      <div className='text-xl flex justify-center items-center bg-green-500 '>
        <div className='text-gray-50'>
          {clip[1]}
        </div>
        <MdCancel className="absolute cursor-pointer text-gray-50 hover:text-gray-400  right-2"
          onClick={() => setClip(null)}
        />
      </div>
      <video 
      className='border-2 border-gray-500'

      src={clip[0]} width='100%' controls muted type="video/mp4" />
    </div>
  )
}

