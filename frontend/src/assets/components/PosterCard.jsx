import React from 'react'

const PosterCard = ({src, alt}) => {
  return (
    <div className='md:w-36 lg:w-36 md:h-40 lg:40 w-32 h-36 overflow-hidden rounded-md border border-[#262626]'>
      <img src={src} alt={alt} className='w-full h-full object-fill'/>
    </div>
  )
}

export default PosterCard
