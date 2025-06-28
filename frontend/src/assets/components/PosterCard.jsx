import React from 'react'

const PosterCard = ({src, alt}) => {
  return (
    <div className='w-36 h-40 overflow-hidden rounded-md border border-[#262626]'>
      <img src={src} alt={alt} className='w-full h-full object-fill'/>
    </div>
  )
}

export default PosterCard
