import { User } from 'lucide-react';
import React from 'react'
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { useEffect } from 'react';

const ProfileSettings = () => {
  const { user , authenticated} = useAuthStore()
  const [userDetails, setUserDetails] = useState({
    userName: 'username',
    email:'email',
    profile:'',
    bio:''
  })
  useEffect(()=>{
    setUserDetails({
      userName: user.username || 'user',
      email:user.email || 'example1234@gmail.com',
      bio:user.bio || ''
    })
  },[user])
  const handleChange =(e)=>{
    const { name, value} = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]:value
    }))
  }
return (
  <div>
    <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#262626] flex items-center justify-center">
            <User size={24} className="text-gray-400" />
          </div>
          <div className="space-x-3">
            <button className="px-4 py-2 bg-[#E50000] rounded-md">Upload</button>
            <button className="px-4 py-2 border border-[#262626] rounded-md">Remove</button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
        <input
          type="text"
          name='userName'
          className="w-full outline-none bg-[#262626] border border-[#333] rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-[#E50000] focus:border-transparent"
          placeholder="Enter your username"
          onChange={(e)=>{
            handleChange(e)
          }}
          value={userDetails.userName}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
        <textarea
          className="w-full bg-[#262626] outline-none border border-[#333] rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-[#E50000] focus:border-transparent"
          rows={4}
          placeholder="Tell us about yourself"
          name='bio'
          onChange={(e)=>{
            handleChange(e)
          }}
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button className="px-6 cursor-pointer py-2 bg-[#E50000] rounded-md hover:bg-[#FF1919] transition">
          Save Changes
        </button>
      </div>
    </div>
  </div>
)
};

export default ProfileSettings