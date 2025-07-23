import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Edit, Lock, Mail, User, Calendar, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useFavStore } from '../store/favoriteStore';
import { usePlaylistStore } from '../store/playlistStore';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore();
  const { favorite } = useFavStore()
  const { playlists } = usePlaylistStore()
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [stats, setStats] = useState({
    playlists: playlists?.length || 0,
    favorites: favorite?.length ||0,
    watched: 0
  });

  useEffect(() => {
    document.title = "Profile - WatchList";
    // fetchProfileData();
  }, []);
  console.log(user.passwordLastChanged)
  // const fetchProfileData = async () => {
  //   try {
  //     setLoading(true);
  //     // Replace with your actual API endpoints
  //     const [profileRes, statsRes] = await Promise.all([
  //       axios.get('/api/user/profile'),
  //       axios.get('/api/user/stats')
  //     ]);
  //     setUser(profileRes.data);
  //     setStats(statsRes.data);
  //   } catch (error) {
  //     toast.error('Failed to load profile data');
  //     console.error('Profile error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleProfileUpdate = (updatedData) => {
    // setUser({ ...user, ...updatedData });
    toast.success('Profile updated successfully');
  };

  return (
    <section className="flex h-screen bg-[#141414] overflow-hidden">
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Scrollable Content */}
        <div className="flex-1 w-full text-white scrollbar-none overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-[#E50000]" size={32} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-[#262626] flex items-center justify-center overflow-hidden border-2 border-[#E50000]">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} className="text-gray-400" />
                    )}
                  </div>
                  <button
                    className="absolute bottom-0 right-0 bg-[#E50000] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setEditModalOpen(true)}
                  >
                    <Edit size={16} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-bold">{user?.username}</h1>
                    <button
                      onClick={() => { navigate('/settings')}}
                      className="flex items-center gap-2 px-4 py-2 bg-[#262626] rounded-lg hover:bg-[#333] transition-colors"
                    >
                      <Edit size={16} />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                  <p className="text-gray-400 mb-4">{user?.bio || 'No bio yet'}</p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail size={16} />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} />
                      <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#262626]">
                  <h3 className="text-gray-400 mb-2">Playlists</h3>
                  <p className="text-2xl font-bold">{stats.playlists}</p>
                </div>
                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#262626]">
                  <h3 className="text-gray-400 mb-2">Favorites</h3>
                  <p className="text-2xl font-bold">{stats.favorites}</p>
                </div>
                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#262626]">
                  <h3 className="text-gray-400 mb-2">Watched</h3>
                  <p className="text-2xl font-bold">{stats.watched}</p>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#262626] mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Lock size={20} />
                    <span>Security</span>
                  </h2>
                  <button
                    onClick={() =>{
                      navigate('/settings')
                    } }
                    className="px-4 py-2 bg-[#E50000] rounded-lg hover:bg-[#FF1919] transition-colors"
                  >
                    Change Password
                  </button>
                </div>
                <p className="text-gray-400">{`Last changed: ${user.passwordLastChanged || 'Password has not been changed'}`}</p>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#262626]">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="text-gray-400 p-4 bg-[#262626] rounded-lg">
                    No recent activity
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;