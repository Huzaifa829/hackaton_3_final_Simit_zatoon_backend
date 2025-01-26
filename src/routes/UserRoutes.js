import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} from '../controllers/UserController1.js';

const router = express.Router();

// Routes
router.post('/', createUser); // Create user
router.get('/', getAllUsers); // Get all users
router.post('/login', loginUser); // Create user
router.get('/:id', getUserById); // Get user by ID
router.put('/:id', updateUser); // Update user role/permissions
router.delete('/:id', deleteUser); // Delete user

export default router;
