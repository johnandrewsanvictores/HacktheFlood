import Contractor from '../models/Contractor.js';

export const getAllContractors = async (req, res) => {
    try {
        const contractors = await Contractor.find({})
            .populate('projects', 'project_name status contract_id risk_score')
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: contractors });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getContractorById = async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id)
            .populate('projects', 'project_name status contract_id risk_score approved_budget contract_cost start_date completion_date_actual');
        
        if (!contractor) {
            return res.status(404).json({ success: false, error: 'Contractor not found' });
        }
        
        return res.status(200).json({ success: true, data: contractor });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const createContractor = async (req, res) => {
    try {
        const contractor = new Contractor(req.body);
        await contractor.save();
        return res.status(201).json({ success: true, data: contractor });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Contractor with this company name already exists' });
        }
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const updateContractor = async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('projects');
        
        if (!contractor) {
            return res.status(404).json({ success: false, error: 'Contractor not found' });
        }
        
        return res.status(200).json({ success: true, data: contractor });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteContractor = async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndDelete(req.params.id);
        
        if (!contractor) {
            return res.status(404).json({ success: false, error: 'Contractor not found' });
        }
        
        return res.status(200).json({ success: true, message: 'Contractor deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

