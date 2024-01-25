import express from 'express';
import { login, register, verifyOtp, generateNewOTP, generateNewOTPForPasswordReset, resetPassword, generateNewOTPViaSms} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/login/verify', verifyOtp)
router.post('/login/generate-new', generateNewOTP)
router.post('/login/generate-new-sms', generateNewOTPViaSms)
router.post('/login/generate-new-password-reset', generateNewOTPForPasswordReset)
router.put('/login/password-reset/', resetPassword)

export default router;