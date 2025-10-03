import express from 'express';
import Skill from '../models/Skill.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateSkill } from '../utils/validation.js';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });
    
    // Return skills grouped by category for easy frontend consumption
    const skillsByCategory = {};
    skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    res.json({
      success: true,
      skills,
      skillsByCategory
    });
  } catch (error) {
    console.error('Get skills error:', error);
    // Return default skills data when MongoDB is not available
    const defaultSkills = [
      { _id: '1', name: 'React', category: 'Frontend', proficiency: 90, color: '#61DAFB', sortOrder: 1, isActive: true },
      { _id: '2', name: 'JavaScript', category: 'Languages', proficiency: 95, color: '#F7DF1E', sortOrder: 2, isActive: true },
      { _id: '3', name: 'Node.js', category: 'Backend', proficiency: 85, color: '#339933', sortOrder: 3, isActive: true },
      { _id: '4', name: 'MongoDB', category: 'Database', proficiency: 80, color: '#47A248', sortOrder: 4, isActive: true },
      { _id: '5', name: 'TypeScript', category: 'Languages', proficiency: 88, color: '#3178C6', sortOrder: 5, isActive: true },
      { _id: '6', name: 'Express.js', category: 'Backend', proficiency: 85, color: '#000000', sortOrder: 6, isActive: true }
    ];
    
    const skillsByCategory = {};
    defaultSkills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });
    
    res.json({
      success: true,
      skills: defaultSkills,
      skillsByCategory
    });
  }
});

// Create new skill (admin only)
router.post('/', authenticateToken, requireAdmin, validateSkill, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      skill
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating skill'
    });
  }
});

// Update skill (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill updated successfully',
      skill
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating skill'
    });
  }
});

// Delete skill (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting skill'
    });
  }
});

export default router;
