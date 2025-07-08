import React, { useEffect } from 'react'
import ForgePasswordReset from '../components/ForgePasswordReset'

const ForgetPasswordPage = () => {
  useEffect(()=>{
  document.title = 'WatchList - Reset Password'
},[])
  return (
      <section className='w-full h-screen p-4 bg-[#141414] flex justify-center items-center'>
        <ForgePasswordReset />
       </section>
  )
}

export default ForgetPasswordPage