import Project from '../models/Project.js';

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

