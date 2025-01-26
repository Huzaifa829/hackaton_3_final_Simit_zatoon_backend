// models/Beneficiary.js
import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

export default Beneficiary;
