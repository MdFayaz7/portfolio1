import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  longDescription: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  image: {
    type: String, // URL or file path
    required: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  demoUrl: {
    type: String,
    trim: true,
    default: ''
  },
  githubUrl: {
    type: String,
    trim: true,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Planned'],
    default: 'Completed'
  },
  category: {
    type: String,
    enum: ['Web Application', 'Mobile App', 'Desktop App', 'Game', 'API', 'Other'],
    default: 'Web Application'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);
