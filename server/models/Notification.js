import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['report', 'project_update', 'system'],
        default: 'report'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    },
    is_read: {
        type: Boolean,
        default: false
    },
    read_at: {
        type: Date
    }
}, { timestamps: true });

notificationSchema.index({ user_id: 1, is_read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

