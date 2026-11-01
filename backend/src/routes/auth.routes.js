import express from 'express';
import { requestOTP, verifyOTP, logout, refreshToken, demoLogin } from '../controllers/auth.controller.js';
import { otpRateLimiter, loginRateLimiter } from '../middleware/rateLimiter.js';
import {  authenticateToken } from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/request-otp', otpRateLimiter, requestOTP);

router.post('/verify-otp', loginRateLimiter, verifyOTP);

router.post('/logout', authenticateToken, logout);

router.post('/refresh-token', refreshToken);

// Demo only: returns 404 unless DEMO_MODE=true
router.post('/demo-login', loginRateLimiter, demoLogin);

export default router;