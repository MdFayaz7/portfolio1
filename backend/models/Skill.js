import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Tools', 'Languages', 'Database', 'Other'],
    default: 'Other'
  },
  proficiency: {
    type: Number,
    min: 1,
    max: 100,
    default: 50
  },
  icon: {
    type: String,
    trim: true
  },
  iconUrl: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
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

export default mongoose.model('Skill', skillSchema);
