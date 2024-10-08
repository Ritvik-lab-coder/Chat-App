import express from 'express'
import isAuthenticated from '../middlewares/authMiddleware.js';
import { addMessage, getAllMessages } from '../controllers/messageControllers.js';

const router = express.Router();

router.post('/add-message', isAuthenticated, addMessage);
router.get('/get-message', isAuthenticated, getAllMessages);

export default router;