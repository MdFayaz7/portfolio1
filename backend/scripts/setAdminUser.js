import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const setAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db');
    console.log('✅ Connected to MongoDB');

    const email = 'fayazm5cs@gmail.com';
    const password = 'Fayaz@f2755';

    // Delete any existing admin users first
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️  Cleared all existing admin users');

    // Create new admin user
    const adminUser = new User({
      email: email,
      password: password,
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🚀 You can now login to the admin dashboard');

  } catch (error) {
    console.error('❌ Error setting admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setAdminUser();
