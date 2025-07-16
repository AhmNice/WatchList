import React, { useRef } from 'react'
import Navbar from '../components/Navbar'
import MovieDetails from '../components/MovieDetails'
import Header from '../components/Header'
import Sidebar from "../components/Sidebar"
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const MovieDetailsPage = () => {
  const containerRef = useRef()
  const { movieId } = useParams()
  const navigate = useNavigate()
  return (
    <div className="flex h-screen bg-[#141414] overflow-hidden">
      <div className=" md:block h-full  flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 flex-shrink-0">
          <Header />
        </div>

        {/* Scrollable Content Area */}
        <main ref={containerRef} className="flex-1 w-full overflow-y-auto p-2  scrollbar-none">
          <ArrowLeft size={24} className='text-white mb-4 cursor-pointer' onClick={()=>navigate(-1)}/>
          <MovieDetails movieId={movieId} location='discover' containerRef={containerRef}/>
        </main>

      </div>
    </div>
  )
}

export default MovieDetailsPage