const Lesson = require('../models/lesson.model');
const Course = require('../models/course.model');

const getCourseLessons = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({ message: 'You must be enrolled to view lessons' });
        }

        const lessons = await Lesson.find({ course: req.params.courseId })
            .sort({ order: 1 });

        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lessons' });
    }
};

const createLesson = async (req, res) => {
    try {
        const course = await Course.findById(req.body.course);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lesson = new Lesson(req.body);
        await lesson.save();

        // Add lesson to course
        course.lessons.push(lesson._id);
        await course.save();

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lesson' });
    }
};

const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lesson' });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Remove lesson from course
        await Course.findByIdAndUpdate(
            lesson.course,
            { $pull: { lessons: lesson._id } }
        );

        await lesson.remove();
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lesson' });
    }
};

module.exports = {
    getCourseLessons,
    createLesson,
    updateLesson,
    deleteLesson
}; 