import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String, // URL to profile image
    required: true
  },
  homeImage: {
    type: String, // URL to home section image
    default: ''
  },
  aboutImage: {
    type: String, // URL to about section image
    default: ''
  },
  welcomeMessage: {
    type: String,
    required: true,
    maxlength: 500
  },
  aboutText: {
    type: String,
    required: true,
    maxlength: 2000
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  socialLinks: {
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    website: { type: String, trim: true }
  },
  cvText: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Create a singleton profile
profileSchema.statics.getProfile = async function() {
  let profile = await this.findOne();
  if (!profile) {
    profile = new this({
      name: 'Your Name',
      title: 'Full Stack Developer',
      profilePicture: '/default-profile.jpg',
      welcomeMessage: 'Welcome to my portfolio! I am a passionate developer...',
      aboutText: 'I am a passionate full-stack developer...',
      email: 'your-email@example.com',
      location: 'Your Location'
    });
    await profile.save();
  }
  return profile;
};

export default mongoose.model('Profile', profileSchema);
