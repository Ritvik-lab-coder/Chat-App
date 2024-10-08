import express from 'express'
import { getAllUsers, login, logout, register, setAvatar } from '../controllers/userControllers.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.put('/set-avatar/:id', isAuthenticated, setAvatar);
router.get('/all-users/:id', isAuthenticated, getAllUsers);

export default router;