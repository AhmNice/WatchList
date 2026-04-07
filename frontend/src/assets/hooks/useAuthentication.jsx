import React, { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
  const { checkingAuth, authenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const hasCheckedRef = useRef(false);
  const redirectingRef = useRef(false);

  // Memoize public routes for better performance
  const PUBLIC_ROUTES = ['/login', '/signup', '/forget-password', '/otp'];
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  // Memoize auth check to prevent unnecessary re-renders
  const initializeAuth = useCallback(async () => {
    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;
      await checkAuth();
    }
  }, [checkAuth]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle redirects based on auth state
  useEffect(() => {
    // Prevent multiple redirects
    if (redirectingRef.current) return;

    // Wait for auth check to complete
    if (checkingAuth) return;

    // Authenticated user trying to access public routes
    if (authenticated && isPublicRoute) {
      redirectingRef.current = true;
      navigate('/dashboard', { replace: true });
      return;
    }

    // Unauthenticated user trying to access protected routes
    if (!authenticated && !isPublicRoute && location.pathname !== '/') {
      redirectingRef.current = true;
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }

    // Reset redirect flag after successful navigation
    const timer = setTimeout(() => {
      redirectingRef.current = false;
    }, 100);

    return () => clearTimeout(timer);
  }, [checkingAuth, authenticated, isPublicRoute, location.pathname, navigate]);

  // Show loading screen while checking auth
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center bg-[#141414] min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-[#E50000] animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Prevent flash of content during redirect
  if (!authenticated && !isPublicRoute && location.pathname !== '/') {
    return (
      <div className="flex items-center justify-center bg-[#141414] min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-[#E50000] animate-spin" />
          <p className="text-gray-400 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;