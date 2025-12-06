import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    project_name: {
        type: String,
        required: true
    },
    photo_url: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number
    },
    report_type: {
        type: String,
        enum: ['issue', 'progress', 'completion', 'other'],
        default: 'issue'
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'for_inspection'],
        default: 'pending'
    },
    submitted_at: {
        type: Date,
        default: Date.now
    },
    verified_at: {
        type: Date
    },
    verified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;

