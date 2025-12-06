import express from 'express';
import {
    getAllContractors,
    getContractorById,
    createContractor,
    updateContractor,
    deleteContractor
} from '../controllers/contractorController.js';

const router = express.Router();

router.get('/', getAllContractors);
router.get('/:id', getContractorById);
router.post('/', createContractor);
router.put('/:id', updateContractor);
router.delete('/:id', deleteContractor);

export default router;

