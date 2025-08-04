// src/routes/authRoutes.js
import { Router } from 'express';
import { registerUser, loginUser, handleContactForm } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/contact', handleContactForm); // Rota adicionada aqui!

export default router;