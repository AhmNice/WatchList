import React, { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

const useVerify = ({children}) => {
  const { user, loading, errorMessage,checkAuth, authenticated, checkingAuth } = useAuthStore()

  const navigate = useNavigate()
  useEffect(()=>{
    checkAuth();
  },[])
  useEffect(()=>{
    if(!user.verified && !loading){
      navigate('/otp', {replace: true})
    }else if(!checkingAuth && authenticated ){
      navigate('/dashboard', {replace: true})
    }
  },[user])
  return children
}

export default useVerify