import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  field: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null // null for current education
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  grade: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
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

export default mongoose.model('Education', educationSchema);
