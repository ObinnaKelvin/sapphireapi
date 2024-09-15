import express from 'express';
import { login, staffLogin, register, verifyOtp, generateNewOTP, generateNewOTPForPasswordReset, resetPassword, resetStaffPassword, generateNewOTPViaSms} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/slogin', staffLogin)
router.post('/login/verify', verifyOtp)
router.post('/login/generate-new', generateNewOTP)
router.post('/login/generate-new-sms', generateNewOTPViaSms)
router.post('/login/generate-new-password-reset', generateNewOTPForPasswordReset)
router.put('/login/password-reset/', resetPassword)
router.put('/login/staff-password-reset/', resetStaffPassword)

export default router;