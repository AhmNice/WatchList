import React from 'react'
import OtpCard from '../components/Cards/OtpCard'
import ErrorCard from '../components/Cards/ErrorCard'
import { useAuthStore } from '../store/authStore'

const OtpPage = () => {
  document.title='WatchList - Verification'
  const { errorMsg } = useAuthStore()
  return (
    <section className="w-full flex flex-col gap-10 h-screen bg-[#141414] flex justify-center items-center">
      {errorMsg && <ErrorCard dismissible={true}/>}
      <OtpCard/>
    </section>
  )
}

export default OtpPage
