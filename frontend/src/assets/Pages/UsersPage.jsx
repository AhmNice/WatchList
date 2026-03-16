import React, { useEffect, useState } from "react";
// import Header from '../components/Header';
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Loader2, Search, Users, UserX } from "lucide-react";
import UserCard from "../components/Cards/UserCard";

import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

const UsersPage = () => {
  const { user } = useAuthStore();
  const { users, fetchUsers, loadingUsers, errorMsg } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Users - WatchList";
    fetchUsers();
  }, []);

  console.log(user);

  const filteredUsers = users?.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="flex h-screen bg-[#141414] overflow-hidden">
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <div className="h-16 flex-shrink-0">
          <Header />
        </div> */}

        {/* Scrollable Content */}
        <div className="flex-1 w-full text-white scrollbar-none overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users size={24} className="text-[#E50000]" />
                <span>Users</span>
              </h2>

              <div className="relative w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-[#262626] border border-[#333] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E50000]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-[#E50000]" size={32} />
              </div>
            ) : filteredUsers?.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredUsers.map((userData) => (
                  <UserCard
                    key={userData._id}
                    user={userData}
                    isFollowing={user?.following.includes(String(userData._id))}
                    currentUserId={user?._id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <UserX size={34} className="text-gray-500" />
                <p className="text-gray-400 text-lg">
                  {searchQuery
                    ? "No matching users found"
                    : "No users available"}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UsersPage;
