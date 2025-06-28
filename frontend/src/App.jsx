import { useState } from 'react'
import LoginPage from './assets/Pages/LoginPage'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './root/Layout'
import { Toaster } from 'react-hot-toast'
import SignupPage from './assets/Pages/SignupPage'
import HomePage from './assets/Pages/HomePage'
import NotFound from './assets/Pages/NotFound'
import OtpPage from './assets/Pages/OtpPage'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout/>}>
        <Route index element={<HomePage/>}/>
        <Route path={'*'} element={<NotFound/>}/>
        <Route path={'/home'} element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/otp' element={<OtpPage/>}/>
      </Route>
    )
  )

  return (
  <>
   <RouterProvider router={router}/>
   <Toaster/>
   </>
  )
}

export default App
