import rateLimit from 'express-rate-limit';

export const otpResendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.email || req.ip,
  message: {
    success: false,
    message: 'Too many OTP requests, try again later'
  }
});
