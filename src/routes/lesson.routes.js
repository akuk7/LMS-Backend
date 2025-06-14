const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const {
    getCourseLessons,
    createLesson,
    updateLesson,
    deleteLesson
} = require('../controllers/lesson.controller');

// Get lessons for a course
router.get('/course/:courseId', auth, getCourseLessons);

// Create lesson (admin only)
router.post('/', [
    adminAuth,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('videoUrl').trim().notEmpty().withMessage('Video URL is required'),
    body('course').notEmpty().withMessage('Course ID is required'),
    body('order').isNumeric().withMessage('Order must be a number')
], createLesson);

// Update lesson (admin only)
router.put('/:id', [
    adminAuth,
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('videoUrl').optional().trim().notEmpty().withMessage('Video URL cannot be empty'),
    body('order').optional().isNumeric().withMessage('Order must be a number')
], updateLesson);

// Delete lesson (admin only)
router.delete('/:id', adminAuth, deleteLesson);

module.exports = router; 