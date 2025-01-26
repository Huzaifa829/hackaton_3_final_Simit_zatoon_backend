// routes/beneficiaryRoutes.js
import express from 'express';
import { registerBeneficiary, getBeneficiaries, assignToken } from '../controllers/beneficiaryController.js';

const router = express.Router();

// Register a new beneficiary
router.post('/register', registerBeneficiary);

// Get all beneficiaries
router.get('/', getBeneficiaries);

// Assign token based on purpose and department
router.post('/assign-token', assignToken);

export default router;
