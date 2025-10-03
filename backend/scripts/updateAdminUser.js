import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const updateAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db');
    console.log('✅ Connected to MongoDB');

    const oldEmail = 'fayazm5cs@gmail.com';
    const newEmail = 'admin@portfolio.com';
    const newPassword = 'admin@123';

    // Delete old admin user if exists
    const oldAdmin = await User.findOne({ email: oldEmail });
    if (oldAdmin) {
      await User.deleteOne({ email: oldEmail });
      console.log('🗑️  Old admin user deleted:', oldEmail);
    } else {
      console.log('ℹ️  No old admin user found to delete');
    }

    // Check if new admin already exists
    const existingNewAdmin = await User.findOne({ email: newEmail });
    if (existingNewAdmin) {
      console.log('⚠️  New admin user already exists, updating password...');
      existingNewAdmin.password = newPassword;
      await existingNewAdmin.save();
      console.log('✅ Password updated for existing admin user');
    } else {
      // Create new admin user
      const newAdminUser = new User({
        email: newEmail,
        password: newPassword,
        role: 'admin'
      });

      await newAdminUser.save();
      console.log('✅ New admin user created successfully!');
    }

    console.log('\n🎉 Admin user setup complete!');
    console.log('📧 Email:', newEmail);
    console.log('🔑 Password:', newPassword);
    console.log('🚀 You can now login to the admin dashboard');

  } catch (error) {
    console.error('❌ Error updating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAdminUser();
