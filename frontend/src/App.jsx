import { useEffect, useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './assets/store/authStore'
import Layout from './root/Layout'
import HomePage from './assets/Pages/HomePage'
import NotFound from './assets/Pages/NotFound'
import LoginPage from './assets/Pages/LoginPage'
import SignupPage from './assets/Pages/SignupPage'
import OtpPage from './assets/Pages/OtpPage'
import Dashboard from './assets/Pages/Dashboard'
import MoviesPage from './assets/Pages/MoviesPage'
import SupportPage from './assets/Pages/SupportPage'
import PlaylistPage from './assets/Pages/PlaylistPage'
import AuthWrapper from './assets/hooks/useAuthentication'
import ForgetPasswordPage from './assets/Pages/ForgetPasswordPage'
import PasswordRestPage from './assets/pages/PasswordRestPage'
import AuthRedirect from './assets/hooks/useAuthRedirect'
import DiscoverPage from './assets/Pages/DiscoverPage'
import MovieDetailsPage from './assets/Pages/MovieDetailsPage'
import useAutoRefreshData from './assets/hooks/useRefreshData'
import RegularMoviePage from './assets/Pages/RegularMoviePage'
import Settings from './assets/Pages/Settings'
import FavoritePage from './assets/Pages/FAvoritePage'
import RecommendationPage from './assets/Pages/RecommendationPage'
import VerifyReminder from './assets/components/modals/VerifyReminder'

function App() {
  const { user } = useAuthStore()
  const [showReminder, setShowReminder] = useState(true)

  // Show reminder if user is logged in but not verified
  useEffect(() => {
    if (user && !user.isVerified) {
      setShowReminder(true)
    } else {
      setShowReminder(false)
    }
  }, [user])
  function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [pathname])

    return null
  }

  useAutoRefreshData()

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path={'*'} element={<NotFound />} />
        <Route path={'/home'} element={<HomePage />} />
        <Route path='/login' element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        } />
        <Route path='/forget-password' element={<ForgetPasswordPage />} />
        <Route path='/password/reset-request/:token' element={<PasswordRestPage />} />
        <Route path='/signup' element={
          <AuthRedirect>
            <SignupPage />
          </AuthRedirect>
        } />
        <Route path='/otp' element={<OtpPage />} />
        <Route path='/movies' element={<MoviesPage />} />
        <Route path='/support' element={<SupportPage />} />
        <Route path='/settings' element={
          <AuthWrapper>
            <Settings />
          </AuthWrapper>
        } />
        <Route path='/favorites' element={
          <AuthWrapper>
            <FavoritePage />
          </AuthWrapper>
        } />
        <Route path='/recommendations' element={
          <AuthWrapper>
            <RecommendationPage />
          </AuthWrapper>
        } />
        <Route path='/dashboard' element={
          <AuthWrapper>
            <Dashboard />
          </AuthWrapper>
        } />
        <Route path='/playlists' element={
          <AuthWrapper>
            <PlaylistPage />
          </AuthWrapper>
        } />
        <Route path='/discover' element={
          <AuthWrapper>
            <DiscoverPage />
          </AuthWrapper>
        } />
        <Route path='discover/movie/:movieId' element={
          <AuthWrapper>
            <MovieDetailsPage />
          </AuthWrapper>
        } />
        <Route path='/movies/:movieId' element={
          <>
            <ScrollToTop />
            <RegularMoviePage />
          </>
        } />
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      {showReminder && (
        <VerifyReminder
          onClose={() => setShowReminder(false)}
          onAccept={() => {
            // Add your resend verification email logic here
            console.log('Resend verification email')
          }}
        />
      )}
    </>
  )
}

export default App