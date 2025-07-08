import React from 'react';
import {
  Home,
  ListVideo,
  History,
  Heart,
  Users,
  Compass,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { NavLink, replace, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import useScreen from '../hooks/useScreen';
import { useEffect } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, authenticated, checkingAuth, checkAuth } = useAuthStore();
    const { user } = useAuthStore()
    const { width } = useScreen()
    const isMovie = width < 780
  const handleLogout = async()=> {
    await logout();
  }
  
  const userSidebarLinks = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { label: "My Playlists", icon: <ListVideo size={20} />, path: "/playlists" },
    { label: "Watch History", icon: <History size={20} />, path: "/history" },
    { label: "Favorites", icon: <Heart size={20} />, path: "/favorites" },
    { label: "Shared With Me", icon: <Users size={20} />, path: "/shared" },
    { label: "Discover", icon: <Compass size={20} />, path: "/discover" },
    { label: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
    { label: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { label: "Logout", icon: <LogOut size={20} />, path: "/logout" },
  ];

  return (
  <div className={`h-full bg-[#0F0F0F] flex flex-col border-r border-[#262626] p-4  left-0 top-0 ${
    isMovie ? 'w-16' : 'w-full max-w-64'
  }`}>
    {/* Navigation Links */}
    <div className="flex-1 flex flex-col space-y-2 overflow-y-auto">
      {userSidebarLinks.slice(0, -1).map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-[#E50000] text-white Manrope-SemiBold'
                : 'text-gray-300 hover:bg-[#262626]'
            } ${isMovie ? 'justify-center' : ''}`
          }
          title={isMovie ? link.label : ''}  // Show tooltip on hover when collapsed
        >
          <span className="icon">{link.icon}</span>
          {!isMovie && <span className="font-medium">{link.label}</span>}
        </NavLink>
      ))}
    </div>

    {/* User Profile & Logout - Modified for mobile */}
    <div className="mt-auto pt-4 border-t border-[#262626]">
      {!isMovie ? (
        <>
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#262626] transition-colors mb-2">
            <div className="w-10 h-10 rounded-full bg-[#E50000] flex items-center justify-center text-white Manrope-SemiBold">
              <span className="text-sm font-medium">W</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white Manrope-SemiBold font-medium truncate">{user?.username||'Username'}</p>
              <p className="text-gray-400 Manrope-Regular text-xs truncate">{user?.email||'user@example.com'}</p>
            </div>
          </div>
          <button onClick={()=> handleLogout()} className="flex w-full cursor-pointer items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-[#262626]">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </>
      ) : (
        <>
          <NavLink to="/user" className="flex justify-center p-3 rounded-lg hover:bg-[#262626] mb-2">
            <div className=" hidden lg:block md:block lg:w-10 h-10 rounded-full bg-[#E50000] flex items-center justify-center text-white Manrope-SemiBold">
              <span className="text-sm font-medium">W</span>
            </div>
          </NavLink>
          <NavLink to="/logout" className="flex justify-center p-3 rounded-lg text-gray-300 hover:bg-[#262626]">
            <LogOut size={20} />
          </NavLink>
        </>
      )}
    </div>
  </div>
);
};

export default Sidebar;