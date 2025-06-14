# Learning Management System (LMS) Backend API

[![GitHub Repo](https://img.shields.io/badge/GitHub-akuk7%2FLMS--Backend-blue?logo=github)](https://github.com/akuk7/LMS-Backend.git)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20API-brightgreen?logo=vercel)](https://lms-backend-8p2ai154a-akuk7s-projects.vercel.app/)

---

## 🌐 Live Demo & Source Code

- **GitHub Repository:** [https://github.com/akuk7/LMS-Backend.git](https://github.com/akuk7/LMS-Backend.git)
- **Live API on Vercel:** [https://lms-backend-8p2ai154a-akuk7s-projects.vercel.app/](https://lms-backend-8p2ai154a-akuk7s-projects.vercel.app/)

---

## 🚀 Quick Start (Clone & Run Locally)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akuk7/LMS-Backend.git
   cd LMS-Backend
   ```

2. **Pull latest changes (if already cloned):**
   ```bash
   git pull origin main
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create a `.env` file in the root directory:**
   ```env
   # Server Configuration
   PORT=3000

   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_EXPIRES_IN=7d
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access the API locally:**
   - Default: [http://localhost:3000/](http://localhost:3000/)

---

## 🚀 Deployed on Vercel

This backend is deployed and live on Vercel:
- **Live API:** [https://lms-backend-8p2ai154a-akuk7s-projects.vercel.app/](https://lms-backend-8p2ai154a-akuk7s-projects.vercel.app/)

You can use this endpoint for frontend integration, testing, or demo purposes.

---

A robust backend API for a Learning Management System built with Node.js, Express, and MongoDB. This API provides comprehensive functionality for course management, user authentication, progress tracking, and quiz systems.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Secure password hashing with bcrypt
  - Admin user management

- **Course Management**
  - Create, read, update, delete courses
  - Course enrollment system
  - Course categorization and organization

- **Lesson Management**
  - Create and manage lessons within courses
  - Lesson content organization
  - Lesson completion tracking

- **Quiz System**
  - Multiple choice quiz creation
  - Quiz attempt tracking
  - Automatic scoring and pass/fail evaluation
  - One attempt per user per quiz

- **Progress Tracking**
  - Comprehensive progress monitoring
  - Lesson completion tracking
  - Quiz completion tracking
  - Course completion status
  - Progress statistics and analytics

- **Security Features**
  - Rate limiting (100 requests per 15 minutes)
  - Input validation and sanitization
  - CORS protection
  - Secure JWT implementation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd LMS-Backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create a `.env` file in the root directory:**
```env
# Server Configuration
PORT=3000

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=ca6119409a607da7293d8286acff700a90a2838b4baf7e60420cf8a5c3f25da1dae6499a0744e0b82f6f441ffd58c10c27
JWT_EXPIRES_IN=7d
```

4. **Start the development server:**
```bash
npm run dev
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | 3000 |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | No | 7d |

### Environment Variable Details:

- **MONGODB_URI**: Your MongoDB connection string. For local development: `mongodb://localhost:27017/lms`
- **JWT_SECRET**: A secure random string for JWT token signing. Generate one using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- **JWT_EXPIRES_IN**: Token expiration time (e.g., `1h`, `1d`, `7d`, `30d`)

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/make-admin` | Make user admin (admin only) | Yes (Admin) |

### Courses
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | Get all courses (paginated) | No |
| GET | `/api/courses/:id` | Get single course | No |
| POST | `/api/courses` | Create course | Yes (Admin) |
| PUT | `/api/courses/:id` | Update course | Yes (Admin) |
| DELETE | `/api/courses/:id` | Delete course | Yes (Admin) |
| POST | `/api/courses/:id/enroll` | Enroll in course | Yes |

### Lessons
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/lessons/course/:courseId` | Get lessons for a course | No |
| POST | `/api/lessons` | Create lesson | Yes (Admin) |
| PUT | `/api/lessons/:id` | Update lesson | Yes (Admin) |
| DELETE | `/api/lessons/:id` | Delete lesson | Yes (Admin) |

### Quizzes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/quizzes/course/:courseId` | Get quizzes for a course | Yes |
| POST | `/api/quizzes` | Create quiz | Yes (Admin) |
| POST | `/api/quizzes/:id/attempt` | Submit quiz attempt | Yes |
| GET | `/api/quizzes/:id/attempts` | Get quiz attempts for a user | Yes |

### Progress
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/progress` | Get user's progress for all courses | Yes |
| GET | `/api/progress/course/:courseId` | Get progress for a specific course | Yes |
| POST | `/api/progress/course/:courseId/lesson/:lessonId/complete` | Mark lesson as completed | Yes |
| POST | `/api/progress/course/:courseId/quiz/:quizId/complete` | Mark quiz as completed | Yes |
| GET | `/api/progress/stats` | Get overall progress statistics | Yes |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Roles:
- **User**: Can enroll in courses, complete lessons/quizzes, view progress
- **Admin**: Can create/manage courses, lessons, quizzes, and make other users admin

## 📝 Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Create Course
```http
POST /api/courses
Content-Type: application/json
Authorization: Bearer <admin_token>

{
    "title": "Database Management Systems",
    "description": "Learn about databases and SQL",
    "instructor": "Dr. Smith",
    "price": 99.99
}
```

### Create Quiz
```http
POST /api/quizzes
Content-Type: application/json
Authorization: Bearer <admin_token>

{
    "title": "Database Management Systems Quiz",
    "course": "64a1b2c3d4e5f6789012345",
    "passingScore": 70,
    "questions": [
        {
            "text": "What is a primary key in a database?",
            "options": [
                {"text": "A key that can be null", "isCorrect": false},
                {"text": "A unique identifier for each record", "isCorrect": true},
                {"text": "A key that references another table", "isCorrect": false}
            ]
        }
    ]
}
```

### Submit Quiz Attempt
```http
POST /api/quizzes/64a1b2c3d4e5f6789012344/attempt
Content-Type: application/json
Authorization: Bearer <user_token>

{
    "answers": [
        {
            "question": "64a1b2c3d4e5f6789012345",
            "selectedOption": 1
        }
    ]
}
```

## 🚨 Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, duplicate attempts)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Responses:
```json
{
    "message": "You have already attempted this quiz",
    "previousAttempt": {
        "score": 75,
        "passed": true,
        "attemptDate": "2024-01-15T10:30:00.000Z"
    }
}
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs are validated using express-validator
- **Password Hashing**: Passwords are hashed using bcrypt
- **JWT Security**: Secure token generation and verification
- **CORS Protection**: Cross-origin resource sharing protection

## 📊 Progress Tracking

The system tracks:
- **Lesson Completion**: One-time completion per user per lesson
- **Quiz Completion**: One-time completion per user per quiz
- **Quiz Attempts**: One attempt per user per quiz
- **Course Completion**: Only when ALL lessons AND quizzes are completed
- **Progress Statistics**: Overall completion rates and analytics

## 🚀 Development

### Start Development Server:
```bash
npm run dev
```

### Start Production Server:
```bash
npm start
```

### Available Scripts:
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if configured)

## 📁 Project Structure

```
src/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
└── index.js        # Main application file
```
