import React from 'react'
import Login from '../components/Login'

const LoginPage = () => {
  document.title='WatchList - Login'
  return (
    <section className='w-full h-screen bg-[#141414] flex justify-center items-center'>
      <Login />
    </section>
  )
}

export default LoginPage
