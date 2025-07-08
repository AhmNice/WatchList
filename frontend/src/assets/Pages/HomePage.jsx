import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Faq from '../components/Faq'
import Footer from '../components/Footer'

const HomePage = () => {
  useEffect(()=>{
    document.title ='WatchList'
  },[])
  return (
      <section className='w-full h-full  bg-[#141414] min-h-screen'>
        <Hero/>
        <Categories/>
        <Faq/>
        <Footer/>
      </section>
  )
}

export default HomePage
