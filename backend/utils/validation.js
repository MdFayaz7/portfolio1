import { body, validationResult } from 'express-validator';

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules
export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

export const validateEducation = [
  body('institution').trim().notEmpty().withMessage('Institution is required'),
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  body('field').trim().notEmpty().withMessage('Field is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  handleValidationErrors
];

export const validateSkill = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  handleValidationErrors
];

export const validateProject = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  handleValidationErrors
];

export const validateMessage = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  handleValidationErrors
];

export const validateProfile = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('welcomeMessage').trim().notEmpty().withMessage('Welcome message is required'),
  body('aboutText').trim().notEmpty().withMessage('About text is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  handleValidationErrors
];
