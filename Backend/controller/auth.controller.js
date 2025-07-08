import mongoose from 'mongoose';
import {
  passwordChangedSuccessEmail,
  sendAccountDeactivatedSuccessEmail,
  sendAccountDeleteRequestEmail,
  sendAccountDeletionSuccessEmail,
  sendDeactivationRequestEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail
} from "../mail/emails.js";
import { User } from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import { setSession } from '../utils/setSession.js';
import { generateOTP } from "../utils/generateOTP.js";
import { generateAccountDeleteToken, generateDeactivationToken, generateResetPasswordToken } from "../utils/generateToken.js";
// ✅ Create User
export const createUser = async (req, res) => {
  const { username, password, phoneNumber, email } = req.body;
  if (!username || !password || !phoneNumber || !email) {
    return res.status(400).json({ success: false, message: 'Required fields are empty' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User with this email already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = new User({
      username,
      password: hashedPassword,
      phoneNumber,
      email,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: otpExpires
    });

    await newUser.save();
    await setSession(res, newUser._id);
    await sendVerificationEmail(newUser.username, newUser.email, verificationCode);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User account created",
      user: userResponse
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// ✅ Verify OTP
export const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: 'OTP is required' });
  }

  try {
    const user = await User.findOne({ verificationToken: otp });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.username, user.email);

    return res.status(200).json({ success: true, message: 'Account verified successfully' });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// ✅ Resend OTP
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid user' });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified',
        redirect: true
      });
    }

    const verificationToken = generateOTP();
    const verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await sendVerificationEmail(user.username, user.email, verificationToken);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = verificationTokenExpiresAt;
    await user.save();

    return res.status(200).json({ success: true, message: 'OTP resent' });

  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// ✅ Login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Required fields are empty' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found' });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    await setSession(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// ✅ Logout
export const userLogout = async (req, res) => {
  try {
    const cookieName = 'watchList_session';
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });

    return res.status(200).json({ success: true, message: 'User logged out successfully' });

  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// ✅ password change request
export const userPasswordChangeRequest = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const token = generateResetPasswordToken();

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/password/reset-request/${token}`;
    await sendPasswordResetEmail(user.username, user.email, resetLink);

    return res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email'
    });

  } catch (error) {
    console.error('Password change request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
// ✅ Password Change
export const userPasswordChanged = async (req, res) => {
  const { userId, token, password, deviceType, location } = req.body;

  if (!userId || !token || !password) {
    return res.status(400).json({
      success: false,
      message: 'User ID, token, and password are required'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  try {
    const user = await User.findOne({ _id: userId, resetPasswordToken: token });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or token is invalid'
      });
    }

    if (user.resetPasswordExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;

    const resetDate = new Date().toLocaleDateString();
    const resetTime = new Date().toLocaleTimeString();

    await passwordChangedSuccessEmail(user.username, user.email, resetDate, deviceType, location, resetTime);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
// ✅ Deactivation Request
export const deactivationRequest = async (req, res) => {
  const { userId } = req

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    const deactivationToken = generateDeactivationToken();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.deactivationToken = deactivationToken;
    user.deactivationTokenExpiresAt = new Date();

    const confirmationLink = `${process.env.CLIENT_URL}/user/confirm-deactivation?token=${deactivationToken}&id=${user._id}`;
    const securityLink = `${process.env.CLIENT_URL}/user/settings`;

    await user.save();
    await sendDeactivationRequestEmail(user.username, user.email, confirmationLink, securityLink);

    return res.status(200).json({ success: true, message: 'Deactivation request sent' });

  } catch (error) {
    console.error('Error requesting account deactivation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// ✅ Deactivate Account
export const deactivateAccount = async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({
      success: false,
      message: 'User ID and token are required for deactivation'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.deactivationToken !== token) {
      return res.status(400).json({ success: false, message: 'Invalid deactivation token' });
    }

    const deactivationDate = new Date();
    const retentionPeriod = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const loginLink = `${process.env.CLIENT_URL}/user-login`;

    user.isActive = false;
    user.deactivationToken = null;

    await user.save();
    await userLogout(req, res);
    await sendAccountDeactivatedSuccessEmail(user.username, user.email, deactivationDate, retentionPeriod, loginLink);

    return res.status(200).json({
      success: true,
      message: 'User account deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating account:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// ✅ Delete User Account Request
export const deleteAccountRequest = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User id is required'
    })
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }
  try {
    const user = await User.findById({ _id: userId })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }
    const accountDeleteToken = generateAccountDeleteToken();
    const confirmationLink = `${CLIENT_URL}/user/delete-account/${accountDeleteToken}`
    const supportLink = `${CLIENT_URL}/support`
    await sendAccountDeleteRequestEmail(user.username, user.email, confirmationLink, supportLink);
    res.status(200).json({
      success: true,
      message: 'ConfirmationLink sent to your email'
    })
  } catch (error) {
    console.log('Error while trying to send ConfirmationLink')
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
// ✅ Delete User Account
export const deleteUserAccount = async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({
      success: false,
      message: 'User ID and token are required for this action.'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID.'
    });
  }

  try {
    const user = await User.findOne({
      _id: userId,
      deleteAccountToken: token
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or token is invalid.'
      });
    }

    if (user.deleteAccountTokenExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token has expired.'
      });
    }
    const deletionDate = new Date().toLocaleString();
    await sendAccountDeletionSuccessEmail(
      user.username,
      user.email,
      deletionDate
    );
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully.'
    });

  } catch (error) {
    console.error('Error deleting user account:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};
//✅ check if user is authenticated
export const checkAuth = async (req, res)=>{
  const userId = req.userId;
  if(!userId) {
    return res.status(401).json({
      success: false,
      message: 'User is not authenticated'
    })
  }
  try {
      const user = await User.findById(userId).select(`-password -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt -deactivationToken -deactivationTokenExpiresAT -deleteAccountToken -deleteAccountTokenExpiresAt`);
      if(!user){
        return res.status(404).json({
          success:false,
          message: 'User not found'
        })
      }
      return res.status(200).json({
        success:true,
        message: 'User is authenticated',
        user:user
      })
  } catch (error) {
    console.log(error.message)
    res.status(500),json({
      success: false,
      message: 'Internal server error'
    })
  }
}
export const forgetPasswordRequest = async(req, res) => {
  const { email } = req.body;
  if(!email){
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    })
  }
  try {
    const user = await User.findOne({ email});
    if(!user){
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const resetToken = generateResetPasswordToken();
    const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
    await user.save();
    const resetLink = `${process.env.CLIENT_URL}/password/reset-request/${resetToken}`;
    await sendPasswordResetEmail(user.username, user.email, resetLink);
    return res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email'
    });
  } catch (error) {
    console.error('Error in forget password request:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
export const changePassword = async(req, res) =>{
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email, token, and new password are required'
    });
  }
  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token
    })
    if( !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or token is invalid'
      });
    }
    if (user.resetPasswordTokenExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired'
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiresAt = null;
    await user.save();
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });

  }
}