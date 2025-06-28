import {
  accountDeactivatedTemplate,
  accountVerificationTemplate,
  passwordResetSuccessTemplate,
  resetPasswordTemplate,
  welcomeTemplate,
  deactivateAccountRequestTemplate,
  accountDeletionTemplate,
  accountDeletionSuccessTemplate
} from "./templates.js";
import { transporter } from './mail.config.js';

// ✅ Send Verification Email
export const sendVerificationEmail = async (userName, email, verificationCode) => {
  const mailOptions = {
    from: `WatchList <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Account Verification',
    html: accountVerificationTemplate
      .replace('{userName}', userName)
      .replace('{code}', verificationCode)
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};
// ✅ Send Welcome Email
export const sendWelcomeEmail = async (userName, email) => {
  const mailOptions = {
    from: `WatchList <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Welcome To WatchList',
    html: welcomeTemplate
      .replace('{userName}', userName)
      .replace('{dashboardLink}', process.env.PROFILE_LINK)
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};
// ✅ Send Password Reset Email
export const sendPasswordResetEmail = async (userName, email, resetLink) => {
  const mailOptions = {
    from: `WatchList <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: resetPasswordTemplate
      .replace('{userName}', userName)
      .replace('{resetLink}', resetLink)
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
// ✅ Send Password Changed Email
export const passwordChangedSuccessEmail = async (
  userName,
  email,
  resetDate,
  deviceType,
  location,
  resetTime,
  timeZone,
  resetLink,
  supportLink,
  securitySettingsLink,
  loginLink
) => {
  const mailOptions = {
    from: `WatchList <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Password Changed',
    html: passwordResetSuccessTemplate
      .replace('{userName}', userName)
      .replace('{resetDate}', resetDate)
      .replace('{deviceType}', deviceType)
      .replace('{location}', location)
      .replace('{resetTime}', resetTime)
      .replace('{timezone}', timeZone)
      .replace('{resetLink}', resetLink)
      .replace('{supportLink}', supportLink)
      .replace('{securitySettingsLink}', securitySettingsLink)
      .replace('{loginLink}', loginLink)
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password changed email:', error);
    throw new Error('Failed to send password changed email');
  }
};
// ✅ Send Deactivation Request Email
export const sendDeactivationRequestEmail = async (
  userName,
  email,
  confirmationLink,
  securityLink
) => {
  const mailOptions = {
    from: `WatchList <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Account Deactivation Request',
    html: deactivateAccountRequestTemplate
      .replace('{userName}', userName)
      .replace('{confirmationLink}', confirmationLink)
      .replace('{securityLink}', securityLink)
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending account deactivation email:', error);
    throw new Error('Failed to send account deactivation email');
  }
};
// ✅ Send Deactivation Success Email
export const sendAccountDeactivatedSuccessEmail = async (
  username,
  email,
  deactivationDate,
  retentionPeriod,
  loginLink
) => {
  const mailOptions = {
    from: `WatchList <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Account Deactivated Successfully',
    html: accountDeactivatedTemplate
      .replace('{userName}', username)
      .replace('{deactivationDate}', deactivationDate)
      .replace('{retentionPeriod}', retentionPeriod)
      .replace('{loginLink}', loginLink)
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending account deactivation email:', error);
    throw new Error('Failed to send account deactivation email');
  }
};
// ✅ Send Account Deletion Request Email
export const sendAccountDeleteRequestEmail = async (username, email, confirmationLink, supportLink) => {
  const mailOptions = {
    from: `WatchList <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Account Deletion Request',
    html: accountDeletionTemplate
      .replace('{userName}', username)
      .replace('{confirmationLink}', confirmationLink)
      .replace('{supportLink}', supportLink)
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending account deletion request email:', error.message);
    throw new Error('Failed to send account deletion request email');
  }
};
// ✅ Send Account Deletion Success Email
export const sendAccountDeletionSuccessEmail = async (username, email, deletionDate) => {
  const formattedDate = new Date(deletionDate).toLocaleDateString(); // Optional formatting

  const mailOptions = {
    from: `WatchList <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Account Deleted Successfully',
    html: accountDeletionSuccessTemplate
      .replace('{userName}', username)
      .replace('{deletionDate}', formattedDate)
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending account deletion success email:', error.message);
    throw new Error('Failed to send account deletion success email');
  }
};
