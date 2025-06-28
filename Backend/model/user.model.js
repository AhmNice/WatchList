import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  playList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive:{
    type:Boolean,
    default:true
  },

  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  deactivationToken: String,
  deactivationTokenExpiresAt: Date,
  deactivationDate: Date,
  deleteAccountToken:String,
  deleteAccountTokenExpiresAt: Date
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);