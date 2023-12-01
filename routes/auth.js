import express from 'express';
import { login, register, verifyOtp} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/login/verify', verifyOtp)

export default router;