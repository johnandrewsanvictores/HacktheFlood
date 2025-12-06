import Project from '../models/Project.js';
import Report from '../models/Report.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { notifyAllUsers } from '../utils/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({})
            .populate('contractor_id', 'company_name credit_score success_rate verified')
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: projects });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('contractor_id');
        
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        
        return res.status(200).json({ success: true, data: project });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        
        if (project.contractor_id) {
            await project.populate('contractor_id');
        }
        
        return res.status(201).json({ success: true, data: project });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Project with this ID or contract ID already exists' });
        }
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('contractor_id');
        
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        
        return res.status(200).json({ success: true, data: project });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        
        return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getProjectPhotos = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        const reports = await Report.find({ project_id: projectId })
            .sort({ submitted_at: -1 });

        const reportPhotos = reports.map(report => ({
            id: report._id,
            url: report.photo_url,
            type: 'report',
            report_type: report.report_type,
            status: report.status,
            date: report.submitted_at,
            latitude: report.latitude,
            longitude: report.longitude,
            accuracy: report.accuracy
        }));

        const projectPhotos = (project.documents || [])
            .filter(doc => doc.type === 'progress_photo' && doc.url)
            .map(doc => ({
                id: doc._id || doc.url,
                url: doc.url,
                type: 'progress',
                date: doc.uploaded_at || project.createdAt
            }));

        const allPhotos = [...reportPhotos, ...projectPhotos].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        return res.status(200).json({ 
            success: true, 
            data: allPhotos 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const reportIssue = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Photo is required' });
        }

        const { projectId, projectName, latitude, longitude, accuracy, timestamp } = req.body;

        if (!projectId || !latitude || !longitude) {
            if (req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            if (req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        const report = new Report({
            project_id: projectId,
            project_name: projectName || project.project_name,
            photo_url: `/uploads/reports/${req.file.filename}`,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            accuracy: accuracy ? parseFloat(accuracy) : null,
            report_type: 'issue',
            status: 'pending',
            submitted_at: timestamp ? new Date(timestamp) : new Date()
        });

        await report.save();

        const reportCount = await Report.countDocuments({ 
            project_id: projectId, 
            status: 'pending' 
        });
        
        if (reportCount >= 3) {
            project.is_flagged = true;
            await project.save();
        }

        notifyAllUsers(project.project_name, 'issue', project._id, report._id).catch(error => {
            console.error('Error sending notifications:', error);
        });

        return res.status(201).json({ 
            success: true, 
            message: 'Report submitted successfully',
            data: report 
        });
    } catch (error) {
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        return res.status(500).json({ success: false, error: error.message });
    }
};

