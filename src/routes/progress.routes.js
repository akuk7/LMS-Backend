const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const {
    getAllProgress,
    getCourseProgress,
    markLessonComplete,
    markQuizComplete,
    getProgressStats
} = require('../controllers/progress.controller');

// Get user's progress for all enrolled courses
router.get('/', auth, getAllProgress);

// Get progress for a specific course
router.get('/course/:courseId', auth, getCourseProgress);

// Mark lesson as completed
router.post('/course/:courseId/lesson/:lessonId/complete', auth, markLessonComplete);

// Mark quiz as completed
router.post('/course/:courseId/quiz/:quizId/complete', auth, markQuizComplete);

// Get overall progress statistics
router.get('/stats', auth, getProgressStats);

module.exports = router; 