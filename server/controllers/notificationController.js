import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const { limit = 20, unreadOnly = false } = req.query;
        
        const query = { user_id: userId };
        if (unreadOnly === 'true') {
            query.is_read = false;
        }

        const notifications = await Notification.find(query)
            .populate('project_id', 'project_name project_id')
            .populate('report_id', 'photo_url report_type status')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        const unreadCount = await Notification.countDocuments({ 
            user_id: userId, 
            is_read: false 
        });

        return res.status(200).json({
            success: true,
            data: notifications,
            unreadCount
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const { notificationId } = req.params;

        const notification = await Notification.findOne({
            _id: notificationId,
            user_id: userId
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        notification.is_read = true;
        notification.read_at = new Date();
        await notification.save();

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        await Notification.updateMany(
            { user_id: userId, is_read: false },
            { 
                $set: { 
                    is_read: true, 
                    read_at: new Date() 
                } 
            }
        );

        return res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

