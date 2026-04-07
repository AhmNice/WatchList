import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useLocation,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./assets/store/authStore";
import Layout from "./root/Layout";
import HomePage from "./assets/Pages/HomePage";
import NotFound from "./assets/Pages/NotFound";
import LoginPage from "./assets/Pages/LoginPage";
import SignupPage from "./assets/Pages/SignupPage";
import OtpPage from "./assets/Pages/OtpPage";
import Dashboard from "./assets/Pages/Dashboard";
import MoviesPage from "./assets/Pages/MoviesPage";
import SupportPage from "./assets/Pages/SupportPage";
import PlaylistPage from "./assets/Pages/PlaylistPage";
import AuthWrapper from "./assets/hooks/useAuthentication";
import ForgetPasswordPage from "./assets/Pages/ForgetPasswordPage";
import PasswordRestPage from "./assets/pages/PasswordRestPage";
import DiscoverPage from "./assets/Pages/DiscoverPage";
import MovieDetailsPage from "./assets/Pages/MovieDetailsPage";
import useAutoRefreshData from "./assets/hooks/useRefreshData";
import RegularMoviePage from "./assets/Pages/RegularMoviePage";
import Settings from "./assets/Pages/Settings";
import FavoritePage from "./assets/Pages/FAvoritePage";
import RecommendationPage from "./assets/Pages/RecommendationPage";
import VerifyReminder from "./assets/components/modals/VerifyReminder";
import UsersPage from "./assets/Pages/UsersPage";
import ProfilePage from "./assets/Pages/ProfilePage";
import SharedPlaylistPage from "./assets/Pages/SharedPlaylistPage";

// Custom hook for scroll to top
function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

// ScrollToTop component
function ScrollToTop() {
  useScrollToTop();
  return null;
}

// Reminder component with logic
function VerifyReminderModal() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const shouldShow = user?.isVerified === false &&
      location.state?.from !== "signup";

    setIsVisible(shouldShow);
  }, [user, location.state]);

  if (!isVisible) return null;

  return (
    <VerifyReminder
      onClose={() => setIsVisible(false)}
      onAccept={() => console.log("Resend verification email")}
    />
  );
}

// Global providers wrapper
function GlobalProviders() {
  useAutoRefreshData();

  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
      <VerifyReminderModal />
    </>
  );
}

// Route configuration
const routes = (
  <Route element={<GlobalProviders />}>
    <Route path="/" element={<Layout />}>
      {/* Public routes */}
      <Route index element={<HomePage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="movies/:movieId" element={
        <>
          <ScrollToTop />
          <RegularMoviePage />
        </>
      } />

      {/* Auth routes */}
      <Route path="login" element={
        <AuthWrapper>
          <LoginPage />
        </AuthWrapper>
      } />

      <Route path="signup" element={
        <AuthWrapper>
          <SignupPage />
        </AuthWrapper>
      } />

      <Route path="forget-password" element={<ForgetPasswordPage />} />
      <Route path="password/reset-request/:token" element={<PasswordRestPage />} />
      <Route path="otp" element={<OtpPage />} />

      {/* Protected routes */}
      <Route path="dashboard" element={
        <AuthWrapper>
          <Dashboard />
        </AuthWrapper>
      } />

      <Route path="settings" element={
        <AuthWrapper>
          <Settings />
        </AuthWrapper>
      } />

      <Route path="favorites" element={
        <AuthWrapper>
          <FavoritePage />
        </AuthWrapper>
      } />

      <Route path="recommendations" element={
        <AuthWrapper>
          <RecommendationPage />
        </AuthWrapper>
      } />

      <Route path="playlists" element={
        <AuthWrapper>
          <PlaylistPage />
        </AuthWrapper>
      } />

      <Route path="users" element={
        <AuthWrapper>
          <UsersPage />
        </AuthWrapper>
      } />

      <Route path="profile" element={
        <AuthWrapper>
          <ProfilePage />
        </AuthWrapper>
      } />

      <Route path="discover" element={
        <AuthWrapper>
          <DiscoverPage />
        </AuthWrapper>
      } />

      <Route path="discover/movie/:movieId" element={
        <AuthWrapper>
          <MovieDetailsPage />
        </AuthWrapper>
      } />

      <Route path="shared" element={
        <AuthWrapper>
          <SharedPlaylistPage />
        </AuthWrapper>
      } />

      {/* Public routes */}
      <Route path="movies" element={<MoviesPage />} />
      <Route path="support" element={<SupportPage />} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Route>
);

const router = createBrowserRouter(createRoutesFromElements(routes));

// Main App
function App() {
  return <RouterProvider router={router} />;
}

export default App;