// controllers/beneficiaryController.js
import Beneficiary from '../Models/Beneficiary.js';
import crypto from 'crypto'; // for generating a token

// Register a new beneficiary
export const registerBeneficiary = async (req, res) => {
  const { cnic, name, contact, address, purpose, department } = req.body;
  
  try {
    // Check if the beneficiary already exists based on CNIC
    const existingBeneficiary = await Beneficiary.findOne({ cnic });
    if (existingBeneficiary) {
      return res.status(400).json({ message: 'Beneficiary with this CNIC already exists' });
    }
    
    // Generate a unique token for the beneficiary
    const token = crypto.randomBytes(16).toString('hex');
    
    const newBeneficiary = new Beneficiary({
      cnic,
      name,
      contact,
      address,
      purpose,
      department,
      token,
    });

    await newBeneficiary.save();
    res.status(201).json({ message: 'Beneficiary registered successfully', beneficiary: newBeneficiary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a list of all beneficiaries
export const getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find();
    res.status(200).json(beneficiaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign token based on purpose and department
export const assignToken = async (req, res) => {
  const { cnic, purpose, department } = req.body;

  try {
    const beneficiary = await Beneficiary.findOne({ cnic });

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    // Assign new token (example: could be based on purpose & department logic)
    const newToken = crypto.randomBytes(16).toString('hex');
    beneficiary.token = newToken;
    beneficiary.department = department;
    beneficiary.purpose = purpose;

    await beneficiary.save();
    res.status(200).json({ message: 'Token assigned successfully', token: newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
