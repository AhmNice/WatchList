import React from 'react';
import { motion } from 'framer-motion';
import {
  Film,
  List,
  Heart,
  Clock,
  MessageSquare,
  Star,
  UserPlus
} from 'lucide-react';

const RecentActivityCard = ({ activity, date }) => {
  // Map activity types to icons and colors
  const activityConfig = {
    playlist: {
      icon: <List size={16} />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    favorite: {
      icon: <Heart size={16} />,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    watch: {
      icon: <Film size={16} />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    review: {
      icon: <MessageSquare size={16} />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    rating: {
      icon: <Star size={16} />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    follow: {
      icon: <UserPlus size={16} />,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    },
    default: {
      icon: <Clock size={16} />,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10'
    }
  };

  const config = activityConfig[activity.type] || activityConfig.default;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 p-3 hover:bg-[#262626] rounded-lg transition-colors"
    >
      <div className={`p-2 rounded-full ${config.bgColor} ${config.color}`}>
        {config.icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{activity.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">
            {new Date(date).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
            {activity.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivityCard;