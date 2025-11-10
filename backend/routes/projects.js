import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from '../models/Project.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateProject } from '../utils/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for project image uploads (local storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    let query = { isActive: true };
    
    if (featured === 'true') {
      query.featured = true;
    }

    const projects = await Project.find(query)
      .sort({ sortOrder: 1, createdAt: -1 });
    
    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    // Return default projects data when MongoDB is not available
    const defaultProjects = [
      {
        _id: '1',
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.',
        image: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=E-Commerce+App',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        demoUrl: 'https://demo.example.com',
        githubUrl: 'https://github.com/username/ecommerce',
        featured: true,
        status: 'Completed',
        category: 'Web Application',
        sortOrder: 1,
        isActive: true
      },
      {
        _id: '2',
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
        image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Task+Manager',
        technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
        demoUrl: 'https://tasks.example.com',
        githubUrl: 'https://github.com/username/taskmanager',
        featured: true,
        status: 'Completed',
        category: 'Web Application',
        sortOrder: 2,
        isActive: true
      },
      {
        _id: '3',
        title: 'Weather Dashboard',
        description: 'A responsive weather dashboard that displays current weather conditions and forecasts for multiple cities with interactive maps.',
        image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Weather+App',
        technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
        demoUrl: 'https://weather.example.com',
        githubUrl: 'https://github.com/username/weather',
        featured: false,
        status: 'Completed',
        category: 'Web Application',
        sortOrder: 3,
        isActive: true
      }
    ];
    
    let filteredProjects = defaultProjects;
    if (featured === 'true') {
      filteredProjects = defaultProjects.filter(project => project.featured);
    }
    
    res.json({
      success: true,
      projects: filteredProjects
    });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
});

// Create new project (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const projectData = {};

    // Handle file upload
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    // Parse form fields from req.body (multer populates this for non-file fields)
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && !(key === 'image' && typeof req.body[key] === 'object' && !Array.isArray(req.body[key]))) {
        projectData[key] = req.body[key];
      }
    });

    // Parse technologies if it's a string
    if (projectData.technologies && typeof projectData.technologies === 'string') {
      projectData.technologies = projectData.technologies.split(',').map(tech => tech.trim());
    }

    // Validate required fields manually to provide clearer error
    if (!projectData.title || !projectData.description || !projectData.image) {
      return res.status(400).json({
        success: false,
        message: 'Project title, description, and image are required'
      });
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
});

// Update project (admin only)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const projectData = {};

    // Handle file upload
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    // Parse form fields from req.body (multer populates this for non-file fields)
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && !(key === 'image' && typeof req.body[key] === 'object' && !Array.isArray(req.body[key]))) {
        projectData[key] = req.body[key];
      }
    });

    // Parse technologies if it's a string
    if (projectData.technologies && typeof projectData.technologies === 'string') {
      projectData.technologies = projectData.technologies.split(',').map(tech => tech.trim());
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
});

// Delete project (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project'
    });
  }
});

// Toggle project featured status (admin only)
router.patch('/:id/featured', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.json({
      success: true,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`,
      project
    });
  } catch (error) {
    console.error('Toggle project featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
});

export default router;
