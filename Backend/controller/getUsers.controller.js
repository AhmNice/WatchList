import mongoose from 'mongoose';
import { User } from '../model/user.model.js';

// Get all users excluding sensitive fields
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(`
      -resetPasswordToken
      -password
      -resetPasswordTokenExpiresAt
      -verificationToken
      -verificationTokenExpiresAt
      -deactivationToken
      -deactivationTokenExpiresAt
      -deactivationDate
      -deleteAccountToken
      -deleteAccountTokenExpiresAt
    `);

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching users',
      error: error.message
    });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  const { targetUserId, userId } = req.params || req.body;

  if (!targetUserId || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Both userId and targetUserId are required'
    });
  }

  if (targetUserId === userId) {
    return res.status(400).json({
      success: false,
      message: 'You cannot follow yourself'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID(s)'
    });
  }

  try {
    const currentUser = await User.findById(userId).select(`
      -resetPasswordToken
      -password
      -resetPasswordTokenExpiresAt
      -verificationToken
      -verificationTokenExpiresAt
      -deactivationToken
      -deactivationTokenExpiresAt
      -deactivationDate
      -deleteAccountToken
      -deleteAccountTokenExpiresAt
    `);
    const targetUser = await User.findById(targetUserId).select(`
      -resetPasswordToken
      -password
      -resetPasswordTokenExpiresAt
      -verificationToken
      -verificationTokenExpiresAt
      -deactivationToken
      -deactivationTokenExpiresAt
      -deactivationDate
      -deleteAccountToken
      -deleteAccountTokenExpiresAt
    `);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Avoid duplicates using Set logic
    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
    }

    if (!targetUser.followers.includes(userId)) {
      targetUser.followers.push(userId);
    }

    await currentUser.save();
    await targetUser.save();

    const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordTokenExpiresAt -verificationToken -verificationTokenExpiresAt -deactivationToken -deactivationTokenExpiresAt -deactivationDate -deleteAccountToken -deleteAccountTokenExpiresAt');

    return res.status(200).json({
      success: true,
      message: `Now following ${targetUser.username}`,
      users,
      currentUser
    });

  } catch (error) {
    console.error('Error in followUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


export const unFollowUser = async (req, res) => {
  const { targetUserId, userId } = req.params;

  if (!targetUserId || !userId) {
    return res.status(400).json({
      success: false,
      message: 'User IDs are required',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid User ID(s)',
    });
  }

  try {
    const currentUser = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordTokenExpiresAt -verificationToken -verificationTokenExpiresAt -deactivationToken -deactivationTokenExpiresAt -deactivationDate -deleteAccountToken -deleteAccountTokenExpiresAt');
    const targetUser = await User.findById(targetUserId).select('-password -resetPasswordToken -resetPasswordTokenExpiresAt -verificationToken -verificationTokenExpiresAt -deactivationToken -deactivationTokenExpiresAt -deactivationDate -deleteAccountToken -deleteAccountTokenExpiresAt');

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User(s) not found',
      });
    }

    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user',
      });
    }

    // Remove target user from current user's following list
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId
    );

    // Remove current user from target user's followers list
    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== userId
    );
    await currentUser.save();
    await targetUser.save();
    const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordTokenExpiresAt -verificationToken -verificationTokenExpiresAt -deactivationToken -deactivationTokenExpiresAt -deactivationDate -deleteAccountToken -deleteAccountTokenExpiresAt');

    return res.status(200).json({
      success: true,
      message: `You unfollowed ${targetUser.username}`,
      currentUser,
      users,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

