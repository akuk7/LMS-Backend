const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const {
    getCourseQuizzes,
    createQuiz,
    submitQuizAttempt,
    getQuizAttempts
} = require('../controllers/quiz.controller');

// Get quizzes for a course
router.get('/course/:courseId', auth, getCourseQuizzes);

// Create quiz (admin only)
router.post('/', [
    adminAuth,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('course').notEmpty().withMessage('Course ID is required'),
    body('questions').isArray().withMessage('Questions must be an array'),
    body('questions.*.text').trim().notEmpty().withMessage('Question text is required'),
    body('questions.*.options').isArray().withMessage('Options must be an array'),
    body('questions.*.options.*.text').trim().notEmpty().withMessage('Option text is required'),
    body('questions.*.options.*.isCorrect').isBoolean().withMessage('isCorrect must be a boolean')
], createQuiz);

// Submit quiz attempt
router.post('/:id/attempt', [
    auth,
    body('answers').isArray().withMessage('Answers must be an array'),
    body('answers.*.question').notEmpty().withMessage('Question ID is required'),
    body('answers.*.selectedOption').isNumeric().withMessage('Selected option must be a number')
], submitQuizAttempt);

// Get quiz attempts for a user
router.get('/:id/attempts', auth, getQuizAttempts);

module.exports = router; 