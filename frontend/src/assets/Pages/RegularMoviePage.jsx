import React, { useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MovieDetails from '../components/MovieDetails'
import { useLocation } from 'react-router-dom'

const RegularMoviePage = () => {
  const containerRef = useRef()
  const location = useLocation()

  // Scroll to top whenever the location changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <section ref={containerRef} className="w-full min-h-screen bg-[#141414] overflow-auto">
      <Navbar/>
      <div>
        <MovieDetails containerRef={containerRef}/>
      </div>
    </section>
  )
}

export default RegularMoviePage