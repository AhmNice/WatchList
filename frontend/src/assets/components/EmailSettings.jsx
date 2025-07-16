import React from 'react'
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { useEffect } from 'react';

const EmailSettings = () => {
  const { user, authenticated} =useAuthStore()
  const [userDetails, setUserDetails] = useState({
    email:'',
    newEmail:''
  })
  const handleChange = (e)=>{
    const {name, value } = e.target
    setUserDetails(prev => ({
      ...prev,
      [name]:value
    }))
  }
  useEffect(()=>{
    setUserDetails({
      email:user.email || 'useremail@email.com'
    })
  },[user])
  return (
     <div>
    <h2 className="text-2xl font-bold mb-6">Email Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Current Email</label>
        <input
          type="email"
          value={userDetails.email}
          name='email'
          className="w-full bg-[#262626] border border-[#333] rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-[#E50000] focus:border-transparent"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">New Email</label>
        <input
          type="email"
          className="w-full outline-none bg-[#262626] border border-[#333] rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-[#E50000] focus:border-transparent"
          placeholder="Enter new email"
        />
      </div>

      <div className="flex justify-end">
        <button className="px-6 cursor-pointer py-2 bg-[#E50000] rounded-md hover:bg-[#FF1919] transition">
          Update Email
        </button>
      </div>
    </div>
  </div>
  )
};

export default EmailSettings