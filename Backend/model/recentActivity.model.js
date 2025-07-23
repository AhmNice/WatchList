import mongoose from 'mongoose';

const recentActivitySchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // the one performing the action
    },
    action: {
      type: String,
      enum: ['playlist','followed', 'unfollowed', 'posted', 'favorite', , 'updated-profile', 'joined', 'custom'],
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isPrivate: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export const RecentActivity = mongoose.model('RecentActivity', recentActivitySchema);
