import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

const AuthRedirect = ({ children }) => {
  const { checkingAuth, authenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!checkingAuth && authenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [checkingAuth, authenticated, navigate]);

  if (checkingAuth) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='animate-spin text-[#E50000]' size={24} />
      </div>
    );
  }


  return children;
};

export default AuthRedirect;
