import { useEffect, useState } from 'react'
import LoginPage from './assets/Pages/LoginPage'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './root/Layout'
import { Toaster } from 'react-hot-toast'
import SignupPage from './assets/Pages/SignupPage'
import HomePage from './assets/Pages/HomePage'
import NotFound from './assets/Pages/NotFound'
import OtpPage from './assets/Pages/OtpPage'
import Dashboard from './assets/Pages/Dashboard'
import MoviesPage from './assets/Pages/MoviesPage'
import MovieDetails from './assets/Pages/MovieDetails'
import SupportPage from './assets/Pages/SupportPage'
import PlaylistPage from './assets/Pages/PlaylistPage'
import { useAuthStore } from './assets/store/authStore'
import AuthWrapper from './assets/hooks/useAuthentication'
import ForgetPasswordPage from './assets/Pages/ForgetPasswordPage'
import PasswordRestPage from './assets/pages/PasswordRestPage'
import AuthRedirect from './assets/hooks/useAuthRedirect'
import DiscoverPage from './assets/Pages/DiscoverPage'
function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout/>}>
        <Route index element={<HomePage/>}/>
        <Route path={'*'} element={<NotFound/>}/>
        <Route path={'/home'} element={<HomePage/>}/>
        <Route path='/login' element={
        <AuthRedirect>
          <LoginPage/>
        </AuthRedirect>
          }/>
        <Route path='/forget-password' element={<ForgetPasswordPage/>}/>
        <Route path='/password/reset-request/:token' element={<PasswordRestPage/>}/>
        <Route path='/signup' element={
          <AuthRedirect>
            <SignupPage/>
          </AuthRedirect>
        }/>
        <Route path='/otp' element={
          <useVerify>
            <OtpPage/>
          </useVerify>
        }/>
        <Route path='/movies' element={<MoviesPage/>}/>
        <Route path='/support' element={<SupportPage/>}/>
        <Route path='/dashboard' element={
          <AuthWrapper>
            <Dashboard/>
          </AuthWrapper>
        }/>
        <Route path='/playlists' element={
          <AuthWrapper>
            <PlaylistPage/>
          </AuthWrapper>
        }/>
        <Route path='/discover' element={
          <AuthWrapper>
            <DiscoverPage/>
          </AuthWrapper>
        }/>
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
