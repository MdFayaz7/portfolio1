import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import Profile from '../models/Profile.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateProfile } from '../utils/validation.js';

const router = express.Router();

// Configure multer for profile file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Get profile (public)
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.getProfile();
    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    // Return default profile data when MongoDB is not available
    const defaultProfile = {
      _id: 'default',
      name: 'Your Name',
      title: 'Full Stack Developer',
      profilePicture: '/default-profile.jpg',
      welcomeMessage: 'Welcome to my portfolio! I am a passionate developer with expertise in modern web technologies.',
      aboutText: 'I am a passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions and bringing ideas to life through clean, efficient code. With a strong foundation in both frontend and backend development, I specialize in building scalable web applications.',
      resumeUrl: '',
      email: 'your-email@example.com',
      phone: '+1 (234) 567-890',
      location: 'Your Location',
      socialLinks: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        twitter: 'https://twitter.com/yourusername'
      },
      cvText: 'With a strong foundation in both frontend and backend development, I specialize in building scalable web applications using technologies like React, Node.js, and MongoDB.'
    };
    
    res.json({
      success: true,
      profile: defaultProfile
    });
  }
});

// Download resume
router.get('/resume', async (req, res) => {
  try {
    const profile = await Profile.getProfile();
    if (!profile.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Normalize resume path to handle both '/uploads/...' and 'uploads/...'
    const normalizedRelative = profile.resumeUrl.startsWith('/')
      ? profile.resumeUrl.slice(1)
      : profile.resumeUrl;

    let filePath = path.join(process.cwd(), normalizedRelative);
    if (!fs.existsSync(filePath)) {
      // Fallback: try resolving from current file directory
      filePath = path.join(process.cwd(), normalizedRelative.replace('uploads', path.join('backend', 'uploads')));
    }
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found'
      });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while downloading resume'
    });
  }
});

// Update profile (admin only)
router.put('/', authenticateToken, requireAdmin, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'homeImage', maxCount: 1 },
  { name: 'aboutImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const profile = await Profile.getProfile();

    // Update profile with form data (text fields)
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        if (value === undefined || value === '') return;
        if (key.startsWith('socialLinks.')) {
          const field = key.split('.')[1];
          if (!profile.socialLinks) profile.socialLinks = {};
          profile.socialLinks[field] = value;
        } else {
          profile[key] = value;
        }
      });
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePicture && req.files.profilePicture[0]) {
        profile.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
      }
      if (req.files.resume && req.files.resume[0]) {
        profile.resumeUrl = `uploads/${req.files.resume[0].filename}`;
      }
      if (req.files.homeImage && req.files.homeImage[0]) {
        profile.homeImage = `/uploads/${req.files.homeImage[0].filename}`;
      }
      if (req.files.aboutImage && req.files.aboutImage[0]) {
        profile.aboutImage = `/uploads/${req.files.aboutImage[0].filename}`;
      }
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

export default router;
