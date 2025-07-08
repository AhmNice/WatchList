import React, { useEffect } from 'react'
import ForgetPassword from '../components/ForgetPassword'

const ForgetPasswordPage = () => {
  useEffect(()=>{
  document.title = 'WatchList - Forget Password'
},[])
  return (
      <section className='w-full h-screen p-4 bg-[#141414] flex justify-center items-center'>
        <ForgetPassword />
       </section>
  )
}

export default ForgetPasswordPage