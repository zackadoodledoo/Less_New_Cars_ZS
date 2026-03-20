import express from 'express';
import { renderLogin } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', renderLogin);

// If you later add POST /login, register it here:
// router.post('/login', handleLogin);

export default router;
