import express from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getNotifications);
router.put('/:notificationId/read', auth, markAsRead);
router.put('/read-all', auth, markAllAsRead);

export default router;

