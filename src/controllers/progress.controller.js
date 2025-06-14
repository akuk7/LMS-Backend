const Progress = require('../models/progress.model');
const Course = require('../models/course.model');
const mongoose = require('mongoose');

const getAllProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user._id })
            .populate('course', 'title')
            .populate('completedLessons', 'title')
            .populate('quizAttempts.quiz', 'title');

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress' });
    }
};

const getCourseProgress = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({ message: 'You must be enrolled to view progress' });
        }

        let progress = await Progress.findOne({
            user: req.user._id,
            course: req.params.courseId
        })
        .populate('completedLessons', 'title')
        .populate('quizAttempts.quiz', 'title');

        if (!progress) {
            progress = new Progress({
                user: req.user._id,
                course: req.params.courseId
            });
            await progress.save();
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course progress' });
    }
};

const markLessonComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = req.user._id;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ message: 'Invalid course or lesson ID' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(userId)) {
            return res.status(403).json({ message: 'You must be enrolled to mark lessons as complete' });
        }

        // Check if lesson exists in course
        if (!course.lessons.includes(lessonId)) {
            return res.status(404).json({ message: 'Lesson not found in this course' });
        }

        let progress = await Progress.findOne({
            user: userId,
            course: courseId
        });

        if (!progress) {
            progress = new Progress({
                user: userId,
                course: courseId,
                completedLessons: [],
                completedQuizzes: []
            });
        }

        // Check if lesson is already completed
        if (progress.completedLessons.includes(lessonId)) {
            return res.status(400).json({ 
                message: 'Lesson already completed',
                lessonId: lessonId,
                completedDate: progress.updatedAt
            });
        }

        // Add lesson to completed lessons
        progress.completedLessons.push(lessonId);
        await progress.save();

        // Populate the response
        await progress.populate('completedLessons', 'title');
        await progress.populate('completedQuizzes', 'title');

        res.json({
            message: 'Lesson marked as complete',
            progress: progress
        });
    } catch (error) {
        console.error('Error in markLessonComplete:', error);
        res.status(500).json({ message: 'Error marking lesson as complete' });
    }
};

const markQuizComplete = async (req, res) => {
    try {
        const { courseId, quizId } = req.params;
        const userId = req.user._id;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: 'Invalid course or quiz ID' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(userId)) {
            return res.status(403).json({ message: 'You must be enrolled to mark quizzes as complete' });
        }

        // Check if quiz exists in course
        if (!course.quizzes.includes(quizId)) {
            return res.status(404).json({ message: 'Quiz not found in this course' });
        }

        let progress = await Progress.findOne({
            user: userId,
            course: courseId
        });

        if (!progress) {
            progress = new Progress({
                user: userId,
                course: courseId,
                completedLessons: [],
                completedQuizzes: []
            });
        }

        // Check if quiz is already completed
        if (progress.completedQuizzes.includes(quizId)) {
            return res.status(400).json({ 
                message: 'Quiz already completed',
                quizId: quizId,
                completedDate: progress.updatedAt
            });
        }

        // Add quiz to completed quizzes
        progress.completedQuizzes.push(quizId);
        await progress.save();

        // Populate the response
        await progress.populate('completedLessons', 'title');
        await progress.populate('completedQuizzes', 'title');

        res.json({
            message: 'Quiz marked as complete',
            progress: progress
        });
    } catch (error) {
        console.error('Error in markQuizComplete:', error);
        res.status(500).json({ message: 'Error marking quiz as complete' });
    }
};

const getProgressStats = async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user._id })
            .populate('course', 'title lessons quizzes');

        const stats = {
            totalCourses: progress.length,
            completedCourses: progress.filter(p => p.isCompleted).length,
            attemptedCourses: progress.filter(p => !p.isCompleted && p.overallProgress > 0).length,
            averageProgress: progress.reduce((acc, p) => acc + p.overallProgress, 0) / progress.length || 0,
            courses: progress.map(p => ({
                courseId: p.course._id,
                courseTitle: p.course.title,
                progress: p.overallProgress,
                isCompleted: p.isCompleted,
                completedLessons: p.completedLessons.length,
                totalLessons: p.course.lessons.length,
                completedQuizzes: p.completedQuizzes.length,
                totalQuizzes: p.course.quizzes.length,
                quizAttempts: p.quizAttempts.length
            }))
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress statistics' });
    }
};

module.exports = {
    getAllProgress,
    getCourseProgress,
    markLessonComplete,
    markQuizComplete,
    getProgressStats
}; 