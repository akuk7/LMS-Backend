const Quiz = require('../models/quiz.model');
const Course = require('../models/course.model');
const Progress = require('../models/progress.model');
const mongoose = require('mongoose');

const getCourseQuizzes = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({ message: 'You must be enrolled to view quizzes' });
        }

        const quizzes = await Quiz.find({ course: req.params.courseId })
            .select('-questions.options.isCorrect'); // Don't send correct answers

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes' });
    }
};

const createQuiz = async (req, res) => {
    try {
        const course = await Course.findById(req.body.course);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const quiz = new Quiz(req.body);
        await quiz.save();

        // Add quiz to course
        course.quizzes.push(quiz._id);
        await course.save();

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz' });
    }
};

const submitQuizAttempt = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body;
        const userId = req.user._id;

        console.log('Quiz attempt submission:', { quizId: id, userId, answersCount: answers?.length });

        // Validate quiz ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid quiz ID' });
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        console.log('Quiz found:', quiz.title);

        // Check if user has already attempted this quiz
        const existingAttempt = quiz.attempts.find(
            attempt => attempt.user.toString() === userId.toString()
        );

        if (existingAttempt) {
            return res.status(400).json({ 
                message: 'You have already attempted this quiz',
                previousAttempt: {
                    score: existingAttempt.score,
                    passed: existingAttempt.passed,
                    attemptDate: existingAttempt.createdAt
                }
            });
        }

        // Check if user is enrolled in the course
        const course = await Course.findById(quiz.course);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.enrolledStudents.includes(userId)) {
            return res.status(403).json({ message: 'You must be enrolled to take this quiz' });
        }

        console.log('User is enrolled, calculating score...');

        // Calculate score
        let correctAnswers = 0;
        
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers must be an array' });
        }

        answers.forEach((answer, index) => {
            console.log(`Processing answer ${index}:`, answer);
            
            if (!answer.question || !answer.hasOwnProperty('selectedOption')) {
                throw new Error(`Invalid answer format at index ${index}`);
            }

            const question = quiz.questions.id(answer.question);
            if (!question) {
                throw new Error(`Question not found: ${answer.question}`);
            }

            if (answer.selectedOption < 0 || answer.selectedOption >= question.options.length) {
                throw new Error(`Invalid option index: ${answer.selectedOption} for question: ${answer.question}`);
            }

            if (question.options[answer.selectedOption].isCorrect) {
                correctAnswers++;
            }
        });

        const score = Math.round((correctAnswers / quiz.questions.length) * 100);
        const passed = score >= quiz.passingScore;

        console.log('Score calculated:', { correctAnswers, totalQuestions: quiz.questions.length, score, passed });

        // Create attempt
        const attempt = {
            user: userId,
            answers,
            score,
            passed
        };

        quiz.attempts.push(attempt);
        await quiz.save();

        console.log('Quiz attempt saved');

        // Update progress
        let progress = await Progress.findOne({
            user: userId,
            course: quiz.course
        });

        if (!progress) {
            progress = new Progress({
                user: userId,
                course: quiz.course,
                completedLessons: [],
                completedQuizzes: []
            });
        }

        // Add quiz attempt to progress
        progress.quizAttempts.push({
            quiz: quiz._id,
            score,
            passed,
            attemptDate: new Date()
        });

        // If quiz is passed, mark it as completed
        if (passed && !progress.completedQuizzes.includes(quiz._id)) {
            progress.completedQuizzes.push(quiz._id);
        }

        await progress.save();

        console.log('Progress updated');

        res.json({
            message: 'Quiz attempt submitted successfully',
            score,
            passed,
            attempt
        });
    } catch (error) {
        console.error('Error in submitQuizAttempt:', error);
        res.status(500).json({ 
            message: 'Error submitting quiz attempt',
            error: error.message 
        });
    }
};

const getQuizAttempts = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const attempts = quiz.attempts.filter(
            attempt => attempt.user.toString() === req.user._id.toString()
        );

        res.json(attempts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz attempts' });
    }
};

module.exports = {
    getCourseQuizzes,
    createQuiz,
    submitQuizAttempt,
    getQuizAttempts
}; 