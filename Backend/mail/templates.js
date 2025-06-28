export const accountVerificationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .code {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Email Verification</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">Thank you for registering with WatchList!</p>
    <p style="margin: 16px 0;">Your email verification code is:</p>

    <div class="code" style="font-size: 28px; font-weight: bold; background: #f0f4ff; color: #2d3a6e; padding: 16px 0; text-align: center; border-radius: 6px; letter-spacing: 4px; margin: 24px 0;">
      {code}
    </div>

    <p style="margin: 16px 0;">Please enter this code in the app to verify your email address. Do not share this code with anyone.</p>
    <p style="margin: 16px 0; color: #888;">If you did not request this, please ignore this email.</p>

    <p style="margin: 32px 0 16px 0;">Best regards,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const resetPasswordTemplate =''
export const welcomeTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to WatchList</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .button {
        padding: 12px 0 !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Welcome to WatchList!</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">Thank you for joining WatchList! We're excited to have you on board.</p>
    <p style="margin: 16px 0;">Your account has been successfully created and is ready to use.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{dashboardLink}" class="button" style="background-color: #2d3a6e; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Go to Dashboard
      </a>
    </div>

    <p style="margin: 16px 0;">Get started by:</p>
    <ul style="margin: 16px 0; padding-left: 24px;">
      <li>Creating your first watchlist</li>
      <li>Exploring trending content</li>
      <li>Setting up notifications</li>
    </ul>

    <p style="margin: 32px 0 16px 0;">Happy watching!<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const passwordResetTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .button {
        padding: 12px 0 !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Password Reset</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">We received a request to reset your WatchList account password.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{resetLink}" class="button" style="background-color: #2d3a6e; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>

    <p style="margin: 16px 0; color: #888;">This link will expire in 24 hours. If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>

    <p style="margin: 16px 0;">For security reasons, we don't store your password. If you need help, contact our support team at <a href="mailto:support@watchlist.com" style="color: #2d3a6e;">support@watchlist.com</a>.</p>

    <p style="margin: 32px 0 16px 0;">Stay secure,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const passwordResetSuccessTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .security-tip {
        padding: 12px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Password Reset Successful</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">Your WatchList password has been successfully updated on <span style="font-weight: 600;">{resetDate}</span>.</p>

    <div class="security-tip" style="background: #f0f4ff; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #2d3a6e;">🔒 Security Notification:</p>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Changed from device: <strong>{deviceType}</strong></li>
        <li>Approximate location: <strong>{location}</strong></li>
        <li>Time: <strong>{resetTime} ({timezone})</strong></li>
      </ul>
    </div>

    <p style="margin: 16px 0;">If you didn't make this change:</p>
    <ol style="margin: 16px 0; padding-left: 20px;">
      <li>Reset your password immediately using the <a href="{resetLink}" style="color: #2d3a6e; font-weight: 600;">forgot password</a> feature</li>
      <li>Contact our <a href="{supportLink}" style="color: #2d3a6e; font-weight: 600;">support team</a> if you need assistance</li>
      <li>Review your <a href="{securitySettingsLink}" style="color: #2d3a6e; font-weight: 600;">security settings</a></li>
    </ol>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{loginLink}" class="button" style="background-color: #2d3a6e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Log In to Your Account
      </a>
    </div>

    <p style="margin: 32px 0 16px 0;">Stay secure,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const accountDeletionTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deletion Request</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .button {
        padding: 12px 0 !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Account Deletion Request</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">We received a request to delete your WatchList account.</p>

    <div style="background: #fff8f8; border-left: 4px solid #ff6b6b; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; font-weight: bold; color: #d32f2f;">⚠️ Important:</p>
      <p style="margin: 8px 0 0 0;">This action will permanently delete your account and all associated data. This cannot be undone.</p>
    </div>

    <p style="margin: 16px 0;">To confirm account deletion, please click the button below:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{confirmationLink}" class="button" style="background-color: #d32f2f; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Confirm Account Deletion
      </a>
    </div>

    <p style="margin: 16px 0; color: #888;">If you didn't request this, please secure your account by changing your password and contact our <a href="{supportLink}" style="color: #2d3a6e;">support team</a> immediately.</p>

    <p style="margin: 32px 0 16px 0;">Best regards,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const accountDeletionSuccessTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deletion Confirmation</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Account Deletion Complete</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">Your WatchList account and all associated data have been permanently deleted as of <strong>{deletionDate}</strong>.</p>

    <div style="background: #f0f4ff; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <p style="margin: 0; font-weight: bold; color: #2d3a6e;">ℹ️ What this means:</p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>All personal data has been removed from our systems</li>
        <li>You can no longer access your account</li>
        <li>This action cannot be reversed</li>
      </ul>
    </div>

    <p style="margin: 16px 0;">If you wish to use WatchList again in the future, you'll need to create a new account.</p>

    <p style="margin: 16px 0;">We're sorry to see you go. If this was a mistake or you'd like to provide feedback, please contact us at <a href="mailto:feedback@watchlist.com" style="color: #2d3a6e;">feedback@watchlist.com</a>.</p>

    <p style="margin: 32px 0 16px 0;">Thank you for being part of WatchList,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const otpSentTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .otp-code {
        font-size: 24px !important;
        padding: 12px 0 !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">One-Time Password</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">Your verification code for {purpose} is:</p>

    <div class="otp-code" style="font-size: 28px; font-weight: bold; background: #f0f4ff; color: #2d3a6e; padding: 16px 0; text-align: center; border-radius: 6px; letter-spacing: 4px; margin: 24px 0;">
      {otpCode}
    </div>

    <p style="margin: 16px 0;">This code will expire in <strong>{expiryTime} minutes</strong>. Please do not share it with anyone.</p>

    <div class="security-note" style="border-left: 3px solid #2d3a6e; padding-left: 12px; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; color: #666;">If you didn't request this code, your account may be compromised. Please <a href="{supportLink}" style="color: #2d3a6e; font-weight: 600;">contact support</a> immediately.</p>
    </div>

    <p style="margin: 32px 0 16px 0;">Best regards,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const otpVerifiedTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Successful</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .success-box {
        padding: 12px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Verification Successful</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">Your {verificationType} has been successfully verified on <strong>{verificationDate}</strong>.</p>

    <div class="success-box" style="background: #f0fff4; border-left: 4px solid #38a169; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; font-weight: bold; color: #38a169;">✓ Verification Details:</p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Type: <strong>{verificationType}</strong></li>
        <li>Device: <strong>{deviceType}</strong></li>
        <li>Time: <strong>{verificationTime}</strong></li>
      </ul>
    </div>

    <p style="margin: 16px 0;">You can now access all features associated with your verified account.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{dashboardLink}" class="button" style="background-color: #2d3a6e; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Go to Dashboard
      </a>
    </div>

    <p style="margin: 16px 0; color: #888;">If you didn't perform this verification, please <a href="{securityLink}" style="color: #2d3a6e;">secure your account</a> immediately.</p>

    <p style="margin: 32px 0 16px 0;">Best regards,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const passwordChangedTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed Successfully</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .security-box {
        padding: 12px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Password Changed Successfully</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">Your WatchList password was successfully changed on <strong>{changeDate}</strong> at <strong>{changeTime}</strong>.</p>

    <div class="security-box" style="background: #f0f4ff; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #2d3a6e;">🛡️ Change Details:</p>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Device: <strong>{deviceType}</strong></li>
        <li>Location: <strong>{location}</strong></li>
        <li>IP Address: <strong>{ipAddress}</strong></li>
      </ul>
    </div>

    <p style="margin: 16px 0;">If you didn't make this change:</p>
    <ol style="margin: 16px 0; padding-left: 20px;">
      <li>Secure your account immediately by <a href="{resetLink}" style="color: #2d3a6e; font-weight: 600;">resetting your password</a></li>
      <li>Review your <a href="{securitySettingsLink}" style="color: #2d3a6e; font-weight: 600;">security settings</a></li>
      <li>Contact <a href="{supportLink}" style="color: #2d3a6e; font-weight: 600;">support</a> if you need help</li>
    </ol>

    <p style="margin: 32px 0 16px 0;">Stay secure,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const deactivateAccountRequestTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deactivation Request</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .button {
        padding: 12px 0 !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Account Deactivation Request</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">We received a request to temporarily deactivate your WatchList account.</p>

    <div style="background: #fff8f8; border-left: 4px solid #ff9800; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; font-weight: bold; color: #d32f2f;">⚠️ Please Note:</p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Your profile and data will be hidden but not deleted</li>
        <li>You can reactivate your account anytime by logging in</li>
        <li>Some data may remain visible to others per our privacy policy</li>
      </ul>
    </div>

    <p style="margin: 16px 0;">To proceed with deactivation, please click below:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{confirmationLink}" class="button" style="background-color: #ff9800; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Confirm Deactivation
      </a>
    </div>

    <p style="margin: 16px 0; color: #888;">If you didn't request this, please <a href="{securityLink}" style="color: #2d3a6e;">secure your account</a> immediately.</p>

    <p style="margin: 32px 0 16px 0;">Best regards,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const accountDeactivatedTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deactivated</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .reactivate-button {
        padding: 12px 24px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Account Deactivated</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">Your WatchList account has been temporarily deactivated as of <strong>{deactivationDate}</strong>.</p>

    <div style="background: #f0f4ff; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <p style="margin: 0; font-weight: bold; color: #2d3a6e;">ℹ️ What to expect:</p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Your profile is now hidden from other users</li>
        <li>You won't receive notifications or emails</li>
        <li>All your data is preserved for {retentionPeriod}</li>
      </ul>
    </div>

    <p style="margin: 16px 0; font-weight: 600;">To reactivate your account:</p>
    <ol style="margin: 16px 0; padding-left: 20px;">
      <li>Simply log in with your existing credentials</li>
      <li>Your account will be restored immediately</li>
      <li>All your data and settings will be preserved</li>
    </ol>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{loginLink}" class="reactivate-button" style="background-color: #2d3a6e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reactivate Account
      </a>
    </div>

    <p style="margin: 32px 0 16px 0;">We hope to see you again soon,<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`
export const accountReactivationRequestTemplate =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reactivate Your Account</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px auto !important;
        padding: 24px !important;
      }
      .otp-code {
        font-size: 24px !important;
        padding: 12px 0 !important;
      }
      .button {
        padding: 12px 24px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Manrope', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
  <div class="container" style="max-width: 480px; margin: 40px auto; background: #fff; box-shadow: 0 2px 8px #eee; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #2d3a6e;">Reactivate Your Account</h1>
      <div style="height: 4px; width: 60px; background: #2d3a6e; margin: 0 auto;"></div>
    </div>

    <p style="margin: 16px 0;">Hello {userName},</p>
    <p style="margin: 16px 0;">We received a request to reactivate your WatchList account. To complete this process, please use the following verification code:</p>

    <div class="otp-code" style="font-size: 28px; font-weight: bold; background: #f0f4ff; color: #2d3a6e; padding: 16px 0; text-align: center; border-radius: 6px; letter-spacing: 4px; margin: 24px 0;">
      {otpCode}
    </div>

    <p style="margin: 16px 0;">This code will expire in <strong>{expiryTime} minutes</strong>. Enter it in the app or website to verify your identity.</p>

    <div style="background: #fff8f8; border-left: 4px solid #ff9800; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; font-weight: bold; color: #d32f2f;">⚠️ Security Alert:</p>
      <p style="margin: 8px 0 0 0;">If you didn't request this reactivation, please <a href="{securityLink}" style="color: #2d3a6e; font-weight: 600;">secure your account</a> immediately.</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{reactivationLink}" class="button" style="background-color: #2d3a6e; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Complete Reactivation
      </a>
    </div>

    <p style="margin: 16px 0;">After reactivation:</p>
    <ul style="margin: 16px 0; padding-left: 24px;">
      <li>Your profile and data will be fully restored</li>
      <li>You'll regain access to all features</li>
      <li>Notification settings will remain unchanged</li>
    </ul>

    <p style="margin: 32px 0 16px 0;">Welcome back!<br><strong>The WatchList Team</strong></p>

    <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      &copy; WatchList, 2025<br>
      <span style="color: #bbb; font-size: 11px;">This is an automated message - please do not reply</span>
    </div>
  </div>
</body>
</html>`