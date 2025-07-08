import { Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import SearchModal from './modals/SearchModal'
import Button from './button/Button'

const Navbar = () => {
  const navigate = useNavigate()
  const [searchModalActive, setSearchModalActive] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Support', path: '/support' },
    { name: 'Subscription', path: '/subscription' }
  ]

  const onClose = () => setSearchModalActive(false)
  const onClickSearch = () => setSearchModalActive(true)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <div className='flex justify-between items-center w-full md:pl-12 md:pr-12 lg:pr-12 lg:pr-12 p-4 py-2'>

      <div className='py-4 flex items-center justify-center text-white gap-3'>
        {/* Mobile menu toggle button */}
      <button
        className='lg:hidden text-white p-2'
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <span>☰</span>}
      </button>
        <img
          src="Vector.png"
          alt="WatchList logo"
          width={'40px'}
        />
        <p className='Manrope-SemiBold text-xl font-bold'>WatchList</p>
      </div>



      {/* Navigation - keeping your exact styling classes */}
      <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex absolute lg:relative w-full left-0 z-10 top-0 h-screen flex-col lg:flex-row lg:h-auto lg:w-max lg:z-0 gap-2 bg-[#0F0F0F]/90 backdrop-blur lg:bg-[#0F0F0F] p-3 lg:rounded-md lg:border lg:border-[#262626] lg:justify-evenly lg:items-center`}>
        {mobileMenuOpen && (
          <div className='flex justify-end lg:hidden'>
            <X
              size={24}
              className='text-white cursor-pointer'
              onClick={toggleMobileMenu}
            />
          </div>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className='Manrope-SemiBold text-white font-bold text-md px-4 py-1 rounded-md hover:bg-[#1f1f1f] hover:text-[#E50000]'
            onClick={toggleMobileMenu}
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className='flex items-center flex gap-3 '>
        <Search
          className='text-white cursor-pointer'
          onClick={onClickSearch}
          aria-label="Search"
        />
        <Button
          type='button'
          text={'Login'}
          onClick={() => navigate('/login')}
        />
      </div>

      {searchModalActive && <SearchModal onClose={onClose}/>}
    </div>
  )
}

export default Navbar