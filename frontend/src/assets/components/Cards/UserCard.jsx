import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Check, UserX, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import toast from 'react-hot-toast';

const UserCard = ({ user: cardUser, currentUserId, isFollowing, onFollowUpdate }) => {
  const [requesting, setRequesting] = useState(false);
  const [followStatus, setFollowStatus] = useState(isFollowing);
  const { user: currentUser } = useAuthStore();
  const { followUser, unFollowUser, errorMsg, successMsg } = useUserStore();
  const isCurrentUser = currentUserId === cardUser._id;

  const handleFollowAction = async () => {
    if (requesting) return;

    setRequesting(true);
    try {
      if (followStatus) {
        await unFollowUser(currentUserId, cardUser._id);
        toast.success('Unfollowed successfully');
      } else {
        await followUser(currentUserId, cardUser._id);
        toast.success('Followed successfully');
      }
      setFollowStatus(prev => !prev);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Operation failed');
      console.error('Follow action error:', error);
    } finally {
      setRequesting(false);
    }
  };



  useEffect(() => {
    setFollowStatus(isFollowing);
  }, [isFollowing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#1A1A1A] rounded-lg border border-[#262626] overflow-hidden hover:border-[#333] transition-colors"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#262626] flex items-center justify-center overflow-hidden">
              {cardUser.avatar ? (
                <img
                  src={cardUser.avatar}
                  alt={cardUser.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                  }}
                />
              ) : (
                <User size={24} className="text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {cardUser.username}
                {cardUser.isAdmin && (
                  <span className="text-xs px-2 py-0.5 bg-[#E50000] rounded-full">Admin</span>
                )}
              </h3>
              <p className="text-sm text-gray-400">{cardUser.role || 'Member'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Mail size={14} />
            <span className="truncate" title={cardUser.email}>{cardUser.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={14} />
            <span>Joined {new Date(cardUser.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#262626] px-4 py-3 bg-[#1F1F1F] flex justify-between items-center">
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold">{cardUser.followers?.length || 0}</div>
            <div className="text-gray-400 text-xs">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{cardUser.following?.length || 0}</div>
            <div className="text-gray-400 text-xs">Following</div>
          </div>
        </div>

        {!isCurrentUser && (
          <button
            onClick={handleFollowAction}
            disabled={requesting}
            className={`text-sm px-3 cursor-pointer py-1 rounded transition-colors flex items-center gap-2 min-w-[90px] justify-center ${followStatus
              ? 'bg-[#262626] border border-[#333] hover:border-[#FF1919] text-red-500 hover:text-red-400'
              : 'bg-[#E50000] hover:bg-[#FF1919] text-white'
              }`}
          >
            {requesting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                {followStatus ? <UserX size={16} /> : <Check size={16} />}
                {followStatus ? 'Unfollow' : 'Follow'}
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};
export default UserCard