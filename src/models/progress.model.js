const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    completedQuizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    quizAttempts: [{
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        score: Number,
        passed: Boolean,
        attemptDate: Date
    }],
    overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Calculate overall progress and completion status before saving
progressSchema.pre('save', async function(next) {
    try {
        const Course = mongoose.model('Course');
        const course = await Course.findById(this.course);
        
        if (course) {
            const totalLessons = course.lessons.length;
            const totalQuizzes = course.quizzes.length;
            const completedLessons = this.completedLessons.length;
            const completedQuizzes = this.completedQuizzes.length;
            
            // Calculate progress based on lessons and quizzes
            const totalItems = totalLessons + totalQuizzes;
            const completedItems = completedLessons + completedQuizzes;
            
            if (totalItems > 0) {
                this.overallProgress = Math.round((completedItems / totalItems) * 100);
            } else {
                this.overallProgress = 0;
            }
            
            // Course is completed only if ALL lessons and quizzes are completed
            this.isCompleted = (completedLessons === totalLessons && completedQuizzes === totalQuizzes);
        } else {
            this.overallProgress = 0;
            this.isCompleted = false;
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 