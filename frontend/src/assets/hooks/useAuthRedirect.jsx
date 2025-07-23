import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
  const { checkingAuth, authenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  // ✅ Only run once on mount
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!checkingAuth && !authenticated) {
      navigate('/login', { replace: true });
    }
  }, [checkingAuth, authenticated, navigate]);

  if (checkingAuth) {
    return (
      <div className='flex items-center justify-center bg-[#141414] min-h-screen'>
        <Loader2 size={24} className='text-[#E50000] animate-spin' />
      </div>
    );
  }

  return children;
};

export default AuthRedirect;
