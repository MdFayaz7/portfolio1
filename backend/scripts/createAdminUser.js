import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db');
    console.log('✅ Connected to MongoDB');

    const email = 'fayazm5cs@gmail.com';
    const password = 'Fayaz@f2755';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔑 You can use this email to login');
      
      // Ask if user wants to update password
      console.log('\n🔄 Updating password for existing user...');
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log('✅ Password updated successfully!');
      process.exit(0);
    }

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
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();
