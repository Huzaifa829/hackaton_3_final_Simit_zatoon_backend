import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /\S+@\S+\.\S+/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    roles: {
      type: [String], // Array of roles
      enum: ['Admin', 'Receptionist', 'Department Staff', 'Beneficiary'],
      required: [true, 'Please select at least one role'],
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
