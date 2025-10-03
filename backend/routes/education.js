import express from 'express';
import Education from '../models/Education.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateEducation } from '../utils/validation.js';

const router = express.Router();

// Get all education entries
router.get('/', async (req, res) => {
  try {
    const education = await Education.find({ isActive: true })
      .sort({ sortOrder: 1, startDate: -1 });
    
    res.json({
      success: true,
      education
    });
  } catch (error) {
    console.error('Get education error:', error);
    // Return default education data when MongoDB is not available
    const defaultEducation = [
      {
        _id: 'default1',
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2020-09-01',
        endDate: '2024-06-01',
        description: 'Focused on software engineering, algorithms, and web development.',
        grade: '3.8/4.0',
        location: 'New York, NY',
        sortOrder: 1,
        isActive: true
      }
    ];
    
    res.json({
      success: true,
      education: defaultEducation
    });
  }
});

// Create new education entry (admin only)
router.post('/', authenticateToken, requireAdmin, validateEducation, async (req, res) => {
  try {
    const education = new Education(req.body);
    await education.save();

    res.status(201).json({
      success: true,
      message: 'Education entry created successfully',
      education
    });
  } catch (error) {
    console.error('Create education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating education entry'
    });
  }
});

// Update education entry (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Education entry updated successfully',
      education
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating education entry'
    });
  }
});

// Delete education entry (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Education entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting education entry'
    });
  }
});

export default router;
