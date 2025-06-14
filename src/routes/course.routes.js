const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse
} = require('../controllers/course.controller');

// Get all courses (public)
router.get('/', getAllCourses);

// Get single course (public)
router.get('/:id', getCourse);

// Create course (admin only)
router.post('/', [
    adminAuth,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('instructor').trim().notEmpty().withMessage('Instructor name is required'),
    body('price').isNumeric().withMessage('Price must be a number')
], createCourse);

// Update course (admin only)
router.put('/:id', [
    adminAuth,
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('instructor').optional().trim().notEmpty().withMessage('Instructor name cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number')
], updateCourse);

// Delete course (admin only)
router.delete('/:id', adminAuth, deleteCourse);

// Enroll in course
router.post('/:id/enroll', auth, enrollInCourse);

module.exports = router; 