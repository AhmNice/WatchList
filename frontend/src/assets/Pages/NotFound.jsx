import { ArrowLeft } from 'lucide-react'
import React from 'react'

const NotFound = () => {
  
  return (
    <div className='flex items-center flex flex-col h-screen justify-center bg-[#141414] min-h-screen'>
        <p className='Manrope-Bold text-[120px] font-lg'>404</p>
        <h1 className='Manrope-Bold text-3xl text-white mb-4 '>Page not found</h1>
        <button className='flex rounded-lg bg-[#E50000] gap-3 p-3 text-white Manrope-SemiBold' >
          <ArrowLeft size={24} className='text-white'/>
          Go back
        </button>
    </div>
  )
}

export default NotFound
