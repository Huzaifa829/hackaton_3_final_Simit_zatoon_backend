import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

// Create a new user
export const createUser = async (req, res) => {
  const { name, email, password, roles } = req.body;
  console.log(req.body);

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      roles,
    });

    // Save user to the database
    const savedUser = await user.save();
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.roles,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('====================================');
  console.log('Entered email:', email);
  console.log('Entered password:', password);  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Please tell admin to add you' });
    }
    
    console.log('====================================');
    console.log('Stored password (hashed):', user.password);  
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET_KEY, 
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude the password field
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id, '-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a user (permissions or role)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, roles } = req.body; // Extracting the data from the request body
console.log('====================================');
console.log(id, name, email, roles );
console.log('====================================');
  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the email is being updated and if it's already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
      user.email = email; // Update email if not taken
    }

    // Update the name if provided
    if (name) {
      user.name = name;
    }

    // Check and update roles
    if (Array.isArray(roles)) {
      roles.forEach((newRole) => {
        if (!user.roles.includes(newRole)) {
          user.roles.push(newRole); // Add the new role if not already in the array
        }
      });
    }

    // Save the updated user object
    const updatedUser = await user.save();

    // Send the updated user object in the response
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        roles: updatedUser.roles, // Return the updated roles
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
