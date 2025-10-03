#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Setting Admin User...\n');
console.log('📧 Email: fayazm5cs@gmail.com');
console.log('🔑 Password: Fayaz@f2755\n');

// Check if backend directory exists
if (!fs.existsSync('backend')) {
  console.error('❌ Backend directory not found. Please run this from the project root.');
  process.exit(1);
}

// Check if backend has node_modules
if (!fs.existsSync('backend/node_modules')) {
  console.log('📦 Installing backend dependencies...');
  try {
    execSync('cd backend && npm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install backend dependencies:', error.message);
    process.exit(1);
  }
}

console.log('🔧 Setting admin user...');
try {
  execSync('cd backend && npm run set-admin', { stdio: 'inherit' });
  console.log('\n🎉 Admin user set successfully!');
  console.log('📧 Email: fayazm5cs@gmail.com');
  console.log('🔑 Password: Fayaz@f2755');
  console.log('\n🚀 You can now login with these credentials');
} catch (error) {
  console.error('❌ Failed to set admin user:', error.message);
  console.log('\n💡 Manual setup:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Update backend/.env with your MongoDB URI');
  console.log('3. Run: cd backend && npm run set-admin');
}
