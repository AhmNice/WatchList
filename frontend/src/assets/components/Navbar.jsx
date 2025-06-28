import { Search } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  const navItems = [
    'Home','Movies','Support', 'Subscription'
  ]
  return (
    <div className='flex justify-between items-center w-full pl-12 pr-12 py-2'>
      <div className='py-4 flex items-center justify-center text-white gap-3'>
        <img src="Vector.png" alt="logo" width={'40px'}/>
        <p className='Manrope-SemiBold text-xl font-bold'>WatchList</p>
      </div>
      <div className='flex gap-2 bg-[#0F0F0F] p-3 rounded-md border border-[#262626] justify-evenly items-center'>
        {navItems.map((item)=>(
          <NavLink to={`/${item}`} className='Manrope-SemiBold text-white font-bold text-md px-4 py-1 rounded-md hover:bg-[#1f1f1f] hover:text-[#E50000]'>{item}</NavLink>
        ))}
      </div>

      <div className='flex items-center '>
        <Search className='text-white cursor-pointer'/>

      </div>
    </div>
  )
}

export default Navbar
