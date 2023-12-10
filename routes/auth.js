import express from 'express';
import { login, register, verifyOtp, generateNewOTP} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/login/verify', verifyOtp)
router.post('/login/generate-new', generateNewOTP)

export default router;